import React, {useEffect, useRef, useState} from "react";
import "./ChatView.css"
import {ContractPopup} from "./ContractPopup"
import {PaymentPopup} from "./PaymentPopup";
import {
    Avatar,
    ChatContainer,
    Conversation,
    ConversationList,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    Search,
    SendButton,
    Sidebar
} from '@chatscope/chat-ui-kit-react';
import {AcceptContractPopup} from "./AcceptContractPopup";
import {ConfirmJobCompletionPopup} from "./ConfirmJobCompletionPopup";
import {RatingPopup} from "./RatingPopup";
import axios from "axios";
import {io} from "socket.io-client";

export function ChatView() {

    const state = {
        chats: [],
        //messages: [],
        message: '',
        price: null,
        startingDate: null,
        isCraftman: false,
        //TODO: we need the chatPartnerID for rating somewhere here
        chatPartnerID: null
    }
    let user = '';
    let userId = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
        userId = JSON.parse(sessionStorage.getItem('userData')).id;
    }

    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    //test states are: "noPayment", "openContract", "contractEstablished", "paymentDone", "jobCompleted"
    const [contractState, setContractState] = useState("noPayment");
    //chatscope.io conversations
    const [conversations, setConversations] = useState([]);
    const [chats, setChats] = useState([]);
    const chatsRef = useRef([]);
    const [activeChatId, setActiveChatId] = useState('');
    //added because activeChatId state could not be accessed from useEffect
    const activeChatIdRef = useRef('');

    //initialize socket for live chat as null
    const socket = useRef(null);

    //gets chats & messages; creates conversations bar
    function getChats() {
        //get chats with messages from db
        axios.get('/api/chat/getMyChats').then(res => {
            //only continue if conversations are not set already
            if (conversations.length !== 0) return;
            //create chatscope.io Conversation UI components from received chats
            //TODO: mark active chat; hint: Conversation can have 'active' attribute
            let chatTemp = res.data.map(chatWithPartner => {
                return <Conversation name={chatWithPartner.chat.title} active={false}
                                     info={"Chat partner: " + chatWithPartner.partnerUsername}
                                     onClick={() => {
                                         setActiveChatId(chatWithPartner.chat._id);
                                         activeChatIdRef.current = chatWithPartner.chat._id;
                                     }}>
                    <Avatar src={"defaultAvatar.png"} name={chatWithPartner.partnerUsername}/>
                    <Conversation.Operations
                        onClick={() => console.log('Operations clicked ' + chatWithPartner.partnerUsername)}/>
                </Conversation>;
            });
            setConversations([chatTemp]);
            //save received chats in local copy
            chatsRef.current = res.data;
            setChats(res.data);
        })
    }

    //create websocket, connect to rooms & handle received messages
    const chatCount = useRef(0);
    useEffect(() => {
        //check so execution only happens when chats are loaded from database
        if (chats.length === chatCount.current) return;
        //chats are loaded
        chatCount.current = chats.length;
        setActiveChatId(chats[0].chat._id);
        activeChatIdRef.current = chats[0].chat._id;
        //once chats are loaded, create websocket
        socket.current = io("ws://localhost:3002");
        //join room for each chat
        chats.forEach(chatOb => {
            socket.current.emit("create", chatOb.chat._id);
        })
        //set up code to execute when message is received
        socket.current.on("receiveMessage", (message) => {
            //write message to local copy of chats
            let newChats = [...chatsRef.current];
            newChats.forEach(chatWithPartner => {
                if (chatWithPartner.chat._id === message.chat) {
                    chatWithPartner.chat.messages.push(message);
                }
            })
            chatsRef.current = newChats;
            setChats(newChats);
            //if chat of incoming message is active, show in UI
            if (message.chat === activeChatIdRef.current) {
                updateActiveChat(message.chat, newChats);
            }
        })

    }, [chats])

    /*
        updates active chat messages using id of chat to update messages from.
        second parameter is optional chat object when calling from a place where "chats" state might not be up-to-date
     */
    function updateActiveChat(activeId, newChats = null) {
        if (newChats === null) newChats = chats;
        //find chat with id of active chat from local storage
        let chatToLoad = newChats.find(chatWithPartner => chatWithPartner.chat._id === activeId);
        //create message objects for frontend framework
        let tempMessages = [];
        chatToLoad.chat.messages.forEach(message => {
            let tempMessage = {};
            tempMessage.message = message.content;
            tempMessage.sentTime = message.createdAt.toString();
            if (message.author === userId) {
                tempMessage.direction = 'outgoing';
            } else {
                tempMessage.direction = 'incoming';
            }
            tempMessages.push(tempMessage);
        });
        //sort messages by date & set state
        setMessages(tempMessages.sort(
            (objA, objB) => Number(objA.sentTime) - Number(objB.sentTime),
        ));
    }

    //display messages of other chat when active chat is changed
    useEffect(() => {
        //don't load anything on activeChat initialization
        if (activeChatId !== '') updateActiveChat(activeChatId);
    }, [activeChatId])

    //called when message is sent from UI
    const handleSend = message => {
        //update UI
        setMessages([...messages, {
            message,
            direction: 'outgoing'
        }]);
        setMsgInputValue("");
        inputRef.current?.focus();

        //write message to db
        let tempMessage = {
            content: message,
            author: userId,
            chat: activeChatId,
            isSystemMessage: false,
            createdAt: new Date()
        }
        axios.post('/api/chat/postMessageToChat', tempMessage);

        //write message to local copy of chats
        let newChats = [...chatsRef.current];
        newChats.forEach(chatWithPartner => {
            if (chatWithPartner.chat._id === activeChatId) {
                chatWithPartner.chat.messages.push(tempMessage);
            }
        })
        chatsRef.current = newChats;
        setChats(newChats);

        //send message using websocket for live chat
        socket.current.emit("sendMessage", tempMessage);
    };

    return (
        <div>
            <label>My Messages</label>
            <div className="chatContainer">
                <MainContainer>
                    <Sidebar position="left" scrollable={false}>
                        <ConversationList>
                            {getChats()}
                            {conversations}
                        </ConversationList>
                    </Sidebar>
                    <ChatContainer>
                        <MessageList>
                            {messages.map((m, i) => <Message key={i} model={m}/>)}
                        </MessageList>
                        <div as={MessageInput} style={{
                            display: "flex",
                            flexDirection: "row",
                            borderTop: "1px dashed #d1dbe4"
                        }}>
                            {!state.isCraftman && (contractState === "noPayment" || contractState === "openContract") &&
                                <ContractPopup chatID={activeChatId}/>
                            }
                            {!state.isCraftman && contractState === "contractEstablished" &&
                                <PaymentPopup price={state.price}/>
                            }
                            {!state.isCraftman && contractState === "paymentDone" &&
                                <ConfirmJobCompletionPopup/>
                            }
                            {state.isCraftman && contractState === "openContract" &&
                                <AcceptContractPopup price={state.price} date={state.startingDate}/>
                            }
                            {contractState === "jobCompleted" &&
                                <RatingPopup chatPartnerID={state.chatPartnerID}/>
                            }
                            <MessageInput value={msgInputValue} onChange={setMsgInputValue} onSend={handleSend}
                                          placeholder="Type message here" attachButton={false} sendButton={false}
                                          style={{
                                              flexGrow: 1,
                                              borderTop: 0,
                                              flexShrink: "initial"
                                          }}/>
                            <SendButton onClick={() => handleSend(msgInputValue)}
                                        disabled={msgInputValue.length === 0} style={{
                                fontSize: "1.2em",
                                marginLeft: 0,
                                paddingLeft: "0.2em",
                                paddingRight: "0.2em"
                            }}/>
                        </div>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );

}
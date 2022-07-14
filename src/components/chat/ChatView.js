import React, {useEffect, useRef, useState} from "react";
import "./ChatView.css"
import {ContractPopup} from "./ContractPopup"
import {PaymentPopup} from "./PaymentPopup";
import {DropdownButton, Dropdown} from "react-bootstrap";
import {
    Avatar,
    ChatContainer,
    Conversation,
    ConversationList,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    SendButton,
    Sidebar
} from '@chatscope/chat-ui-kit-react';
import {AcceptContractPopup} from "./AcceptContractPopup";
import {ConfirmJobCompletionPopup} from "./ConfirmJobCompletionPopup";
import {RatingPopup} from "./RatingPopup";
import axios from "axios";
import {io} from "socket.io-client";

export function ChatView() {

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
    const [activeContractStatus, setActiveContractStatus] = useState("");
    const [contractStates, setContractStates] = useState([]);
    const contractStatesRef = useRef([]);
    const [isCurrentlyCraftsman, setIsCurrentlyCraftsman] = useState(false);
    const [currentChatPartnerID, setCurrentChatPartnerID] = useState("");
    //chatscope.io conversations
    const [conversations, setConversations] = useState([]);
    const [chats, setChats] = useState([]);
    const chatsRef = useRef([]);
    const [activeChatId, setActiveChatId] = useState('');
    //added because activeChatId state could not be accessed from useEffect
    const activeChatIdRef = useRef('');

    //initialize socket for live chat as null
    const socket = useRef(null);

    //get chats once when page is loaded
    useEffect(() => {
        getChats();
    }, [])

    //gets chats & messages; sets conversations for conversations bar
    function getChats() {
        //get chats with messages from db
        axios.get('/api/chat/getMyChats').then(res => {
            //only continue if # of chats is > 0
            if (res.data.length === 0) return;
            //order chats
            let orderedRes = orderChats(res.data);
            //set conversations, which automatically updates HTML
            setConversations(orderedRes);
            //save received chats in local copy
            chatsRef.current = orderedRes;
            setChats(orderedRes);
            //save contract
            let idArr = orderedRes.map(chat => {
                return chat.chat.contract;
            })
            axios.get('api/chat/getContractsFromIdArray', {params: {idArray: idArr}}).then(res => {
                setContractStates(res.data);
                contractStatesRef.current = res.data;
            })
        })
    }

    function orderChats(chatObjs) {
        return chatObjs.sort((a, b) => {
            //order empty chats on top
            if (a.chat.messages.length === 0) {
                return -1
            } else if (b.chat.messages.length === 0) {
                return 1;
            }
            //order chats with messages below
            else {
                //order chats by send time of the latest message; also directly orders messages
                let reverseOrderedMessagesA = a.chat.messages.sort(
                    (objA, objB) => Date.parse(objA.createdAt) - Date.parse(objB.createdAt)
                );
                let reverseOrderedMessagesB = b.chat.messages.sort(
                    (objA, objB) => Date.parse(objA.createdAt) - Date.parse(objB.createdAt)
                );
                let latestMessageFromA = reverseOrderedMessagesA[reverseOrderedMessagesA.length - 1];
                let latestMessageFromB = reverseOrderedMessagesB[reverseOrderedMessagesB.length - 1];
                return Date.parse(latestMessageFromB.createdAt) - Date.parse(latestMessageFromA.createdAt);
            }
        })
    }

    //create websocket, connect to rooms & handle received messages
    const chatCount = useRef(0);
    useEffect(() => {
        //check so execution only happens when chats are loaded from database
        if (chats.length === chatCount.current) return;
        //chats are loaded
        chatCount.current = chats.length;
        //if no chats are present, don't continue
        if (chats.length === 0) return;
        setActiveChatId(chats[0].chat._id);
        activeChatIdRef.current = chats[0].chat._id;
        //select current ID of chat partner
        if (chats[0].chat.users.craftsman === userId) {
            setCurrentChatPartnerID(chats[0].chat.users.client)
        } else {
            setCurrentChatPartnerID(chats[0].chat.users.craftsman)
        }
        //once chats are loaded, disconnect old socket and create new one
        if (socket.current !== null) socket.current.emit("forceDisconnect");
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
            //update contracts when receiving system message
            if (message.isSystemMessage) {
                let contrId = chats.find(chat => chat.chat._id === message.chat).chat.contract;
                //get contract from id in message
                axios.get('/api/chat/getContract', {params: {contractId: contrId}}).then(res => {
                    //update local copy of contracts
                    let newContractStates = [...contractStatesRef.current];
                    newContractStates = newContractStates.map(contr => {
                        if (contr._id === res.data._id) {
                            return res.data;
                        } else {
                            return contr;
                        }
                    })
                    contractStatesRef.current = newContractStates;
                    setContractStates(newContractStates);
                })
            }
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
        //set active contract status
        if (contractStates.length !== 0) {
            setActiveContractStatus(contractStates.find(contract => contract.chat === activeId).paymentStatus);
            let currentChat = chatsRef.current.find(chat => chat.chat._id === activeChatIdRef.current).chat
            setIsCurrentlyCraftsman(currentChat.users.craftsman === userId);
            //select current ID of chat partner
            if (currentChat.users.craftsman === userId) {
                setCurrentChatPartnerID(currentChat.users.client)
            } else {
                setCurrentChatPartnerID(currentChat.users.craftsman)
            }
        }
        //find chat with id of active chat from local storage
        let chatToLoad = newChats.find(chatWithPartner => chatWithPartner.chat._id === activeId);
        //create message objects for frontend framework
        let tempMessages = [];
        chatToLoad.chat.messages.forEach(message => {
            //create message
            let tempMessage = {};
            //add time when it was sent
            tempMessage.sentTime = message.createdAt.toString();
            //if message is system message, set payload
            if (message.isSystemMessage) {
                tempMessage.payload = message.content;
            } else {
                tempMessage.message = message.content;
            }
            //decide if message is incoming or outgoing depending on who sent it
            if (message.author === userId) {
                tempMessage.direction = 'outgoing';
            } else {
                tempMessage.direction = 'incoming';
            }
            tempMessages.push(tempMessage);
        });
        //sort messages by date & set state
        setMessages(tempMessages);
    }

    //display messages of other chat when active chat is changed
    useEffect(() => {
        //don't load anything on activeChat initialization
        if (activeChatId !== '') updateActiveChat(activeChatId);
    }, [activeChatId])

    //update active contract status when contracts are changed
    useEffect(() => {
        if (contractStates.length !== 0) {
            setActiveContractStatus(contractStates.find(contract => contract.chat === activeChatIdRef.current).paymentStatus);
            //ensures that craftsman status is initiated correctly on first page load
            setIsCurrentlyCraftsman(chatsRef.current.find(chat => chat.chat._id === activeChatIdRef.current).chat.users.craftsman === userId);
        }
    }, [contractStates])

    //called when message is sent from UI
    const handleSend = messageText => {
        //update UI
        setMessages([...messages, {
            message: messageText,
            direction: 'outgoing'
        }]);
        setMsgInputValue("");
        inputRef.current?.focus();

        //write message to db
        let tempMessage = {
            content: messageText,
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

    function sendSystemMessage(payload) {
        //make new socket
        console.log(payload)
        const wsSocket = io("ws://localhost:3002");
        //join room
        wsSocket.emit("create", activeChatIdRef.current);
        //send message to socket
        let tempMessage = {
            content: payload,
            author: userId,
            chat: activeChatIdRef.current,
            isSystemMessage: true,
            createdAt: new Date()
        };
        //send to room
        wsSocket.emit('sendMessage', tempMessage);
        //save to database
        axios.post('/api/chat/postMessageToChat', tempMessage);
        console.log("message should have been send")
    }

    return (
        <div>
            <label>My Messages</label>
            <div className="chatContainer">
                <MainContainer>
                    <Sidebar position="left" scrollable={false}>
                        <ConversationList>
                            {conversations.map(chatWithPartner => {
                                return <Conversation name={chatWithPartner.chat.title}
                                                     active={chatWithPartner.chat._id === activeChatIdRef.current}
                                                     info={"Chat partner: " + chatWithPartner.partnerUsername}
                                                     onClick={() => {
                                                         setActiveChatId(chatWithPartner.chat._id);
                                                         activeChatIdRef.current = chatWithPartner.chat._id;
                                                     }}>
                                    <Avatar src={"defaultAvatar.png"} name={chatWithPartner.partnerUsername}/>
                                    <Conversation.Operations>
                                        <DropdownButton id="dropdown-basic-button" title="">
                                            <Dropdown.Item as="button" onClick={() => {
                                                //do not allow deletion of chat when contract is active
                                                if (activeContractStatus === 'contractEstablished' || activeContractStatus === 'paymentDone') {
                                                    window.alert('Contract is active, you can delete this chat when the contract is finished')
                                                } else if (window.confirm("Do you want to delete the chat permanently?\nPress OK to do so.")) {
                                                    //delete chat from db
                                                    axios.delete('/api/chat/delete/' + chatWithPartner.chat._id).then(() => {
                                                        //if # of chats before deletion is 1 (therefore 0 afterwards), reload page; else load remaining chats
                                                        if (chatsRef.current.length === 1) {
                                                            //last chat was deleted -> set everything empty
                                                            setConversations([]);
                                                            setMessages([]);
                                                            setChats([]);
                                                            setActiveContractStatus('');
                                                        } else {
                                                            //reload of chats
                                                            getChats();
                                                        }
                                                    })
                                                }
                                            }}>Delete Chat</Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={() => {
                                                console.log('Information for customer support:');
                                                console.log('User id which initiated the support request:\n' + userId + '\nChat info:')
                                                console.log(chatWithPartner);
                                            }}>Contact support</Dropdown.Item>
                                        </DropdownButton>
                                    </Conversation.Operations>
                                </Conversation>;
                            })}
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
                            {!isCurrentlyCraftsman && (activeContractStatus === "noPayment" || activeContractStatus === "openContract") &&
                                <ContractPopup chatID={activeChatId} sendSystemMessage={sendSystemMessage}
                                               contract={contractStates.find(contr => contr.chat === activeChatId)}/>
                            }
                            {!isCurrentlyCraftsman && activeContractStatus === "contractEstablished" &&
                                <PaymentPopup chatID={activeChatId} sendSystemMessage={sendSystemMessage}
                                              contract={contractStates.find(contr => contr.chat === activeChatId)}
                                              setActiveContractStatus={setActiveContractStatus}/>
                            }
                            {!isCurrentlyCraftsman && activeContractStatus === "paymentDone" &&
                                <ConfirmJobCompletionPopup chatID={activeChatId} sendSystemMessage={sendSystemMessage}
                                                           contract={contractStates.find(contr => contr.chat === activeChatId)}
                                                           setActiveContractStatus={setActiveContractStatus}/>
                            }
                            {isCurrentlyCraftsman && activeContractStatus === "openContract" &&
                                <AcceptContractPopup chatID={activeChatId} sendSystemMessage={sendSystemMessage}
                                                     contract={contractStates.find(contr => contr.chat === activeChatId)}/>
                            }
                            {activeContractStatus === "jobCompleted" &&
                                <RatingPopup chatPartnerID={currentChatPartnerID} isCraftsman={isCurrentlyCraftsman}/>
                            }
                            <MessageInput value={msgInputValue} onChange={setMsgInputValue} onSend={handleSend}
                                          placeholder="Type message here" attachButton={false} sendButton={false}
                                          disabled={chats.length === 0}
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
                {/*
                <button onClick={() => {console.log(currentChatPartnerID)}}>test</button>
                */}
            </div>
        </div>
    );

}
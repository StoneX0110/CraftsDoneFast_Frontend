import React, {useRef, useState} from "react";
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
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [contractState, setContractState] = useState("noPayment");
    const [chats, setChats] = useState([]);

    //test states are: "noPayment", "openContract", "contractEstablished", "paymentDone", "jobCompleted"


    function getChats() {
        axios.get('/api/chat/getMyChats').then(res => {
            //console.log(res.data);
            let chatTemp = res.data.map(chat => {
                return <Conversation name={chat.chat.title} info={"Chat partner: " + chat.partnerUsername}>
                    <Avatar src={"defaultAvatar.png"} name={chat.partnerUsername}/>
                    <Conversation.Operations
                        onClick={() => console.log('Operations clicked ' + chat.partnerUsername)}/>
                </Conversation>;
            });
            if (chats.length === 0) {
                setChats([chatTemp])
            }
        })
    }

    const handleSend = message => {
        console.log(message);
        setMessages([...messages, {
            message,
            direction: 'outgoing'
        }]);
        setMsgInputValue("");
        inputRef.current?.focus();
    };

    return (
        <div>
            <label>My Messages</label>
            <div className="chatContainer">
                <MainContainer>
                    <Sidebar position="left" scrollable={false}>
                        <Search placeholder="Search..."/>
                        <ConversationList>
                            <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                                <Avatar src={"defaultAvatar.png"} name="Lilly" status="available"/>
                                <Conversation.Operations onClick={() => console.log('Operations clicked Lilly')}/>
                            </Conversation>
                            {getChats()}
                            {chats}
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
                                <ContractPopup/>
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
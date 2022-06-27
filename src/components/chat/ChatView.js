import React, {useRef, useState} from "react";
import "./ChatView.css"
import {ContractPopup} from "./ContractPopup"
import {PaymentPopup} from "./PaymentPopup";

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Button,
    Conversation,
    ConversationList,
    Sidebar,
    Search,
    Avatar,
    SendButton
} from '@chatscope/chat-ui-kit-react';
import {AcceptContractPopup} from "./AcceptContractPopup";
import {ConfirmJobCompletionPopup} from "./ConfirmJobCompletionPopup";
import {RatingPopup} from "./RatingPopup";

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

    //TODO: differenciate between craftman and user
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [contractState, setContractState] = useState("noPayment")
    //test states are: "noPayment", "openContract", "contractEstablished", "paymentDone", "jobCompleted"

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

                            <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                                <Avatar src={"defaultAvatar.png"} name="Joe" status="dnd"/>
                                <Conversation.Operations onClick={() => console.log('Operations clicked Joe')}/>
                            </Conversation>

                            <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you"
                                          unreadCnt={3}>
                                <Avatar src={"defaultAvatar.png"} name="Emily" status="available"/>
                                <Conversation.Operations onClick={() => console.log('Operations clicked Emily')}/>
                            </Conversation>
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
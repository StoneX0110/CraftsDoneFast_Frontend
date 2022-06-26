import React, {useRef, useState} from "react";
import Popup from "reactjs-popup";
import "./ChatView.css"

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

export function ChatView() {

    const state = {
        chats: [],
        //messages: [],
        message: '',
        price: null,
        startingDate: null
    }
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [priceValue, setPriceValue] = useState("");
    const [startingDateValue, setStartingDateValue] = useState("");

    const handleSend = message => {
        console.log(message);
        setMessages([...messages, {
            message,
            direction: 'outgoing'
        }]);
        setMsgInputValue("");
        inputRef.current?.focus();
    };

    function handlePayment() {
        console.log(`Start payment: \n
        Price: ${state.price}\n
        Starting Date: ${state.startingDate}`)
    }

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
                            <Popup
                                trigger={
                                    <Button border onClick={handlePayment} style={{
                                        fontSize: "1.2em",
                                        paddingLeft: "0.2em",
                                        paddingRight: "0.2em"
                                    }}>Start Payment</Button>}
                                modal
                            >
                                {close => (
                                    <div>
                                        <button className="close" onClick={close}>
                                            &times;
                                        </button>
                                        <div className="header"> Define Contract Details {state.name} </div>
                                        <div className="form-group">
                                            <label>Price</label>
                                            <input required type="number" name="price" className="form-control"
                                                   id="exampleFormControlInput1"
                                                   value={state.price} onChange={() => {
                                                setPriceValue(state.price)
                                            }}
                                                   placeholder="Insert Price..."/>
                                            <label>Date</label>
                                            <input required type="date" name="startingDate" className="form-control"
                                                   id="exampleFormControlInput1"
                                                   value={state.startingDate} onChange={() => {
                                                setStartingDateValue(state.startingDate)
                                            }}
                                                   placeholder="Insert Starting Date..."/>
                                        </div>
                                        <div>
                                            <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                                                close();
                                                handlePayment();
                                            }}>Confirm Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Popup>
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
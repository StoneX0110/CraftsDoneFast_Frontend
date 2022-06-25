import React, {Component} from "react";
import Select from 'react-select'
import axios from "axios";
import "../user/UserView.css"
import Category from "../Categories";
//import {Button} from "react-bootstrap";
import Popup from "reactjs-popup";

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

export default class UserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            messages: [],
            message: '',
            price: null,
            startingDate: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.render = this.render.bind(this);
        if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
            this.user = JSON.parse(sessionStorage.getItem('userData')).username;
        }
    }

    componentDidMount() {
        //console.log("fetch user");
        //axios.get('/api/user/' + this.username).then(res => {
        //    this.setState(res.data.settings);
        //})

        //fill options
        //this.options = Category.returnOptions();
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    handleSend() {
        console.log(this.state.message)
        console.log(MessageInput)
    }

    handlePayment() {
        console.log(`Start payment: \n
        Price: ${this.state.price}\n
        Starting Date: ${this.state.startDate}`)

    }


    render() {
        return (
            <div className="Messages">
                <label>Hello Messages</label>
                <div style={{position: "relative", height: "500px"}}>
                    <MainContainer>
                        <Sidebar position="left" scrollable={false}>
                            <Search placeholder="Search..."/>
                            <ConversationList>
                                <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                                    <Avatar src={"defaultAvatar.png"} name="Lilly" status="available" />
                                    <Conversation.Operations onClick={() => console.log('Operations clicked Lilly')}/>
                                </Conversation>

                                <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                                    <Avatar src={"defaultAvatar.png"} name="Joe" status="dnd" />
                                    <Conversation.Operations onClick={() => console.log('Operations clicked Joe')}/>
                                </Conversation>

                                <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                                    <Avatar src={"defaultAvatar.png"} name="Emily" status="available"/>
                                    <Conversation.Operations onClick={() => console.log('Operations clicked Emily')}/>
                                </Conversation>
                            </ConversationList>
                        </Sidebar>
                        <ChatContainer>
                            <MessageList>
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "Joe"
                                }}/>
                            </MessageList>
                            <div as={MessageInput} onSend={this.handleSend} style={{
                                display: "flex",
                                flexDirection: "row",
                                borderTop: "1px dashed #d1dbe4"
                            }}>
                                <Popup
                                    trigger={
                                        <Button border onClick={this.handlePayment} style={{
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
                                            <div className="header"> Define Contract Details {this.state.name} </div>
                                            <div className="form-group">
                                                <label>Price</label>
                                                <input required type="number" name="price" className="form-control"
                                                       id="exampleFormControlInput1"
                                                       value={this.state.price} onChange={this.handleChange}
                                                       placeholder="Insert Price..."/>
                                                <label>Date</label>
                                                <input required type="date" name="startingDate" className="form-control"
                                                       id="exampleFormControlInput1"
                                                       value={this.state.startingDate} onChange={this.handleChange}
                                                       placeholder="Insert Starting Date..."/>
                                            </div>
                                            <div>
                                                <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                                                    close();
                                                    this.handlePayment();
                                                }}>Confirm Details
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                                <MessageInput value={this.state.message} onChange={this.handleChange} placeholder="Type message here" attachButton={false} sendButton={false} style={{
                                    flexGrow: 1,
                                    borderTop: 0,
                                    flexShrink: "initial"
                                }}/>
                                <SendButton onClick={() => this.handleSend(this.state.message)} disabled={this.state.message === 0} style={{
                                    fontSize: "1.2em",
                                    marginLeft: 0,
                                    paddingLeft: "0.2em",
                                    paddingRight: "0.2em"
                                }} />
                            </div>
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        );
    }
}
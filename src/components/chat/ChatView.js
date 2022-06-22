import React, {Component, useState} from "react";
import Select from 'react-select'
import axios from "axios";
import "../user/UserView.css"
import Category from "../Categories";
import {Button} from "react-bootstrap";


import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';

export default class UserView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    render() {
        return (
            <div className="Messages">
                <label>Hello Messages</label>
                <div style={{position: "relative", height: "500px"}}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList>
                                <Message model={{
                                    message: "Hello my friend",
                                    sentTime: "just now",
                                    sender: "Joe"
                                }}/>
                            </MessageList>
                            <MessageInput placeholder="Type message here"/>
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        );
    }
}
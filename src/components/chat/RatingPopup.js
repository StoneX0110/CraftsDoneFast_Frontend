import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Modal from "react-bootstrap/Modal";

export function RatingPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const chatPartnerID = props.chatPartnerID;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setStars("1");
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    //TODO: Placeholder
    const [stars, setStars] = useState("1");
    const [comment, setComment] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        var body = {
            rating: {
                date: Date.now(),
                stars: stars,
                description: comment
            },
            id: chatPartnerID,
        }
        console.log(props.chatPartnerID)
        console.log(body)
        if (props.isCraftsman) {
            axios.post('/api/user/insertCustomerRating', body).then(sendMessage)
        } else {
            axios.post('/api/user/insertCraftsmanRating', body).then(sendMessage)
        }
    }

    function sendMessage() {
        props.sendSystemMessage('<Message.CustomContent>' +
            '<strong>Rated ' + (props.isCraftsman ? 'client' : 'craftsman') + '!' + '</strong>' +
            '</Message.CustomContent>', null, 'hasRated')
        handleClose();
    }

    function handleChangeComment(event) {
        setComment(event.target.value);
    }

    function handleChangeStars(event) {
        setStars(event.target.value);
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Rate User
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                    <Modal.Title>Rate User with 1 - 5 Stars</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className="popupMainContainer">
                        <div className="form-group popupInputContainer">
                            <div onClick={handleChangeStars} className="rating">
                                {/*
                            giving one field the required tag makes it necessary to choose a value
                            -> note this throughs and error due to the hiden radio button

                            else default value can be left out for invisible conversion to 1 if nothing is selected

                            or move the checked marker to another input field
                            */}
                                <input type="radio" name="rating" value="5" id="5"/> <label htmlFor="5">☆</label>
                                <input type="radio" name="rating" value="4" id="4"/> <label htmlFor="4">☆</label>
                                <input type="radio" name="rating" value="3" id="3"/> <label htmlFor="3">☆</label>
                                <input type="radio" name="rating" value="2" id="2"/> <label htmlFor="2">☆</label>
                                <input type="radio" name="rating" value="1" id="1"/> <label htmlFor="1">☆</label>
                            </div>
                            <label>Comment</label>
                            <textarea type="text" name="startingDate" className="form-control"
                                      value={comment} onChange={handleChangeComment}
                                      id="dateInput"/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn popupButtonCancel" onClick={handleClose}>Cancel</button>
                        <button id="submit" type="submit" className="btn popupButton">Confirm Rating</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}
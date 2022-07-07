import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export function RatingPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const chatPartnerID = props.chatPartnerID;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //TODO: Placeholder
    const [stars, setStars] = useState(1);
    const [comment, setComment] = useState("");

    function rateUser() {
        var body = {
            rating: {
                date: Date.now(),
                stars: stars,
                description: comment
            },
            id: chatPartnerID,
        }
        axios.post('/api/user/insertRating', body).then()
    }

    function handleChangeStars(event) {
        setStars(event.target.value);
    }

    function handleChangeComment(event) {
        setComment(event.target.value);
    }

    function handleChangeStars(event) {
        setStars(event.target.value);
    }

    return (
        <div>
            <Button border onClick={handleOpen}>Rate User</Button>
            <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                <div className="popupMainContainer">
                    <button className="close" onClick={handleClose}>
                        &times;
                    </button>
                    <div className="header">Rate User</div>
                    <div className="form-group popupInputContainer">
                        <div onClick={handleChangeStars} className="rating">
                            <input type="radio" name="rating" value="5" id="5"/> <label htmlFor="5">☆</label>
                            <input type="radio" name="rating" value="4" id="4"/> <label htmlFor="4">☆</label>
                            <input type="radio" name="rating" value="3" id="3"/> <label htmlFor="3">☆</label>
                            <input type="radio" name="rating" value="2" id="2"/> <label htmlFor="2">☆</label>
                            <input type="radio" name="rating" value="1" id="1"/> <label htmlFor="1">☆</label>
                        </div>
                        <label>Comment</label>
                        <textarea required type="text" name="startingDate" className="form-control"
                               value={comment} onChange={handleChangeComment}
                               id="dateInput"/>
                    </div>
                    <div className="popupButtonContainer">
                        <button type="button" className="btn popupButton" /*className="btn btn-primary"*/ onClick={() => {
                            handleClose();
                            rateUser();
                        }}>Confirm Rating
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
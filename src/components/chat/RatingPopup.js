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
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");

    function rateUser() {
        console.log(`Propose Contract: \n
        Stars: ${stars}\n
        Comment: ${comment}`)
    }

    function handleChangeStars(event) {
        setStars(event.target.value);
    }

    function handleChangeComment(event) {
        setComment(event.target.value);
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
                        <label>Stars</label>
                        <input required type="number" name="price" className="form-control"
                               value={stars} onChange={handleChangeStars}
                               id="priceInput"
                               placeholder="Insert Price..."/>
                        <label>Comment</label>
                        <input required type="text" name="startingDate" className="form-control"
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
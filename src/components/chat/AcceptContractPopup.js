import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export function AcceptContractPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(props.price);
    const [startingDate, setStartingDate] = useState(props.startingDate);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function acceptContract() {
        console.log(`Accept Contract: \n
        Price: ${price}\n
        Starting Date: ${startingDate}`)
    }

    return (
        <div>
            <Button border onClick={handleOpen}>Accept Contract</Button>
            <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                <div>
                    <button className="close" onClick={handleClose}>
                        &times;
                    </button>
                    <div className="header">Do you wish to accept the Contract Details?</div>
                    <div>
                        <h2>Price: {price}</h2>
                        <h2>Starting Date: {startingDate}</h2>
                    </div>
                    <div>
                        <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                            handleClose();
                            acceptContract();
                        }}>Accept Contract Details
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
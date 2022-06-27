import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export function ConfirmJobCompletionPopup() {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function confirmJobCompletion() {
        console.log(`Confirm Job Completion`)
    }

    return (
        <div>
            <Button border onClick={handleOpen}>Confirm Job Completion</Button>
            <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                <div>
                    <button className="close" onClick={handleClose}>
                        &times;
                    </button>
                    <div className="header">Do you wish to confirm the job Completion?</div>
                    <div>
                        <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                            handleClose();
                            confirmJobCompletion();
                        }}>Confirm Job Completion
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
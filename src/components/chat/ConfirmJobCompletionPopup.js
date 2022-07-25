import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

export function ConfirmJobCompletionPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function confirmJobCompletion() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.paymentStatus = 'jobCompleted';
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                props.sendSystemMessage('<Message.CustomContent>' +
                    '<strong>Confirmed Job Completion</strong><br />' +
                    '</Message.CustomContent>', state);
            })
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Confirm Job Completion
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                </Modal.Header>
                <Modal.Body className="popupMainContainer">
                    <Modal.Title>Do you wish to confirm the job Completion?</Modal.Title>
                </Modal.Body>
                <Modal.Footer>
                    <button type="cancel" className="btn popupButtonCancel" onClick={handleClose}>Cancel</button>
                    <button type="button" className="btn popupButton"/*className="btn btn-primary"*/ onClick={() => {
                        handleClose();
                        confirmJobCompletion();
                    }}>Confirm Job Completion
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
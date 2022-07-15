import React, {useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Moment from "moment";

export function AcceptContractPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const handleOpen = () => {
        setOpen(true);
        setPrice(props.contract.price)
        setStartingDate(Moment(props.contract.startingDate).format('DD.MM.YYYY'));
    }
    const handleClose = () => setOpen(false);

    function acceptContract() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.paymentStatus = 'contractEstablished';
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                props.sendSystemMessage('<Message.CustomContent>' +
                    '<strong>Accepted Contract:</strong><br />' +
                    'with Price: ' +
                    '<span style="color:darkred">' + price + '$' + '</span><br />' +
                    'and Starting date: ' +
                    '<span style="color:darkred">' + startingDate + '</span>' +
                    '</Message.CustomContent>', state);
            })
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Accept Contract
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                    <Modal.Title>Do you wish to accept the Contract Details?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popupMainContainer">
                    <div className="popupInputContainer">
                        <div className="card-text col-auto text-center">
                            <label>Starting Date: {startingDate}</label>
                        </div>
                        <div className="card-text col-auto text-center">
                            <label>Price: {price}$</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="cancel" className="btn popupButtonCancel" onClick={handleClose}>Cancel</button>
                    <button type="button" className="btn popupButton"/*className="btn btn-primary"*/ onClick={() => {
                        handleClose();
                        acceptContract();
                    }}>Accept Contract Details
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
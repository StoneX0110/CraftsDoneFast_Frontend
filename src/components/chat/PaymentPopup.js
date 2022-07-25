import React, { useRef, useState } from "react";
import { Button } from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import { StripePaymentForm } from "../payment/PaymentComponent";
import Modal from "react-bootstrap/Modal";

export function PaymentPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(props.contract.price);
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    function conductPayment() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.paymentStatus = 'paymentDone';
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                props.sendSystemMessage('<Message.CustomContent>' +
                    '<strong>Conducted Payment:</strong><br />' +
                    'payed price: ' +
                    '<span style="color:darkred">' + price + '</span><br />' +
                    '</Message.CustomContent>');
            })
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Pay Secure
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                    <Modal.Title>Pay Securely</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popupMainContainer">
                    <div className="popupInputContainer">
                        <div className="card-text col-auto text-center">
                            <label>Price: {price}$</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Body>
                    <StripePaymentForm handleClose={handleClose} contract={props.contract} sendSystemMessage={props.sendSystemMessage} setActiveContractStatus={props.setActiveContractStatus}/>
                </Modal.Body>
            </Modal>
        </div>
    );
}
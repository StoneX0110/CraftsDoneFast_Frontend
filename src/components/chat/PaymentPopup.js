import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { StripePaymentForm } from "../payment/PaymentComponent";

export function PaymentPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(props.price);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function conductPayment() {
        console.log(`Conduct Payment: \n
        Price: ${price}`)
    }

    return (
        <div>
            <Button border onClick={handleOpen}>Pay Secure</Button>
            <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                <div className="popupMainContainer">
                    <button className="close" onClick={handleClose}>
                        &times;
                    </button>
                    <div className="header">Pay Securely</div>
                    <div className="popupInputContainer">
                        <h2>Price: {price}</h2>
                    </div>
                    <div className="popupButtonContainer">
                        <button type="button" className="btn popupButton"/*className="btn btn-primary"*/ onClick={() => {
                            handleClose();
                            conductPayment();
                        }}>Pay with Stripe
                        </button>
                        <StripePaymentForm/>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
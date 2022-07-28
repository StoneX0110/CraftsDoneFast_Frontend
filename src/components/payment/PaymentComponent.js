import {
    Elements,
    CardElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import axios from "axios";
import React, {useState} from "react";

const stripePromise = loadStripe("pk_test_51LFv4cGPYqiDG82LLOGXRipIBm2gDVmi6MZyJKXNDSW5PpFXAiBBdAd1pFa0wGdaytWY3cOPhyl8grV4lybRknCd00R0lvsMPY");

const handleSubmit = (stripe, elements, props, setPayed) => async () => {
    setPayed(true);
    axios.post('/api/payment/createPaymentIntent', {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props.contract),
    }).then(
        res => {
            confirmPayment(stripe, elements, res.data.clientSecret, props, setPayed);
        });
}

const confirmPayment = (stripe, elements, clientSecret, props, setPayed) => {
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
        }
    }).then(res => {
        console.log(res)
        if (res.error) {
            setPayed(false);
            console.log('[error]', res.error);
        } else {
            confirm(props);
        }
    });
}

function confirm(props) {
    sendToServer(props);
}

function sendToServer(props) {
    if(props.profile) {
        axios.post('/api/user/payProfile')
        .then(res => {
            alert(res.data);
            props.handleClose();
            window.location.reload();
        })
        return;
    }
    let state = JSON.parse(JSON.stringify(props.contract));
    state.paymentStatus = 'paymentDone';
    axios.post('/api/chat/updateContract', state)
        .then(res => {
            props.setActiveContractStatus('paymentDone');
            props.sendSystemMessage('<Message.CustomContent>' +
                '<strong>Conducted Payment:</strong><br />' +
                'payed price: ' +
                '<span style="color:darkred">' + props.contract.price + '$' + '</span><br />' +
                '</Message.CustomContent>', state);
            props.handleClose();
        })
}

const PaymentForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [payed, setPayed] = useState(false);
    return (
        <>
            <CardElement options={{hidePostalCode: true}}/>
            <div className="popupButtonContainer">
                <button type="cancel" className="btn popupButtonCancel" onClick={props.handleClose}>Cancel</button>
                <button type="button" disabled={payed} className="btn popupButton" onClick={handleSubmit(stripe, elements, props, setPayed)}>Pay
                    with Stripe
                </button>
            </div>
        </>
    );
}

export const StripePaymentForm = (props) => (
    <Elements stripe={stripePromise}>
        <PaymentForm handleClose={props.handleClose} contract={props.contract}
                     sendSystemMessage={props.sendSystemMessage}
                     setActiveContractStatus={props.setActiveContractStatus}
                     profile={props.profile} amount={props.contract.price}/>
    </Elements>
);

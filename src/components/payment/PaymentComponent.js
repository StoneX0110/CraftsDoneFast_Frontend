import {
    Elements,
    CardElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import axios from "axios";
import React from "react";

const stripePromise = loadStripe("pk_test_51LFv4cGPYqiDG82LLOGXRipIBm2gDVmi6MZyJKXNDSW5PpFXAiBBdAd1pFa0wGdaytWY3cOPhyl8grV4lybRknCd00R0lvsMPY");

const handleSubmit = (stripe, elements, props) => async () => {
    const cardElement = elements.getElement(CardElement);
    //card number has to be 4242 4242 4242 4242, postalcode 5 numbers, validation date in future, ccv 3 digits
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        console.log('[error]', error);
    } else {
        // ... SEND to your API server to process payment intent
        confirm(paymentMethod, props);
    }
};

function confirm(paymentMethod, props) {
    sendToServer(props, paymentMethod);
}

function sendToServer(props, paymentMethod) {
    if(props.profile) {
        axios.post('/api/user/payProfile', paymentMethod)
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
    return (
        <>
            <CardElement options={{hidePostalCode: true}}/>
            <div className="popupButtonContainer">
                <button type="cancel" className="btn popupButtonCancel" onClick={props.handleClose}>Cancel</button>
                <button type="button" className="btn popupButton" onClick={() => {
                    sendToServer(props)
                }}>Test Pay
                </button>
                <button type="button" className="btn popupButton" onClick={handleSubmit(stripe, elements, props)}>Pay
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
                     profile={props.profile}/>
    </Elements>
);

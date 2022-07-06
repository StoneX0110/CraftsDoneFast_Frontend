
import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51LFv4cGPYqiDG82LLOGXRipIBm2gDVmi6MZyJKXNDSW5PpFXAiBBdAd1pFa0wGdaytWY3cOPhyl8grV4lybRknCd00R0lvsMPY");

const handleSubmit = (stripe, elements, props) => async () => {
  const cardElement = elements.getElement(CardElement);
  //card number has to be 4242 4242 4242 4242, postalcode 5 numbers, validation date in future, ccv 3 digits
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.log('[error]', error);
  } else {
    console.log('[PaymentMethod]', paymentMethod);
    // ... SEND to your API server to process payment intent
    confirm(paymentMethod, props);
  }
};

function confirm(paymentMethod, props) {
  sendToServer(props);
}

function sendToServer(props) {
  let state = JSON.parse(JSON.stringify(props.contract));
  state.paymentStatus = 'paymentDone';
  axios.post('/api/chat/updateContract', state)
     .then(res => {
       console.log(res.data);
       console.log(props);
       props.setActiveContractStatus('paymentDone');
       props.sendSystemMessage('<Message.CustomContent>' +
           '<strong>Conducted Payment:</strong><br />' +
           'payed Price: ' +
           '<span style="color:darkred">' + props.contract.price + '$' + '</span><br />' +
           '</Message.CustomContent>');
       props.handleClose();
     })
}

const PaymentForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="button" className="btn popupButton" onClick={() => { sendToServer(props)}}>Test Pay</button>
      <button type="button" className="btn popupButton" onClick={handleSubmit(stripe, elements, props)}>Pay with Stripe</button>
    </>
  );
}

export const StripePaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentForm handleClose={props.handleClose} contract={props.contract} sendSystemMessage={props.sendSystemMessage} setActiveContractStatus={props.setActiveContractStatus}/>
  </Elements>
);

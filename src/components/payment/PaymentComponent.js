
import {
    Elements,
    CardElement,
    useElements,
    useStripe
  } from "@stripe/react-stripe-js";
  import { loadStripe } from "@stripe/stripe-js";
  import axios from "axios";
  
  const stripePromise = loadStripe("pk_test_51LFv4cGPYqiDG82LLOGXRipIBm2gDVmi6MZyJKXNDSW5PpFXAiBBdAd1pFa0wGdaytWY3cOPhyl8grV4lybRknCd00R0lvsMPY");

  const handleSubmit = (stripe, elements) => async () => {
    const cardElement = elements.getElement(CardElement);
    //card number has to be 4242 4242 4242 4242, postalcode 5 numbers, validation date in future, ccv 3 digits
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  
    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // ... SEND to your API server to process payment intent
      confirm(paymentMethod);
    }
  };

  function confirm(paymentMethod) {
    axios.post('/api/user/confirmPayment', paymentMethod)
    .then(res => {
        // const id = res.data;
        // console.log(res.data);
        // window.location = "/jobOffer/" + id;
        console.log("sucessfully paid");
    });
  }
  
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    return (
      <>
        <CardElement />
        <button type="button" className="btn popupButton" onClick={handleSubmit(stripe, elements)}>Pay with Stripe</button>
      </>
    );
  }
  
  export const StripePaymentForm  = () => (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
  
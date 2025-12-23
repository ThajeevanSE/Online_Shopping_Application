import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";


const stripePromise = loadStripe("pk_test_51ShORGBu5o595k7bp22z4lBfW7nJxQbcxWnSMAZ7H14t3raVtjrZ8q0ZzbeOvzCOdk07navtNXGV1b0YSZlfNXYQ00lKeNXzTk");


const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

   
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      
      onSuccess(); 
    } else {
      setErrorMessage("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h3 className="text-xl font-bold mb-4 text-gray-700">Enter Card Details</h3>
      <p className="mb-4 text-gray-500">Total to pay: <span className="font-bold text-black">${amount}</span></p>
      
      <div className="border p-3 rounded-lg mb-4 bg-gray-50">
        <PaymentElement />
      </div>

      {errorMessage && <div className="text-red-500 text-sm mb-3">{errorMessage}</div>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-1/2 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

//Main Modal Wrapper
function PaymentModal({ amount, onSuccess, onClose }) {
  const [clientSecret, setClientSecret] = useState("");

  
  React.useEffect(() => {
    api.post("/payment/create-intent", { amount: amount })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Payment Intent Error", err));
  }, [amount]);

  if (!clientSecret) return <div className="p-10 text-center">Loading Secure Payment...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}

export default PaymentModal;
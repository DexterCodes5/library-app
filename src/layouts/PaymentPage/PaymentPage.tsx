import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { PaymentInfoModel } from "../../model/PaymentInfoModel";

export const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(""); 
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const fetchFees = async () => {
      if (!authState?.isAuthenticated) {
        return;
      }
      const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      setPaymentAmount(responseJson.amount);
      setIsLoading(false);
    }

    fetchFees().catch((err: Error) => {
      setIsLoading(false);
      setHttpError(err.message);
    });
  }, [authState]);

  const elements = useElements();
  const stripe = useStripe();

  const payFees = async () => {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }
    setSubmitDisabled(true);

    const url = `${process.env.REACT_APP_API}/payments/payment-intent`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new PaymentInfoModel(Math.round(paymentAmount * 100), "USD", authState?.accessToken?.claims.sub!))
    };

    let response;
    try {
      response = await fetch(url, requestOptions);
    }
    catch (err: any) {
      setSubmitDisabled(false); 
      setHttpError("Something went wrong");
      throw new Error(err.message)
    }
    const responseJson = await response.json();

    const stripeResponse = await stripe?.confirmCardPayment(
      responseJson.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: authState?.accessToken?.claims.sub
          }
        }
      }, {handleActions: false}
    );
    if (stripeResponse.error) {
      setSubmitDisabled(false);
      alert("There was an error");
      return;
    }
    
    const url2 = `${process.env.REACT_APP_API}/payments/payment-complete`;
    const requestOptions2 = {
      method: "PUT",
      headers: {
        Authorization: authState?.accessToken?.accessToken!
      }
    };

    let response2;
    try {
      response2 = await fetch(url2, requestOptions2);
    }
    catch (err) {
      setHttpError("Something went wrong");
      setSubmitDisabled(false);
      throw new Error("Something went wrong");
    }
    setPaymentAmount(0);
    setSubmitDisabled(false);
  };

  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container">
      {paymentAmount > 0 ? 
        <div className="card mt-3">
          <h5 className="card-header">Fees pending: <span className="text-danger">${paymentAmount}</span></h5>
          <div className="card-body">
            <h5 className="card-title mb-3">Credit Card</h5>
            <CardElement id="card-element" />
            <button disabled={submitDisabled} type="button" className="btn main-color text-white mt-3" onClick={payFees}>
              Pay fees
            </button>
          </div>
        </div>
        :
        <div className="mt-3">
          <h5>You have no fees</h5>
          <Link className="btn main-color text-white" to="/search">Explore top books</Link>
        </div>
      }
      {submitDisabled && <SpinnerLoading />}
    </div>
  );
};
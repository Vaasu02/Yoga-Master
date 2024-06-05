import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useLocation } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";

import './Payment.css'
import CheckoutPayment from '../Payment/CheckoutPayment'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

const Payment = () => {
  const location=useLocation();
  // console.log(location)
  // console.log(import.meta.env.VITE_STRIPE);
  const price=location?.state?.price;
  const cartitem=location.state?.itemId;
  if(!price){
    return <Navigate  to="/dashboard/my-selected"  />
  }
  

  return (
    <div className="my-40 stripe-custom-class">
      <Elements stripe={stripePromise} >
        <CheckoutPayment price={price} cartitem={cartitem} />
      </Elements>
    </div>
  )
}

export default Payment
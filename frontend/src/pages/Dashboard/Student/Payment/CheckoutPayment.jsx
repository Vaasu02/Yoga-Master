import React, { useEffect, useState } from 'react'
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useUser from '../../../../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';

const CheckoutPayment = ({ price, cartitem }) => {
  const URL = `http://localhost:5000/payment-info?${cartitem && `classId=${cartitem}`}`
  const stripe = useStripe();
  const elements = useElements();
  const navigate=useNavigate();

  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [clientSecret, setclientSecret] = useState('');
  const [succeeded, setsucceeded] = useState('');
  const [message, setMessage] = useState('')
  const [cart, setCart] = useState([]);

  if (price < 0 || !price) {
    return <Navigate to="/dashboard/my-selected" replace />
  }
  useEffect(() => {
    axiosSecure.get(`/cart/${currentUser?.email}`).then((res) => {
      const classesId = res.data.map(item => item._id);
      setCart(classesId);
    }).catch((err) => console.log(err))
  }, [])

  // console.log(cart);
  useEffect(()=>{
    axiosSecure.post('/create-payment-intent',{price:price}).then((res)=>{
      console.log(res.data);
      setclientSecret(res.data.clientSecret)
    })
    
  },[]);

  const handleSubmit=async(e)=>{
    setMessage("");
    e.preventDefault();
    if(!stripe || !elements){
      return;
    }
    const card=elements.getElement(CardElement);
    if(card===null){
      return;
    }

    const{error,paymentMethod}=await stripe.createPaymentMethod({
      type:'card',
      card
    })

    if(error){
      console.log(error);
      setMessage(error.message);
    }else{
      console.log('[PaymentMethod]',paymentMethod)
    }

    const{paymentIntent,error:confirmError}=await stripe.confirmCardPayment(clientSecret,{
      
      payment_method:{
        card:card,
        billing_details:{
          name:currentUser?.name || "Unknown",
          email:currentUser?.email || "Anonymous",
        },
      },
      
    })

    if(confirmError){
      console.log("[Confrim error]",confirmError.message);
    }else{
      console.log("[Payment Intent]",paymentIntent)
      if(paymentIntent.status==="succeeded"){
        // setsucceeded("Payment successfull")
        const transactionId=paymentIntent.id;
        const paymentMethod=paymentIntent.payment_method;
        const amount=paymentIntent.amount / 100;
        const currency=paymentIntent.currency;
        const paymentStatus=paymentIntent.status;
        const userName=currentUser?.name;
        const userEmail=currentUser?.email;

        const data={
          transactionId,
          paymentMethod,
          amount,
          currency,
          paymentStatus,
          userName,
          userEmail,
          classesId:cartitem?[cartitem]:cart,
          date:new Date()
        }

        fetch(URL,{
          method:"POST",
          headers:{
            "content-type":"application/json",
            authorization:`Bearer ${localStorage.getItem('token')}`
          },
          body:JSON.stringify(data)
        }).then(res=>res.json()).then(res=>{
          console.log(res);
          if(res.deleteResult.deletedCount > 0 && res.paymentResult.insertedId && res.updatedResult.modifiedCount > 0){
            setsucceeded('Payment Successfull,You can now access your classes');
            // navigate('/dashboard/enrolled-class');
            
          }else{
            setsucceeded('Payment Failed,Please try again..')
          }
        }).catch((err)=>console.log(err));
        
        // console.log(data);
      }
      
    }

  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Payment Amount: <span className="text-secondary">{price}</span>
        </h1>
      </div>
      <div className='flex items-center justify-center mt-6' >
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",

              }
            }}



          />
          <button className='btnn' type='submit' disabled={isLoading || !stripe || !clientSecret} >Pay</button>
          {message && <p className="text-red-500">{message}</p>}
          {succeeded && <p className="text-green-500">{succeeded}</p>}
        </form>
      </div>

    </>
  )
}

export default CheckoutPayment
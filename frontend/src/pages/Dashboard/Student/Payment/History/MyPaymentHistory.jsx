import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../../../hooks/useAxiosFetch'
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';
import useUser from '../../../../../hooks/useUser';

const MyPaymentHistory = () => {
  const axiosFetch=useAxiosFetch();
  const axiosSecure=useAxiosSecure();
  const {currentUser}=useUser();
  const[payments,setpayments]=useState([]);
  const[loading,setLoading]=useState(true);
  const[paginatedPayments,setPagniatedpayment]=useState([]);
  const totalItem=payments.length;
  const[page,setPage]=useState(1);
  let totalPage=Math.ceil(totalItem / 5);
  let itemsPerPage=5;
  const handleChange=(event,value)=>{
    setPage(value);
  };

  // useEffect(()=>{
  //   const lastIndex=page * itemsPerPage;
  //   const firstIndex=lastIndex - itemsPerPage;
  //   const currentItems=payments.slice(firstIndex,lastIndex);
  //   setPagniatedpayment(currentItems);
  // },[page,payments]);

  useEffect(()=>{
    axiosFetch
      .get(`/payment-history/${currentUser?.email}`)
      .then((res)=>{
        setpayments(res.data);
        setLoading(false);
      })
      .catch((err)=>console.log(err.message))
  },[currentUser?.email])

  // const totalPaidAmount=payments.reduce((acc,curr)=> acc + curr.amount,0);

  if(loading){
    return <p>Loading...</p>
  }
  
  return (
    <div>
      <div className="text-center mt-6 mb-16">
        <p className="text-gray-400">
          Hey,{" "}
          <span className="text-secondary font-bold">{currentUser.name}</span>{" "}
          Welcome...!
        </p>
        <h1 className="text-4xl font-bold">
          My Paym<span className="text-secondary">ent Hist</span>ory
          </h1>
          <p className="text-gray-500 text-sm my-3">
            You can see your payment history here{" "}
          </p>
        
      </div>

      {/* tabelheare */}
      <div>
        <div>
          <p className="font-bold">Total Payments : {payments.length}</p>
          {/* <p className="font-bold">Total Paid : {totalPaidAmount}</p> */}
        </div>
      </div>
    </div>
  )
}

export default MyPaymentHistory
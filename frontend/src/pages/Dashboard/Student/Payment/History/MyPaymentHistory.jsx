import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../../../hooks/useAxiosFetch'
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';
import useUser from '../../../../../hooks/useUser';
import moment from 'moment';

const MyPaymentHistory = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();
  // console.log(currentUser);
  const [payments, setpayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginatedPayments, setPaginatedPayments] = useState([]);
  const totalItem = payments.length;

  const [page, setPage] = useState(1);
  let totalPage = Math.ceil(totalItem / 5);
  let itemsPerPage = 5;

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = payments.slice(firstIndex, lastIndex);
    setPaginatedPayments(currentItems);
  }, [page, payments]);




  useEffect(() => {

    axiosFetch.get(`/payment-history/${currentUser?.email}`)
      .then((res) => {
        // const data = Array.isArray(res.data) ? res.data : [];
        // console.log(data);
        setpayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [currentUser.email]);

  const totalPaidAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
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
          <p className="font-bold">Total Payments :  &nbsp;{totalItem} </p>
          <p className="font-bold">Total Paid : $&nbsp;{totalPaidAmount}</p>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mb-4 mt-3' >
        <table className="w-full">
          <thead className=''>
            <tr className=''>
              <th className="text-left font-semibold p-2 ">#</th>
              <th className="text-left font-semibold">Amount</th>
              <th className="text-left font-semibold">TotalItem</th>
              <th className="text-left font-semibold">Date</th>
              
            </tr>

          </thead>
          <tbody>
            {
              paginatedPayments.map((payment,idx)=>(
                <tr className='p-4' >
                  <td className='p-3' >{idx+1}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.classesId.length}</td>
                  <td>{moment(payment.submitted).format("MMMM Do YYYY")}</td>
                </tr>

              ))
            }
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default MyPaymentHistory
import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useUser from '../../../../hooks/useUser';

const EnrolledClasses = () => {
  const[data,setdata]=useState([]);
  const axioSecure=useAxiosSecure();
  const{currentUser}=useUser();


  // console.log(currentUser)

 

  useEffect(()=>{
    axioSecure.get(`/enrolled-classes/${currentUser?.email}`)
    .then((res)=>{
      console.log(res.data)
      
      setdata(res.data);
    }).catch(err=>console.log(err));
  },[])

  return (
    <div>
      <h1 className="text-2xl my-6">Enrolled Classes</h1>
      <div>
        {data.length === 0 ? (
          <p>No enrolled classes found.</p>
        ) : (
          data.map((item, index) => (
            <img key={index} src={item.classes.image} alt={`Class ${index}`} className='w-1/2 h-1/2' />
          ))
        )}
      </div>
    </div>
  )
}

export default EnrolledClasses
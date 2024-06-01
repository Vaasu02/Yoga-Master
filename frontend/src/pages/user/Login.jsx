import React, { useState } from 'react'
import { MdOutlineAlternateEmail,MdOutlineRemoveRedEye } from 'react-icons/md'
import { Link,useLocation,useNavigate } from 'react-router-dom';
import GoogleLogin from '../../components/Social/GoogleLogin';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [showpassword, setshowpassword] = useState(false);
  const location=useLocation();
  const{login,error,setError,loader,setLoader}=useAuth();
  const navigate=useNavigate();

  const handlesubmit=(e)=>{
    setError('');
    e.preventDefault();

    const data=new FormData(e.target);
    const formdta=Object.fromEntries(data);
    // console.log(formdta);
    login(formdta.email,formdta.password).then(()=>{
      alert('Login successfull');
      // navigate(location.state?.from || '/dashboard')
      navigate('/')
    }).catch((err)=>{
      console.log(err);
      setError(err.message);
      setLoader(false);
    })

  }
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-secondary sm:text-3xl text-center">Get Started Today</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-gray-500">Explore our comprehensive library of courses, meticulously crafted to cater to all levels of expertise.
      </p>

      <div className="mx-auto max-w-lg mb-e mt-6 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
        <form onSubmit={handlesubmit} action="#" className="space-y-4">
          <p className="text-center text-red-400 text-lg font-medium">Sign in to your account</p>
          <div>
            <label htmlFor="email"className='sr-only'>Email</label>
            <div className="relative">
              <input type="email" name='email' placeholder='Enter Email' className='w-full border outline-none  border-gray-200 p-4 pe-12 text-sm shadow-sm rounded-lg' />
              <span className='absolute inset-y-0 end-0 grid place-content-center px-4'><MdOutlineAlternateEmail/></span>
            
            </div>
          </div>

          {/* password */}
          <div>
            <label htmlFor="password" className='sr-only'>Password</label>
            <div className="relative">
              <input type={showpassword?'text':'password'} name='password' placeholder='Enter Password' className='w-full border outline-none  border-gray-200 p-4 pe-12 text-sm shadow-sm rounded-lg' />
              <span onClick={()=>setshowpassword(!showpassword)} className='absolute inset-y-0 end-0 grid place-content-center px-4'><MdOutlineRemoveRedEye/></span>
            </div>
          </div>
          <button type='submit' className='block w-full rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-white '>Sign in</button>
          <p className="text-center text-sm text-gray-500">No account? <Link className='underline' to="/register">Sign up</Link></p>

        </form>
        <GoogleLogin/>
      </div>
    </div>
  )
}

export default Login
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice.js';
import { useDispatch,useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import socket from '../utils/socket.js';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log('data',data);

      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      // socket.connect(); // manually connect
      // socket.emit('registerUser', data._id);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
    
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        
        <input type="email" placeholder='Email' id='email' 
        className='bg-slate-200 p-3 rounded-lg'
        onChange={handleChange} />
        <input type="password" placeholder='Password' id='password' 
        className='bg-slate-200 p-3 rounded-lg' 
        onChange={handleChange} />
        <button disabled={loading} className='bg-blue-400 font-semibold p-3 rounded-lg 
        uppercase hover:opacity-95 disabled:opacity-75'>
          { loading? 'Loading...':'Sign In'}
        </button>
        <OAuth/>
      </form>
      
      <div className='flex'>
        <p>Dont Have an account? </p>
        <Link to='/sign-up'>
          <span className='text-blue-900 ml-1' > Sign up</span>
        </Link>
      </div>
      <p className='text-red-600'>
        {error? error.message ||'some error occured!' : ''}
      </p>
    </div>
  )
}

import React, { useState, useEffect  } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice.js';
import { useDispatch,useSelector } from 'react-redux';
import Trial from '../components/Trial.jsx';
import PlacesSearchBox from '../components/PlacesSearchBox.jsx';
import OtherInfo from '../components/OtherInfo.jsx';
import JourneyList from '../components/JourneyList.jsx';
// import socket from '../utils/socket'; // make sure this points to your connected socket instance


export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // console.log('hi');
    if (currentUser === null) {
      console.log("Redirecting to sign-in...");
      navigate('/sign-in');
    }
    if(currentUser.success === false){
      console.log("Redirecting to sign-in...");
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);
  
  return (

    <div>

      <div className='ml-3.5 mt-6'>
      <Link to='/add-journey'>
        <span className='text-white bg-green-500 hover:bg-green-600 font-semibold  px-4 py-2 rounded-xl shadow-md transition duration-200 ease-in-out mb-5'>
          Add your own Journey ?
        </span>
      </Link>

      </div>
      <JourneyList/>

      
      
    </div>
  )
}

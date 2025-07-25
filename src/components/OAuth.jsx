import React from 'react'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import { app } from '../firebase';
import {useDispatch} from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket.js';
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () =>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                })
            })
            const data = await res.json();
            // console.log('data',data);
            dispatch(signInSuccess(data));
            console.log('userId is ',data._id);
            
            // socket.connect(); // manually connect
            socket.emit('registerUser', data._id);

            navigate('/');
        } catch (error) {
            console.log('could not log in with Google', error);
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-yellow-200 rounded-lg p-3 hover:opacity-70'>
        Continue with Google
    </button>
  )
}

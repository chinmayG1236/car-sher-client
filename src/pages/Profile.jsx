import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart,updateUserFailure,updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure,signOut,deleteStart,deleteEnd,deleteStartOnMap,deleteEndOnMap } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'
import socket from '../utils/socket.js';

export default function Profile() {
  // const navigate = useNavigate();
  const fileRef = useRef();
  const [image,setImage] = useState(undefined);
  const {currentUser,loading,error} = useSelector( state => state.user); 
  const [imagePercentage, setImagePercentage]= useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess,setUpdateSuccess]=useState(false);
  // console.log(formData);

  useEffect(()=>{
    if(image){
      handleFileUpload(image);
    }
  },[image]);

  const handleFileUpload = async (image)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on('state_changed',(snapshots)=>{
      const progress = (snapshots.bytesTransferred / snapshots.totalBytes)*100;
      setImagePercentage(Math.round(progress));
    },
    (error)=>{
      setImageError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
        setFormData({...formData, profilePicture:downloadURL}))
    })
  }
  // console.log(formData);
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  // console.log(formData);
  const  handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),

      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }

  const HandleDeleteAccount = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure());
    }
  }

  const HandleSignOut= async()=>{
    try {
      await fetch('/api/auth/signout');
      socket.disconnect();
      dispatch(signOut());
      dispatch(deleteStart());
      dispatch(deleteEnd());
      dispatch(deleteStartOnMap());
      dispatch(deleteEndOnMap());

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='image/*' 
        onChange = {(e)=> setImage(e.target.files[0])} />
        <img 
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile"
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={()=>fileRef.current.click()}
        />
        <p>

        </p>
        <input defaultValue={currentUser.username} type="text" id='username' placeholder='Username'
         className='bg-slate-100 rounded-lg p-3'
         onChange={handleChange}/>
        <input defaultValue={currentUser.email} type="text" id='email' placeholder='Email'
         className='bg-slate-100 rounded-lg p-3'
         onChange={handleChange}/>
        <input type="text" id='password' placeholder='Password'
         className='bg-slate-100 rounded-lg p-3'
         onChange={handleChange}/>
        <button className='bg-yellow-500 p-3 rounded-lg uppercase
         hover:opacity-95 disabled:opacity-70'
        >{loading?'loading':'update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={HandleDeleteAccount} className='text-red-500 cursor-pointer'>Delete Account</span>
        <span onClick={HandleSignOut} className='text-red-500 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-600 mt-5'>{error && 'Something went wrong'}</p>
      <p className='text-green-500 mt-5'>{updateSuccess && 'updated successfully'}</p>
    </div>
  )
}

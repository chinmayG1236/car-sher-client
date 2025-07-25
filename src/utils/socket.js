import { io } from 'socket.io-client';
import { store } from '../redux/store';

const socket = io("wss://car-sher-2.onrender.com/", {
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// socket.on('connect', () => {
//     const state = store.getState();
//     const userId = state.user.currentUser?._id;
  
//     if (userId) {
//       socket.emit('registerUser', userId);
//       console.log('✅ Registered user with socket:', userId);
//     }
//   });

socket.on('trial message', (data) => {
  console.log('message from server',data.message); // or show a toast/notification UI
});

socket.on('request driver',({journey,passenger})=>{
    alert(`you have new ride request from ${passenger.name}! check your Notifications`);
})

socket.on('send driver response',(data)=>{
    alert(`${data.driverName} has ${data.message} your ride request`);
})

export default socket;
// import React, { useEffect, useState } from 'react';
// import socket from '../utils/socket'; // make sure this points to your connected socket instance

// export default function Notifications() {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     socket.on('request driver', ({ journey, passenger }) => {
//       console.log('Received ride interest:', passenger);
//       console.log(passenger.id);
//       setRequests(prev => [...prev, { journey, passenger }]);
//     });

//     // Optional: clean up listener on component unmount
//     // return () => {
//     //   socket.off('request driver');
//     // };
//   }, []);

//   const handleAccept = async (req) => {
//     console.log(req);
//     socket.emit('driver response', {req});
//     const journey=req.journey;
//     const passenger=req.passenger;
//     const journeyId= journey._id;
//     const passengerId= passenger.id;
//     const passengerName= passenger.name;
//     const data={journeyId,passengerId,passengerName};
//     const res = await fetch("/api/journey/addPassenger", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//   };

//   const handleReject = (request) => {
//     // socket.emit('driver response', {
//     //   response: 'rejected',
//     //   journeyId: request.journey._id,
//     //   passengerId: request.passenger._id,
//     // });
//   };

//   return (
//     <div className="p-5">
//       <h2 className="text-xl font-bold mb-4">Ride Requests</h2>

//       {requests.length === 0 ? (
//         <p>No new Notification</p>
//       ) : (
//         <ul className="space-y-4">
//           {requests.map((req, index) => (
//             <li key={index} className="border p-4 rounded-lg bg-gray-100">
//               <p><strong>{req.passenger.name}</strong> is interested in your ride from <strong>{req.journey.start}</strong> to <strong>{req.journey.end}</strong>.</p>
//               <div className="mt-2 flex gap-2">
//                 <button
//                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//                   onClick={() => handleAccept(req)}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                   onClick={() => handleReject(req)}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from '../utils/socket'; // make sure this points to your connected socket instance
import { setNotifs } from "../redux/user/userSlice.js";
import { useDispatch } from 'react-redux';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleRequestDriver = async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000);
      setRefresh(prev => !prev);
    };
  
    socket.on('request driver',handleRequestDriver);
  
    return () => {
      socket.off('request driver', handleRequestDriver);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notification/get?driverId=${currentUser._id}`);
        const data = await res.json();
        setNotifications(data);
        dispatch(setNotifs(data.length));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (currentUser?._id) {
      fetchNotifications();
    }
  }, [currentUser,refresh]);

  const handleAccept = async (noti) => {
    // Handle accepting ride request
    // console.log("Accepting request:", noti);
    const journeyId = noti.journeyId;
    const passengerId = noti.passenger;
    const passengerName = noti.passengerName;
    const data={journeyId,passengerId,passengerName};

    const res = await fetch("/api/journey/addPassenger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await fetch(`/api/notification/markAsRead/${noti._id}`, {
      method: "PUT",
    });
    socket.emit('driver response',{
      passenger:noti.passenger,driverName:noti.driverName,message:'Accepted'
    });
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000);
      setRefresh(prev => !prev);

  };

  const handleReject = async (noti) => {
    // Handle rejecting ride request
    console.log("Rejecting request:", noti);
    await fetch(`/api/notification/markAsRead/${noti._id}`, {
      method: "PUT",
    });
    socket.emit('driver response',{
      passenger:noti.passenger,driverName:noti.driverName,message:'Rejected'
    });
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000);
      setRefresh(prev => !prev);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Ride Requests</h2>

      {notifications.length === 0 ? (
        <p>No new Notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((noti, index) => (
            <li key={index} className="border p-4 rounded-lg bg-gray-100">
              <p>
                <strong>{noti.passengerName}</strong> is interested in your ride from{" "}
                <strong>{noti.start}</strong> to <strong>{noti.end}</strong> on{" "}
                <strong>{new Date(noti.journeyDate).toLocaleDateString()}</strong>.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleAccept(noti)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleReject(noti)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

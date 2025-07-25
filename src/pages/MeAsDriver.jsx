import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  MapPin,
  User,
  Users,
  CalendarDays,
  ArrowRight,
  Car,
} from 'lucide-react';

function MeAsDriver() {
  const [items, setItems] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDriverJourneys = async () => {
      try {
        const response = await fetch(`/api/journey/get-driver?id=${currentUser._id}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching journeys as driver:', error);
      }
    };

    fetchDriverJourneys();
  }, [currentUser._id]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-300 pb-2 flex items-center gap-2">
        <Car className="text-indigo-600" /> Journeys Where You're the Driver
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-600 text-lg">No journeys found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((journey) => (
            <div
              key={journey._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center text-indigo-700 font-semibold mb-3">
                <MapPin className="w-5 h-5 mr-2" />
                {journey.start}
                <ArrowRight className="mx-2 text-gray-500" />
                {journey.end}
              </div>

              <div className="flex items-center text-gray-800 mb-2">
                <User className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-medium">Driver:</span>&nbsp;{journey.username}
              </div>

              <div className="flex items-center text-gray-800 mb-2">
                <Users className="w-4 h-4 mr-2 text-orange-500" />
                <span className="font-medium">Passenger:</span>&nbsp;
                {journey.passengerName || (
                  <span className="italic text-gray-500">Not assigned yet</span>
                )}
              </div>

              <div className="flex items-center text-gray-800">
                <CalendarDays className="w-4 h-4 mr-2 text-purple-500" />
                <span className="font-medium">Date:</span>&nbsp;
                {new Date(journey.journeyDate).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeAsDriver;


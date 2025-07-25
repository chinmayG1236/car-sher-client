import React from 'react';


export default function Journey({ journey,onNotify }) {
  const isPastJourney = new Date(journey.journeyDate) < new Date();
  return (
    <div className=
    {`relative bg-white border border-gray-200 shadow-md rounded-2xl p-5 my-4 mx-5 hover:shadow-lg transition duration-300 ${
      isPastJourney ? "bg-grey-500" : "bg-white"
    }`}
    >
      {!isPastJourney && (
        <button
          onClick={() => onNotify(journey)}
          className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm shadow"
        >
          🚀 I'm Interested
        </button>
      )}
      {/* User Name */}
      <h3 className="text-xl font-semibold text-green-700 mb-1">{journey.username}</h3>

      {/* Contact */}
      <p className="text-sm text-gray-700 mb-2">
        📞 <strong>Contact No:</strong> {journey.contactNo}
      </p>

      {/* From Location */}
      <p className="mb-1 flex items-center gap-2">
        <strong>From:</strong> {journey.start}
        <a
          href={journey.startOnMap}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline flex items-center text-sm"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991231.png"
            alt="Map Icon"
            className="w-4 h-4 mr-1"
          />
          View on Map
        </a>
      </p>

      {/* To Location */}
      <p className="mb-2 flex items-center gap-2">
        <strong>To:</strong> {journey.end}
        <a
          href={journey.endOnMap}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline flex items-center text-sm"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991231.png"
            alt="Map Icon"
            className="w-4 h-4 mr-1"
          />
          View on Map
        </a>
      </p>

      {/* Date, Seats, Vehicle */}
      <div className="flex flex-wrap gap-4 bg-amber-100 p-3 rounded-lg my-2 text-sm text-gray-800">
        <span>
          🗓️ <strong>Date:</strong> {new Date(journey.journeyDate).toLocaleString()}
        </span>
        <span>
          🚗 <strong>Vehicle:</strong> {journey.vehicle}
        </span>
        <span>
          💺 <strong>Seats Available:</strong> {journey.unoccupiedSeats}
        </span>
      </div>

      {/* Additional Note */}
      {journey.additionalNote && (
        <p className="mt-2 text-sm text-gray-700">
          📝 <strong>Note:</strong> {journey.additionalNote}
        </p>
      )}
    </div>
  );
}


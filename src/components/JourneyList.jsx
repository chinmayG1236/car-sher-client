import React, { useEffect, useState } from "react";
import Journey from "./Journey";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";

function JourneyList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [userStart, setUserStart] = useState("");
  const [userEnd, setUserEnd] = useState("");
  const [userSeats, setUserSeats] = useState("");
  const [userDate, setUserDate] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [userStartDate, setUserStartDate] = useState("");
  const [userEndDate, setUserEndDate] = useState("");

  useEffect(() => {
    fetch("/api/journey/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data); // Initially show all
      })
      .catch((error) => console.log("error fetching", error));
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();

    const filtered = items.filter((journey) => {
      const startMatch = journey.start
        .toLowerCase()
        .includes(userStart.toLowerCase());
      const endMatch = journey.end
        .toLowerCase()
        .includes(userEnd.toLowerCase());

      const seatsMatch =
        userSeats === "" ||
        journey.unoccupiedSeats == null ||
        parseInt(journey.unoccupiedSeats) >= parseInt(userSeats);

      const withinDateRange =
        (!userStartDate || journeyDate >= new Date(userStartDate)) &&
        (!userEndDate || journeyDate <= new Date(userEndDate));

      return startMatch && endMatch && seatsMatch && withinDateRange;
    });

    // If userDate is given, sort by how close the journey date is to userDate
    let sortedFiltered;
    if (userDate) {
      const targetDate = new Date(userDate);
      sortedFiltered = filtered.sort((a, b) => {
        return (
          Math.abs(new Date(a.journeyDate) - targetDate) -
          Math.abs(new Date(b.journeyDate) - targetDate)
        );
      });
    } else {
      // Default: nearest future date first
      sortedFiltered = filtered.sort(
        (a, b) => new Date(a.journeyDate) - new Date(b.journeyDate)
      );
    }

    setFilteredItems(sortedFiltered);
  };

  const handleNotify = async (journey) => {
    const passenger = {
      name: currentUser.username,
      id: currentUser._id,
    };
    socket.emit("passenger interested", {
      journey,
      passenger,
    });

    const data = {
      start:journey.start,
      end:journey.end,
      driver:journey.driver,
      passenger:currentUser._id,
      journeyDate: journey.journeyDate,
      driverName:journey.username,
      passengerName:currentUser.username,
      journeyId:journey._id,
    }
    const res = await fetch("/api/notification/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // console.log(res)
    

    alert(`Request sent to ${journey.username} (Driver)!`);
    
    
  };

  const now = new Date();
  const visibleItems = filteredItems.filter((journey) => {
    const journeyDate = new Date(journey.journeyDate);
    return showUpcoming ? journeyDate >= now : journeyDate < now;
  });

  return (
    <div>
      <div className="flex items-center space-x-4 ml-5 mb-4 mt-3.5">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            showUpcoming ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowUpcoming(true)}
        >
          Upcoming Rides
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            !showUpcoming ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowUpcoming(false)}
        >
          Past Rides
        </button>
      </div>

      {/* <form
        className="m-5 grid grid-cols-1 md:grid-cols-5 gap-4"
        onSubmit={handleFilter}
      >
        <input
          type="text"
          placeholder="Start location"
          value={userStart}
          onChange={(e) => setUserStart(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="End location"
          value={userEnd}
          onChange={(e) => setUserEnd(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Seats needed"
          value={userSeats}
          onChange={(e) => setUserSeats(e.target.value)}
          className="border p-2"
        />
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Preferred Date</label>
          <input
            type="date"
            value={userDate}
            onChange={(e) => setUserDate(e.target.value)}
            className="border p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Earliest Date</label>
          <input
            type="date"
            value={userStartDate}
            onChange={(e) => setUserStartDate(e.target.value)}
            className="border p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Latest Date</label>
          <input
            type="date"
            value={userEndDate}
            onChange={(e) => setUserEndDate(e.target.value)}
            className="border p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find Rides
        </button>
      </form> */}

<form
  onSubmit={handleFilter}
  className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
>
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Start Location</label>
    <input
      type="text"
      placeholder="Start location"
      value={userStart}
      onChange={(e) => setUserStart(e.target.value)}
      className="border p-2 rounded"
      required
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">End Location</label>
    <input
      type="text"
      placeholder="End location"
      value={userEnd}
      onChange={(e) => setUserEnd(e.target.value)}
      className="border p-2 rounded"
      required
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Seats Needed</label>
    <input
      type="number"
      min="1"
      placeholder="Seats needed"
      value={userSeats}
      onChange={(e) => setUserSeats(e.target.value)}
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Preferred Date</label>
    <input
      type="date"
      value={userDate}
      onChange={(e) => setUserDate(e.target.value)}
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Earliest Date</label>
    <input
      type="date"
      value={userStartDate}
      onChange={(e) => setUserStartDate(e.target.value)}
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Latest Date</label>
    <input
      type="date"
      value={userEndDate}
      onChange={(e) => setUserEndDate(e.target.value)}
      className="border p-2 rounded"
    />
  </div>

  <div className="flex items-end">
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
    >
      Find Rides
    </button>
  </div>
</form>


      {/* {filteredItems.length === 0 ? (
        <p className="ml-5">No journeys available</p>
      ) : (
        <div>
          {filteredItems.map((journey) => (
            <Journey
              key={journey._id}
              journey={journey}
              onNotify={handleNotify}
            />
          ))}
        </div>
      )} */}
      {visibleItems.length === 0 ? (
        <p className="ml-5">No journeys found.</p>
      ) : (
        <div>
          {visibleItems.map((journey) => (
            <Journey
              key={journey._id}
              journey={journey}
              onNotify={handleNotify}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JourneyList;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function OtherInfo() {
  const { start, end, startOnMap, endOnMap, currentUser } = useSelector(
    (state) => state.user
  );
  const username = currentUser.username;
  const driver = currentUser._id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    journeyDate: "",
    contactNo: "",
    unoccupiedSeats: "",
    vehicle: "",
    additionalNote: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Form Submitted:", formData);
    const formattedData = {
      ...formData,
      journeyDate: new Date(formData.journeyDate),
      start,
      end,
      startOnMap,
      endOnMap,
      username,
      driver,
    };
    console.log("Form Submitted:", formattedData);

    const res = await fetch("/api/journey/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });
    const data = await res.json();
    console.log("data", data);
    navigate("/");
  };
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 bg-white p-4 shadow-lg rounded-lg w-96"
      >
        <input
          id="journeyDate"
          type="datetime-local"
          placeholder="When will you start your journey"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="contactNo"
          type="text"
          placeholder="Your contact no."
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="unoccupiedSeats"
          type="text"
          placeholder="Unoccupied seats"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="vehicle"
          type="text"
          placeholder="Vehicle"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          id="additionalNote"
          type="text"
          placeholder="Additional note"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default OtherInfo;

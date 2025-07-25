import React, { useState } from "react";
import { GoogleMap, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useDispatch,useSelector } from 'react-redux';
import { addEnd, addStart, addStartOnMap, addEndOnMap } from "../redux/user/userSlice.js";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "400px" };
// const center = { lat: 28.7041, lng: 77.1025 }; // Default location (New Delhi)

export default function PlacesSearchBox() {
  const [searchBox, setSearchBox] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const dispatch = useDispatch();
  const { start } = useSelector((state) => state.user);  

  const onLoad = (ref) => setSearchBox(ref);
  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      setSelectedPlace(places[0]);
      console.log("Selected Place:", places[0]);
      const placeAdress = (places[0]).formatted_address;
      const mapUrl = (places[0]).url;
      console.log("Selected Place adress:", placeAdress);
      
      if(start === null){
        dispatch(addStart(placeAdress));
        dispatch(addStartOnMap(mapUrl));
      }
      else {
        dispatch(addEnd(placeAdress));
        dispatch(addEndOnMap(mapUrl));
      }
      
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY} libraries={libraries}>
      {/* Search Box is placed outside the map */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Search for a place..."
            className="border p-2 w-full"
            style={{
              width: "300px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          
        </StandaloneSearchBox>
      </div>

      {/* Google Map */}
      {/* <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10} /> */}

      {/* Display selected place */}
      {/* {selectedPlace && <p>Selected: {selectedPlace.formatted_address || selectedPlace.name}</p>} */}
    </LoadScript>
  );
}

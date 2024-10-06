/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import RoomCard from "./Card";
import axios from 'axios'; // Add this import statement

const RoomList = () => {

  const [roomList, setRoomList] = useState([])

  const fetchRooms = async () => {
    try {
      let response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/getRooms/`); // Use axios.get
      console.log(response.data); // Access data from response
      setRoomList(response.data); // Set room list with response data
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() =>
    fetchRooms
  ,[])
    
  return(
    <>
      {roomList.length > 0 ? 
        <div className="flex flex-row flex-wrap gap-4">  
          { roomList.map((room)=>
            <RoomCard key={room.ID} room={room}/>
          )}
        </div>
      :
        <p>No rooms available. Please create a room.</p>
      }  
    </>
  )
}

export default RoomList
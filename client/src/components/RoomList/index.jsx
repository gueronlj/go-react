/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../WebSocketProvider/webSocketProvider";
import { UserContext } from "../UserProvider/UserProvider";
import RoomCard from "./Card";

const RoomList  = () => {
  const {setConnection} = useContext(WebSocketContext)
  const {user} = useContext(UserContext)
  const [roomList, setRoomList] = useState([])

  const fetchRooms = async () => {
    try{
      let response = await fetch(`${import.meta.env.VITE_API_URL}/chat/getRooms/`, {
        method: 'GET',
      })
      const data = await response.json()
      if (response.ok){
        console.log(data);
        setRoomList(data);
      }
    } catch ( err ){
      console.log(err.message); 
    } 
  }

  const handleJoinRoom = (roomId) => {
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/chat/joinRoom/${roomId}?userId=${user.id}&username=${user.name}`)
    if (ws.OPEN) {
      setConnection(ws)
      console.log(`joining room at ${ws.url}`);
      return
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
            <RoomCard key={room.ID} room={room} handleJoinRoom={handleJoinRoom}/>
          )}
        </div>
      :
        <p>No rooms available. Please create a room.</p>
      }  
    </>
  )
}

export default RoomList
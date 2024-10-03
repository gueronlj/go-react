/* eslint-disable react/prop-types */
import { useContext } from "react";
import { WebSocketContext } from "../WebSocketProvider/webSocketProvider";
import { UserContext } from "../UserProvider/UserProvider";
import RoomCard from "./Card";

const RoomList  = ({data}) => {
    const {setConnection} = useContext(WebSocketContext)
    const {user} = useContext(UserContext)

    const handleJoinRoom = (roomId) => {
        const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/chat/joinRoom/${roomId}?userId=${user.id}&username=${user.name}`)
        if (ws.OPEN) {
            setConnection(ws)
            console.log(`joining room at ${ws.url}`);
            return
        }
    }

    return(
        <div className="flex flex-row flex-wrap gap-4">  
            { data.map((room)=>
                <RoomCard key={room.id} room={room} handleJoinRoom={handleJoinRoom}/>
            )}
        </div>
    )
}

export default RoomList
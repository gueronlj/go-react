/* eslint-disable react/prop-types */
import Card from "./Card";
import { WEBSOCKET_URL } from "../../configs";
import { useContext } from "react";
import { WebSocketContext } from "../WebSocketProvider/webSocketProvider";
import { Link } from "wouter";

const RoomList  = ({data, user}) => {
    const {setConnection} = useContext(WebSocketContext)

    const handleJoinRoom = (roomId, userId, username) => {
        const ws = new WebSocket(`${WEBSOCKET_URL}/chat/joinRoom/${roomId}?userId=${userId}&username=${username}`)

        if (ws.OPEN) {
            setConnection(ws)
            console.log(`joining room at ${ws.url}`);
            return
        }
    }

    return(
        <>
            { data.map((room)=>
                <Card key={room.id} room={room}>
                    <Link 
                        href="/chatroom"
                        onClick={() => handleJoinRoom(room.id, user.id, user.name)}>
                        Join
                    </Link>
                </Card>
            )}
        </>
    )
}

export default RoomList
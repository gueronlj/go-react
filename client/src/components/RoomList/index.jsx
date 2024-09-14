/* eslint-disable react/prop-types */
import Card from "./Card";
import { WEBSOCKET_URL } from "../../configs";
import { useContext } from "react";
import { WebSocketContext } from "../WebSocketProvider/webSocketProvider";
import { Link } from "wouter";
import { UserContext } from "../UserProvider/UserProvider";

const RoomList  = ({data}) => {
    const {setConnection} = useContext(WebSocketContext)
    const {user} = useContext(UserContext)

    const handleJoinRoom = (roomId) => {
        const ws = new WebSocket(`${WEBSOCKET_URL}/chat/joinRoom/${roomId}?userId=${user.id}&username=${user.name}`)

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
                        onClick={() => handleJoinRoom(room.id)}>
                        Join
                    </Link>
                </Card>
            )}
        </>
    )
}

export default RoomList
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../UserProvider/UserProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "../../ui/card";
import { Link } from "wouter";
import { WebSocketContext } from '../../WebSocketProvider/webSocketProvider';

const RoomCard = ({room, children}) => {
    const {setConnection} = useContext(WebSocketContext)
    const [userCount, setUserCount] = useState(0)
    const { user, setUser } = useContext(UserContext)

    const getUserCount = async () => {
        try {
            let res = await fetch(`${import.meta.env.VITE_API_URL}/chat/getClients/${room.ID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            let currentUsers = await res.json()
            if(currentUsers?.length>0){
                setUserCount(currentUsers.length)
            } else (
                setUserCount(0)
            )
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleJoinRoom = () => {
        const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/chat/joinRoom/${room.ID}?userId=${user.id}&username=${user.name}`)
        if (ws.OPEN) {
            setConnection(ws)
            setUser(prevUser => ({ ...prevUser, curentRoomId: room.ID }))
            console.log(`joining room at ${ws.url}`);
            return
        }
    }

    useEffect(() => {
        getUserCount()
      },[children])
      
    return(
        <Card className="w-[200px]">
            <CardHeader>
                <CardTitle>{room.Name}</CardTitle>
                <CardDescription>ID: {room.ID}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Users: {userCount}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link 
                    href="/chatroom"
                    onClick={() => handleJoinRoom()}>
                    Join
                </Link>
            </CardFooter>
        </Card>
    )
}

export default RoomCard
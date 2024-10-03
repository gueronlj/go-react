/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "../../ui/card";
import { Link } from "wouter";

const RoomCard = ({room, children, handleJoinRoom}) => {
    const [userCount, setUserCount] = useState(0)

    const getUserCount = async () => {
        try {
            let res = await fetch(`${import.meta.env.VITE_API_URL}/chat/getClients/${room.id}`, {
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

    useEffect(() => {
        getUserCount()
      },[children])
      
    return(
        <Card className="w-[200px]">
            <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>ID: {room.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Users: {userCount}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link 
                    href="/chatroom"
                    onClick={() => handleJoinRoom(room.id)}>
                    Join
                </Link>
            </CardFooter>
        </Card>
    )
}

export default RoomCard
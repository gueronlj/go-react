/* eslint-disable react/prop-types */

import Card from "./Card";

const RoomList  = ({data, userId, username}) => {

    const handleJoinRoom = (roomId, userId, username) => {
        const url = `ws://localhost:8080/chat/joinRoom/${roomId}?userId=${userId}&username=${username}`
        console.log(`joining room at ${url}`);
    }

    return(
        <>
            { data.map((room)=>
                <Card
                    key={room.id}
                    room={room}
                    onClick={()=>handleJoinRoom(room.id, userId, username)}>
                    
                    <button>Join</button>
                </Card>
                
            )}
        </>
    )
}

export default RoomList
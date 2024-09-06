/* eslint-disable react/prop-types */

const RoomList  = (props) => {

    const handleJoinRoom = async (roomId, userId, username) => {
        const url = `ws://localhost:8080/chat/joinRoom/${roomId}?userId=${userId}&username=${username}`
        console.log(`joining room at ${url}`);
    }

    return(
        <ul> 
            { props.data.map((room)=>
                <li key={room.id} onClick={()=>handleJoinRoom(room.id, props.userId, props.username)}> 
                    {room.name}
                </li>
            )}
        </ul>
    )
}

export default RoomList
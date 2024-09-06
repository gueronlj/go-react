import './App.css'
import { useState } from 'react'
import CreateRoom from './components/CreateRoom'
import RoomList from './components/RoomList'

function App() {
  const [roomList, setRoomList] = useState([])
  const [user] = useState(
    {
      id: 1,
      name: "sonesky"
    }
  )

  const fetchRooms = async () => {
    try{
      let response = await fetch('http://localhost:8080/chat/getRooms/', {
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
 
  return (
    <div>
      <CreateRoom/>

      <button onClick={fetchRooms}>View Rooms</button>

      <RoomList
        data={roomList}
        userId={user.id}
        username={user.name}/>
      
    </div>
  )
}

export default App

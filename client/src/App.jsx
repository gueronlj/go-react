import './App.css'
import { useEffect, useState } from 'react'
import CreateRoom from './components/CreateRoom'
import ChatRoom  from './components/Room'
import RoomList from './components/RoomList'
import WebSocketProvider from './components/WebSocketProvider/webSocketProvider'
import { Route, Link } from 'wouter'

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

  useEffect(() =>
    fetchRooms
 ,[])
 
  return (
    <>
      <CreateRoom/>
      <WebSocketProvider>
        <Link href="/rooms">Lobby</Link>
        <Route path="/rooms">
          <RoomList
            data={roomList}
            userId={user.id}
            username={user.name}/>
        </Route> 
        
        <Route path="/chatroom">
          <ChatRoom/>
        </Route> 
      </WebSocketProvider>
    </>
  )
}

export default App 

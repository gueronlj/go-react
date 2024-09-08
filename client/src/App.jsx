import './App.css'
import { useEffect, useState } from 'react'
import CreateRoom from './components/CreateRoom'
import ChatRoom  from './components/ChatRoom'
import RoomList from './components/RoomList'
import WebSocketProvider from './components/WebSocketProvider/webSocketProvider'
import { Route } from 'wouter'
import SidePanel from './components/SidePanel/sidepanel'

function App() {
  const [roomList, setRoomList] = useState([])
  const [user] = useState(
    { 
      id: "1",
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
      <WebSocketProvider>
        <Route path="/">
        <div className='main'>
          <SidePanel>
            <CreateRoom user={user}/>
          </SidePanel>
          <div className='lobby'>
              <RoomList
                data={roomList}
                user={user}/>
            </div>
        </div>
        </Route> 
        
        <Route path="/chatroom">
          <ChatRoom
            user={user}/>
        </Route> 
      </WebSocketProvider>
    </>
  )
}

export default App 

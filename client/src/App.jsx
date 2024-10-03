import './App.css'
import { useEffect, useState } from 'react'
import CreateRoom from './components/CreateRoom'
import ChatRoom  from './components/ChatRoom'
import RoomList from './components/RoomList'
import WebSocketProvider from './components/WebSocketProvider/webSocketProvider'
import { Route } from 'wouter'
import SidePanel from './components/SidePanel/sidepanel'
import AliasSelect from './components/AliasSelect/aliasselect'
import UserProvider from './components/UserProvider/UserProvider'

function App() {
  const [roomList, setRoomList] = useState([])

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
        <UserProvider>

          <Route path="/">
            <div className='main'>
              <SidePanel>
                <AliasSelect />
                <CreateRoom />
              </SidePanel>
              <div className='lobby'>
                {roomList.length > 0 ?
                   <RoomList data={roomList}/> : <div>No rooms available</div>}
              </div>
            </div>
          </Route> 

          <Route path="/chatroom">
            <ChatRoom/>
          </Route>

        </UserProvider>
      </WebSocketProvider>
    </>
  )
}

export default App 

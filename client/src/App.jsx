import './App.css'
import CreateRoom from './components/CreateRoom'
import ChatRoom  from './components/ChatRoom'
import RoomList from './components/RoomList'
import WebSocketProvider from './components/WebSocketProvider/webSocketProvider'
import { Route } from 'wouter'
import SidePanel from './components/SidePanel/sidepanel'
import AliasSelect from './components/AliasSelect/aliasselect'
import UserProvider from './components/UserProvider/UserProvider'

function App() {

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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight m-4">Rooms</h3>
                <RoomList/>
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

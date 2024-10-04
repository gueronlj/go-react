import './App.css'
import CreateRoom from './components/CreateRoom'
import ChatRoom  from './components/ChatRoom'
import RoomList from './components/RoomList'
import WebSocketProvider from './components/WebSocketProvider/webSocketProvider'
import { Route } from 'wouter'
import SidePanel from './components/SidePanel/sidepanel'
import AliasSelect from './components/AliasSelect/aliasselect'
import UserProvider from './components/UserProvider/UserProvider'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

    return (
        <>
          <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
                <UserProvider>

                    <Route path="/">
                        <div className='main'>
                            <SidePanel>
                                <AliasSelect />
                                <CreateRoom />
                            </SidePanel>
                            <div className='lobby'>
                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight m-4 text-left">Rooms</h3>
                                <RoomList/>
                            </div>
                        </div>
                    </Route> 

                  <Route path="/chatroom">
                      <ChatRoom/>
                  </Route>

                </UserProvider>
            </WebSocketProvider>
          </QueryClientProvider>
        </>
    )
}

export default App 

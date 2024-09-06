/* eslint-disable react/prop-types */
import {useState, createContext} from 'react'

export const WebSocketContext = createContext({
    connection: WebSocket || null,
    setConnection: () => {},
})

const WebSocketProvider = ({children}) => {

    const [connection, setConnection] = useState(null)
    return (
        <WebSocketContext.Provider
            value={{
                connection: connection,
                setConnection: setConnection
            }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider
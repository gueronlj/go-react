/* eslint-disable react/prop-types */
import {useState, createContext, useEffect} from 'react'

export const WebSocketContext = createContext({
    connection: WebSocket || null,
    setConnection: () => {},
})

const WebSocketProvider = ({children}) => {
    useEffect(() => {
        // Initialize WebSocket connection here
        const ws = new WebSocket('wss://your-websocket-server.com');
        setConnection(ws);

        return () => {
            // Clean up WebSocket connection when component unmounts
            if (ws) {
                ws.close();
            }
        };
    }, []);

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
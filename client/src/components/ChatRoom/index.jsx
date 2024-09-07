/* eslint-disable react/prop-types */
import { useState, useRef, useContext, useEffect } from 'react'
import ChatBody from "./ChatBody"
import { WebSocketContext } from '../WebSocketProvider/webSocketProvider'
import autosize from 'autosize'
import styles from './styles.module.css'

const ChatRoom = ({user}) => {

    const [ messages, setMessages ] = useState([])
    const [ users, setUsers ] = useState ([])
    const textarea = useRef(null)
    const { connection } = useContext(WebSocketContext)

    const sendMessage = () => {  
        if ( connection == null ) {
            console.log("ChatRoom - Failed to send, no connection");
            return
        }
        connection.send(textarea.current.value)
        textarea.current.value = ''
    }

    const getUsers = async () => {
        try{
            const roomId = await connection?.url?.split('/')[5].split('?')[0]
            console.log(roomId);
            const res = await fetch(`http://localhost:8080/chat/getClients/${roomId}`,{
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            console.log("Users in chat: "+JSON.stringify(data));
            setUsers(data)           
        } catch(err) {
            console.log(err);  
        }
    }

    useEffect (() => {
        connection && getUsers()
    },[])

    useEffect (() => {
        //Handle ws connection stuff
        if ( textarea.current ) {
            autosize(textarea.current)
        }
        if ( connection == null ) {
            console.log("ChatRoom - UseEffect: no ws connection");
            return
        }
        connection.onmessage = (message) => {
            const msg = JSON.parse(message.data)
            if (msg.content == 'A new user has joined'){
                //decunstruct previous users state and insert new user
                setUsers([...users, { username: msg.username, id: msg.userId }])
            }
            if (msg.content === `{${msg.username} left the chat`){
                //find matching username and remove from user list
                const targetUser = users.filter((user) => user.name != msg.username)
                setUsers([...targetUser])
                setMessages([...messages, msg])
                return
            }
            if (user?.name == msg.username) {
                msg.type = 'self'
                
            } else {
                msg.type = 'other'
            }
            setMessages([...messages, msg])
        
        }
        connection.onerror = (error) => { console.log("ChatRoom - connection error: " + error)}
        connection.onopen = () => { console.log('ChatRoom - connection open')}
    },[messages, connection, users, user.name])

    return (
        <div className='chatRoom'>
            <h2>Room ID: {messages[0]?.roomId}</h2>
            <ChatBody
                data={messages}/> 
            <div className={styles.userInput}>
            <textarea
                ref={textarea}/>
            <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
export default ChatRoom;
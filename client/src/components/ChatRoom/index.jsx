/* eslint-disable react/prop-types */
import { useState, useRef, useContext, useEffect } from 'react'
import ChatBody from "./ChatBody"
import { WebSocketContext } from '../WebSocketProvider/webSocketProvider'
import autosize from 'autosize'
import styles from './styles.module.css'
import { UserContext } from '../UserProvider/UserProvider'
import { useLocation } from 'wouter'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { debounce } from 'lodash'
import { useQuery } from '@tanstack/react-query'

const ChatRoom = () => {

    const [ messages, setMessages ] = useState([])
    const [ users, setUsers ] = useState([])
    const { user } = useContext(UserContext)
    const [userCount, setUserCount] = useState(0)
    const textarea = useRef(null)
    const { connection } = useContext(WebSocketContext)
    const [typingUsers, setTypingUsers] = useState([])
    const [, setLocation] = useLocation()
    const roomId = useRef(null)
    const lastTypingTime = useRef(0)

    const { isPending, error, data } = useQuery({
        queryKey: ['getMessages'],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/chat/getMessages/${roomId.current}`)
            .then((res) => res.json()),
    })

    // Fetch messages only once on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            await data; // Ensure data is fetched
            setMessages(data)
        };
        fetchMessages();
    }, []); // Empty dependency array to run only once

    const sendMessage = () => {  
        if ( connection == null ) {
            console.log("ChatRoom - Failed to send, no connection");
            return
        }
        connection.send(textarea.current.value)
        setTypingUsers(prev => prev.filter(usr => usr !== user.name));
        textarea.current.value = ''
    }

    const getUsers = async () => {
        try{
            if (connection && connection.url) {
                roomId.current = connection.url.split('/')[5].split('?')[0]
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/getClients/${roomId.current}`,{
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            setUsers(data)  
            setUserCount(data ? data.length : 0)
        } catch(err) {
            console.log(err);  
            setUserCount(0)
        }
    }

    const debouncedSendTyping = debounce(() => {
        const now = Date.now()
        if (now - lastTypingTime.current > 5000) {
            connection.send(`client_typing`)
            lastTypingTime.current = now
        }
    }, 1000)

    const handleTyping = () => {
        if (connection) {
            //Even though a user's typing state is emitted from server, we can put our own in memory for smoother feel
            if (!typingUsers.includes(user.name)) {
                setTypingUsers(prevTypingUsers => [...prevTypingUsers, user.name]);
            }
            debouncedSendTyping()
            //Remove typing indicator after 5 seconds
            setTimeout(() => {
                setTypingUsers(prev => prev.filter(usr => usr !== user.name));
            }, 5000);
        }
    }

    const handleLeaveBtn = () => {
        if (connection) {
            connection.close()
        }
        setLocation('/')
    }

    useEffect(() => {
        connection && getUsers()
    },[messages, connection])

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
            const msg = JSON.parse(message.data);
            if (msg.Content.endsWith("is typing")) {
                setTypingUsers(prevTypingUsers => {
                    if (!prevTypingUsers.includes(msg.Username)) {
                        return [...prevTypingUsers, msg.Username];
                    }
                    return prevTypingUsers;
                });
            }
            setMessages(prevMessages => [...prevMessages, msg]);
            console.log(msg);
        }
        connection.onerror = (error) => { 
            console.log("ChatRoom - connection error: " + error)
        }
        connection.onopen = () => { 
            console.log('ChatRoom - connection open')
        }
    },[messages, connection, users, user?.name, typingUsers])

    return (
        <div className={styles.chatRoom}>
            <div className={styles.header}>
                { isPending? <p>?</p> 
                    :<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">ID: {roomId.current}</h3>}
                <p>Users in chat: {userCount}</p>
                <Button onClick={handleLeaveBtn}>Back</Button>
            </div>
            
            <div className={styles.content}>
                {error && <p>There was a problem fetching messages</p>}
                {isPending? <p>Loading...</p>
                :
                <ChatBody data={messages}/>}
                
                <div className={styles.typingIndicator}>
                    {typingUsers.length > 0 && 
                        <>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</>}
                </div>
              
            </div>
            
             <div className={styles.footer}>
                <div className={styles.userInput}>
                    <textarea
                        className={cn(
                            "flex min-h-[40px] w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                            styles.textarea
                          )}
                        onChange={()=>handleTyping()}
                        ref={textarea}/>
                    <Button onClick={sendMessage} disabled={!textarea.current?.value}>Send</Button>
                </div>
            </div>   
            
        </div>
    )
}
export default ChatRoom;
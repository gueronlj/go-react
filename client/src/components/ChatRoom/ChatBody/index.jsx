/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import styles from './styles.module.css'

const ChatBody = ({ data }) => {
    const [messages, setMessages] = useState(data);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(data);
    }, [data]);

    // useEffect(() => {
    //     socket.on('receive_message', (newMessage) => {
    //         setMessages((prevMessages) => [...prevMessages, newMessage]);
    //     });

    //     return () => {
    //         socket.off('receive_message');
    //     };
    // }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.chatBody}>
            {messages.map((msg, index) => 
                <div key={index} className={styles.message}>
                    <div className={styles.sender+" "+(msg.type=='self'&&styles.selfSender)}>{msg.username}</div>
                    <div className={styles.messageContent+" "+(msg.type=='self'&&styles.self)}>
                        <p>{msg.content}</p>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef}/> 
        </div>
    )
}

export default ChatBody
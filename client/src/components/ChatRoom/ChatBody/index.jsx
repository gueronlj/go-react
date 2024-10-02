/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import styles from './styles.module.css'

const ChatBody = ({ data}) => {
    const [messages, setMessages] = useState(data);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(data);
    }, [data]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.chatBody}>
            {messages.map((msg, index) =>  
                <div key={index} className={`${styles.message}`}>
                    {!msg.serverMsg?
                        <div className={styles.sender+" "+(msg.type=='self'&&styles.selfSender)}>{msg.username}</div>
                    :null}
                    <div className={`${styles.messageContent} ${msg.type === 'self' ? styles.self : ''} ${msg.serverMsg? styles.serverMsg : ''}`}>
                            <p>{msg.content}</p>
                    </div>
                </div>   
            )}
            <div ref={messagesEndRef}/> 
        </div>
    )
}

export default ChatBody
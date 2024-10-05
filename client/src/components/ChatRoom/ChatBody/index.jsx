/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useContext } from 'react';
import styles from './styles.module.css'
import { UserContext } from '../../UserProvider/UserProvider'

const ChatBody = ({ data}) => {
    const [messages, setMessages] = useState(data);
    const { user } = useContext(UserContext);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Filter out "is typing" messages
        const filteredMessages = data.filter(msg => !msg?.Content?.endsWith('is typing'));
        setMessages(filteredMessages);
        console.log(messages);
    }, [data]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.chatBody}>
            {messages.map((msg, index) =>  
                <div key={index} className={`${styles.message}`}>
                    {!msg.serverMsg?
                        <div className={styles.sender+" "+(msg.Username === user?.name ? styles.selfSender : '')}>{msg.Username}</div>
                    :null}
                    <div className={`${styles.messageContent} ${msg.Username === user?.name ? styles.self : ''} ${msg.serverMsg? styles.serverMsg : ''}`}>
                        <p>{msg.Content}</p>
                    </div>
                </div>   
            )}
            <div ref={messagesEndRef}/> 
        </div>
    )
}

export default ChatBody
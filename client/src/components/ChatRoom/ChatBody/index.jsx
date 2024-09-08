/* eslint-disable react/prop-types */

import styles from './styles.module.css'

const ChatBody = ({data}) => {
    return (
        <div className={styles.chatBody}>
            {data?.map((msg, index) => 
                <div key={index} className={styles.message}>
                    <div className={styles.sender+" "+(msg.type=='self'&&styles.selfSender)}>{msg.username}</div>
                    <div className={styles.messageContent+" "+(msg.type=='self'&&styles.self)}>
                        <p>{msg.content}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBody
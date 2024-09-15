/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import styles from './styles.module.css';

const Card = ({room, children}) => {
    const [userCount, setUserCount] = useState(0)

    const getUserCount = async () => {
        try {
            let res = await fetch(`http://localhost:8080/chat/getClients/${room.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            let currentUsers = await res.json()
            if(currentUsers?.length>0){
                setUserCount(currentUsers.length)
            } else (
                setUserCount(0)
            )
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        getUserCount()
      },[children])
      
    return(
        <div className={styles.card}>
            <h3>{room.name}</h3>
            <p>{userCount}</p>
            {children}
        </div>
    )
}

export default Card
/* eslint-disable react/prop-types */
import styles from './styles.module.css';

const Card = ({room, children}) => {
    return(
        <div className={styles.card}>
            <h2>{room.name}</h2>
            {children}
        </div>
    )
}

export default Card
/* eslint-disable react/prop-types */
import { useState, useContext } from "react"
import styles from '../CreateRoom/styles.module.css'
import { UserContext } from "../UserProvider/UserProvider";

const AliasSelect = () => {
    const { user, setUser} = useContext(UserContext);
    
    const [ name, setName ] = useState(user?.name||'')
    
    const handleInput = (event) => {
        setName(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
     setUser({id: 'random', name: name })
    }

    return (
        <div className={styles.sideMenuForm}>
            <form>
                <h4>{user?.name}</h4>
                <label name="room">Change name: </label>
                <input name = "room" onChange={handleInput}/>

                <button onClick={handleSubmit}>Save</button>
            </form> 
        </div>
    )
}

export default AliasSelect
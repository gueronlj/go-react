/* eslint-disable react/prop-types */
import { useState } from "react"
import styles from '../CreateRoom/styles.module.css'

const AliasSelect = ({user, setUser}) => {
    const [ name, setName ] = useState(user?.name||'')
    const id = 'TBD'
    
    const handleInput = (event) => {
        setName(event.target.value)
    }

    const handleSubmit = () => {
        setUser({id: id, name:name})
        console.log(user);
    }

    return (
        <div className={styles.sideMenuForm}>
            <form>
                <label name="room">Change name: </label>
                <input name = "room" onChange={handleInput}/>

                <button onClick={handleSubmit}>Save</button>
            </form> 
        </div>
    )
}

export default AliasSelect
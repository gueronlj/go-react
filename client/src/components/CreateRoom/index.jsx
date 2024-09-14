import { useState } from "react"
import styles from './styles.module.css'

const CreateRoom = () => {
    const [input, setInput] = useState()

    const handleInput = (event) => {
        let id = new Date().toISOString()
        setInput({
            ID: id,
            Name: event.target.value
        })
    }

    const handleCreate = async () => {
        try{
            let res = await fetch("http://localhost:8080/chat/createRoom",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(input),
            })
            console.log(res);
        } catch (err){
            console.log(err);  
        }  
    }

    return(
        <div className={styles.sideMenuForm}>
            <form>
                <label name="room">Room Name: </label>
                <input name = "room" onChange={handleInput}/>
                <button onClick={handleCreate}>Create Room</button>
            </form> 
        </div>
    )
}

export default CreateRoom
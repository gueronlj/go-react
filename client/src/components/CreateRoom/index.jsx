import { useState } from "react"

const CreateRoom = () => {
    const [input] = useState({
        ID: "7",
        Name: "wooah"

    })

    const handleCreate = () => {
        fetch("http://localhost:8080/chat/createRoom",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(input),
        })
    }
    
    return(
        <div>
            <button onClick={handleCreate}>Create Room</button>
        </div>
    )
}

export default CreateRoom
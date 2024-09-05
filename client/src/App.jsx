import './App.css'
import { useState } from 'react'

function App() {
  const [roomList, setRoomList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRooms = async () => {
    try{
      setLoading(true)
      let response = await fetch('http://localhost:8080/chat/getRooms/', {
        method: 'GET',
      })
      const data = await response.json()
      if (response.ok){
        console.log(data);
        setRoomList(data);
      }
    } catch ( err ){
      console.log(err.message);  
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div> 
      <button onClick={fetchRooms}>View Rooms</button>
      
      { loading ? <h3>Fetching rooms...</h3>
        :
        <ul>
          { roomList.map((room)=>
            <li key={room.id}>
              {room.name}
            </li>
          )}
        </ul>
      }
    </div>
  )
}

export default App

/* eslint-disable react/prop-types */
import RoomCard from "./Card";
import axios from 'axios'; // Add this import statement
import { useQuery } from '@tanstack/react-query'; // Add this import statement

const RoomList = () => {

  const {data, error, isPending} = useQuery({
    queryKey: ['rooms'],
    queryFn: () => 
      axios.get(`${import.meta.env.VITE_API_URL}/chat/getRooms/`).then(response => response.data) // Return response data
    // 
  });

  return(
    <>
      {error && <p>Error fetching rooms: {error.message}</p>}
      {isPending? <p>Loading...</p> : 
        <>
          {data?.length > 0 ? 
            <div className="flex flex-row flex-wrap gap-4">  
              {data.map((room)=>
                <RoomCard key={room.ID} room={room}/>
              )}
            </div>
          :
            <p>No rooms available. Please create a room.</p>}
        </> 
      }
    </>
  )
}

export default RoomList
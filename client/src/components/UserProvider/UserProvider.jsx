/* eslint-disable react/prop-types */
import {useState, createContext} from 'react'

export const UserContext = createContext(null)

const CurrentUserProvider = ({children}) => {

    const [user, setUser] = useState({id:"random", name:"guest"})
    return (
        <UserContext.Provider
            value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default CurrentUserProvider
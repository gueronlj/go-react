/* eslint-disable react/prop-types */
import { useState, useContext } from "react"
import { UserContext } from "../UserProvider/UserProvider";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AliasSelect = () => {
    const { user, setUser} = useContext(UserContext);
    
    const [ name, setName ] = useState(user?.name||'')
    
    const handleInput = (event) => {
        setName(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({id: randomId(), name: name, currentRoomId: 0 })
    }

    const randomId = () => {
        return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    };

    return (
        <Card className="w-[250px]">
            <CardHeader>
                <CardTitle>Alias</CardTitle>
                <CardDescription>Change your name anytime here</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Input id="name" placeholder="Enter your name" onChange={handleInput}/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

export default AliasSelect
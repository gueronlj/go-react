import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

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
        try {
            // Use import.meta.env for Vite apps
            let res = await fetch(`${import.meta.env.VITE_API_URL}/chat/createRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(input),
            })
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <Card className="w-[250px]">
            <CardHeader>
                <CardTitle>Create Room</CardTitle>
                <CardDescription>Make a new chat room</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                        <Input id="name" placeholder="Enter room name" onChange={handleInput}/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={handleCreate}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

export default CreateRoom
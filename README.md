# go-react
Realtime chat v2 (golang and react)

## To Do
- display messages
- stop hardcoding user in client
- store users and rooms in db?

## Server Setup
```
go mod tidy
go run ./server/cmd/main.go
```

This will start http server at http://localhost:8080

## Client Setup
```
npm install
npm run dev
```

This will run on http://localhost:5173/

## Backend Testing Notes

*Chat room and user objects are currently only stored in server's memory. Therefore,  ALWAYS CREATE A ROOM FIRST.

### Create a room
POST to http://localhost:8080/chat/createRoom
```
Body: {
    "ID": "1",
    "name": "test1"
}
```
### Websockets in Postman
New >  websocket request >  ws://localhost:8080/chat/joinRoom/1?userId=69&username=nice

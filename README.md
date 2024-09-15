# go-react
Realtime chat v2 (golang and react)

## To Do
- display number of users in a room
- randomly generate short Id for rooms
- store users and rooms/messages in db

## Server Setup
```
go mod tidy
go run ./server/cmd/main.go
```

This will start http server at http://localhost:8080

## Client Setup
```
npm install
npm start
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
New request >  websocket request >  ws://localhost:8080/chat/joinRoom/1?userId=69&username=nice

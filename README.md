# go-react
Realtime chat v2 (golang and react)

##Setup
1) go mod tidy
2) go run ./server/cmd/main.go

This will start http server at http://localhost:8080

##Testing the backend

*Chat room and user objects are currently only stored in server's memory. Therefore,  ALWAYS CREATE A ROOM FIRST.

1) POST to http://localhost:8080/chat/createRoom

    Body: {
        "ID": "1",
        "name": "test1"
    }

2) New >  websocket request >  ws://localhost:8080/chat/joinRoom/1?userId=69&username=nice

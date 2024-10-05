package chat

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Connection *websocket.Conn
	Message    chan *Message
	ID         int    `json:"id"`
	RoomID     int    `json:"roomId"`
	Username   string `json:"username"`
}

type Message struct {
	Content   string `json:"Content"`
	RoomID    int    `json:"RoomId"`
	Username  string `json:"Username"`
	UserId    int    `json:"UserId"`
	ServerMsg bool   `json:"ServerMsg"`
}

func (c *Client) writeMessage() {
	defer func() {
		c.Connection.Close()
	}()
	for {
		message, ok := <-c.Message
		if !ok {
			return
		}
		c.Connection.WriteJSON(message)
	}
}

func (c *Client) readMessage(hub *Hub) {
	defer func() {
		hub.Leave <- c
		c.Connection.Close()
	}()
	for {
		_, m, err := c.Connection.ReadMessage()
		if err != nil {
			//check for common websocket errors
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		//send mesg through Hub's broadcast channel
		msg := &Message{
			Content:   string(m),
			RoomID:    c.RoomID,
			Username:  c.Username,
			UserId:    c.ID,
			ServerMsg: false,
		}
		hub.Broadcast <- msg
	}
}

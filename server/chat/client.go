package chat

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Connection *websocket.Conn
	Message    chan *Message
	ID         string `json:"id"`
	RoomID     string `json:"roomId"`
	Username   string `json:"username"`
}

type Message struct {
	Content   string `json:"content"`
	RoomID    string `json:"roomId"`
	Username  string `json:"username"`
	UserId    string `json:"userId"`
	ServerMsg bool   `json:"serverMsg"`
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

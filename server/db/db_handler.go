package db

//This package will hold all functions that store rooms and messages and user info in a database.
import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Add this line to import the PostgreSQL driver
)

func GetDB() *sql.DB {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	connectionStr := os.Getenv("DB_STR")
	db, err := sql.Open("postgres", connectionStr)
	if err != nil {
		fmt.Println(err)
	}
	return db
}

type Room struct {
	ID   int
	Name string
}

type Message struct {
	ID       int
	Content  string
	Username string
	Room_Id  int
}

func CreateRoom(room Room) (Room, error) {
	db := GetDB()
	query := `INSERT INTO rooms (id, name) VALUES ($1, $2) RETURNING ID`
	err := db.QueryRow(query, room.ID, room.Name).Scan(&room.ID)
	if err != nil {
		return room, err
	}
	return room, nil
}

func StoreMessage(message Message) (Message, error) {
	db := GetDB()
	query := `INSERT INTO messages (id, content, username, room_id) VALUES ($1, $2, $3, $4) RETURNING ID`
	err := db.QueryRow(query, message.ID, message.Content, message.Username, message.Room_Id).Scan(&message.ID)
	if err != nil {
		return message, err
	}
	return message, nil
}

func GetMessages(c *gin.Context) ([]Message, error) {
	db := GetDB()
	roomID := c.Param("roomId")
	rows, err := db.Query("SELECT id, content, username, room_id FROM messages WHERE room_id = $1;", roomID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.ID, &msg.Content, &msg.Username, &msg.Room_Id); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	if c != nil {
		c.JSON(http.StatusOK, messages)
	}
	return messages, nil
}

func GetRooms(c *gin.Context) ([]Room, error) {
	db := GetDB()
	rows, err := db.Query("SELECT * FROM rooms;")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []Room
	for rows.Next() {
		var room Room
		if err := rows.Scan(&room.ID, &room.Name); err != nil {
			return nil, err
		}
		rooms = append(rooms, room)
	}

	// Only send JSON response if context is not nil
	if c != nil {
		c.JSON(http.StatusOK, rooms)
	}

	return rooms, nil
}

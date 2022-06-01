const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
      origins: ['*']
    }
  });
const path = require('path')

const Database = require('./database.js')

const db = new Database();

app.get("/",(req,res) =>{
    res.sendFile(__dirname + "/index.html")
})

io.on("connection",(socket)=>{  
    console.log("A user with ID: " + socket.id + "connected")

    socket.on("disconnect",()=>{
        console.log("A user with ID: " + socket.id +"disconnect")
    })

    if(io.sockets.connected)
        socket.emit("connections", Object.keys(io.sockets.connected).length)
    else socket.emit("connections",0)

    socket.on("chat-message", async (message) =>{
        const data = {
            message : message.message,
            user_id: socket.id,
            name: message.user,
        }

        await db.storeUserMessage(data)
        socket.broadcast.emit("chat-message",message)
    })

    socket.on("typing", (data) =>{
        socket.broadcast.emit("typing",data)
    })

    socket.on("stopTyping",() =>{
        socket.broadcast.emit("stopTyping")
    })

    socket.on("joined", async(name) =>{
        let messageData = null;
        const data = {
            name,
            user_id: socket.id,
        }

        const user = await db.addUser(data)
        if(user){
            messageData = await db.fetchUserMessages(data)

        }
        socket.broadcast.emit("joined", messageData)
    })

    socket.on("leave",(data) => {
        socket.broadcast.emit("leave", data)
    })
})




http.listen(3000,() =>{
    console.log("Listening on Port *:3000")
})
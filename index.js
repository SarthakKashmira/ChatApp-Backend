//modules imported
const {createServer }=require('http');
const express=require('express');
const app=express();
const cors=require('cors');
const {Server}=require('socket.io');

//server created
const server=createServer(app);

//middleware used
app.use(cors());

//constants initialized
const port=5500 || process.env.PORT;
let users={};


app.get("/",(req,res)=>{
    res.send("HELL IT is working");
})


const io = new Server(server);


io.on("connection",(socket)=>{
    console.log("New connection");

    socket.on("joined",(user)=>{
       console.log(`Joined by user ${user}`);
       users[socket.id]=user;      
       console.log(users);
       socket.broadcast.emit("userjoined",{user:"Admin",message:`${users[socket.id]} has Joined`,id:socket.id})//to send message to everybody other than the person who joined
       socket.emit("welcome",{user:"Admin",message:`Welcome to the chat ${users[socket.id]}`,id:socket.id}) //to send message whenever a person joins the chat to himself
    })
    console.log(users[socket.id]);
    
    
    socket.on("message",({message,id})=>{
        // console.log(id);
        io.emit("sendmessage",{user:users[id] ,message,id})
     })
    socket.on("disconnect",()=>{
        socket.broadcast.emit("leave",{user:"Admin",message:`${users[socket.id]} has left`,id:socket.id});// socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
        // console.log(`User Left`);
    })
});
                
    
server.listen(port,()=>{
    console.log(`listening on port http://localhost:${port}`);
})
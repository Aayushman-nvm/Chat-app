import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 5000 });

ws.on("connection", function(socket){
    console.log("User connected and their socket");
    socket.on("message",(e)=>{
        console.log(e.toString());
        socket.send("Pong to ",e.toString());
    })
});
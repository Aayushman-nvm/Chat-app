import { WebSocketServer } from "ws";
import { handleConnection } from "./wsController.js";

export function setupWebsocket(server){
const wss= new WebSocketServer({server});

wss.on("connection",(ws)=>{
    console.log("Websocket connected");
    handleConnection(ws, wss);
})
}
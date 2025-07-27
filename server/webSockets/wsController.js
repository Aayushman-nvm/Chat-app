import { findOnlineClients, sendMessages, otherClients } from "./wsServices.js";

export function handleConnection(ws, wss) {
  ws.isAlive = true;
  ws.timer = setInterval(() => {
    ws.ping();
    /*if theres no pong as response, trigger deathtimer that is 
     trigger death timer to trigger socket termination*/
    ws.deathTimer = setTimeout(() => {
      ws.isAlive = false;
      clearInterval(ws.timer);
      ws.terminate();
      //update online client list after socket termination
      otherClients(wss);
    }, 1000);
  }, 5000);

  ws.on("pong", () => {
    clearTimeout(ws.deathTimer);
    /*if theres pong as response, clear deathtimer that is 
     dont trigger death timer to trigger socket termination*/
  });
  //ws is ur individual socket, wss is ur comeplete socket server
  ws.on("message", async (data) => {
    const message = JSON.parse(data);
    if (message.type === "token") {
      //token part
      console.log("Finding online client in be");
      findOnlineClients(message, ws, wss);
    }
    if (message.type === "message") {
      //sending message part
      console.log("Sending message to client in be");
      sendMessages(message, wss);
    }
    console.log("Fe message in backend ", message);
  });
}

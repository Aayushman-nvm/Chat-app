import { findOnlineClients, sendMessages } from "./wsServices.js";

export function handleConnection(ws, wss) {
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

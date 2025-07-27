//add service functions to simplify wsController code
import jwt from "jsonwebtoken";
import { messageModel } from "../model/message.js";

export function otherClients(wss) {
  [...wss.clients].forEach((client) => {
    const otherClients = [...wss.clients]
      .filter((c) => c !== client)
      .map((c) => ({ id: c.id, name: c.name }));
    client.send(
      JSON.stringify({
        type: "onlineClient",
        clients: otherClients,
      })
    );
  });
}

export function findOnlineClients(message, ws, wss) {
  console.log("Finding online clients hit in be services");
  try {
    const { id, name } = jwt.verify(message.secret, process.env.SECRET);
    ws.id = id;
    ws.name = name;
    console.log(
      [...wss.clients].map((c) => `UserID: ${c.id}, Name: ${c.name}`)
    );
    otherClients(wss);
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessages(message, wss) {
  console.log("send message to clients hit in be services");
  const { recipient, text, sender } = message;
  const messageDoc = await messageModel.create({
    sender: sender,
    recipient: recipient,
    text: text,
  });
  [...wss.clients]
    .filter(
      (client) => client.id === recipient.id || client.id === recipient._id
    )
    .forEach((client) =>
      client.send(
        JSON.stringify({
          type: "message",
          message: messageDoc,
        })
      )
    );
  console.log("Fe message ", message);
}

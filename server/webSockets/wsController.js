import jwt from "jsonwebtoken";

export function handleConnection(ws, wss) {
  //ws is ur individual socket, wss is ur comeplete socket server
  ws.on("message", async (data) => {
    const message = JSON.parse(data);
    if (message.type === "token") {//token part
      try {
        const { id, name } = jwt.verify(message.secret, process.env.SECRET);
        ws.id = id;
        ws.name = name;
        console.log(
          [...wss.clients].map((c) => `UserID: ${c.id}, Name: ${c.name}`)
        );
        [...wss.clients].forEach((client) => {
          const otherClients = [...wss.clients]
            .filter((c) => c !== client)
            .map((c) => ({ id: c.id, name: c.name }));
          console.log("Other clients: ", otherClients);
          client.send(
            JSON.stringify({
              type: "onlineClient",
              clients: otherClients,
            })
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (message.type === "message") {//sending message part
      const { recipient, text, sender } = message;
      [...wss.clients]
        .filter((client) => client.id === recipient.id)
        .forEach((client) =>
          client.send(JSON.stringify({ type: "message", text: text, id: sender.id, name:sender.name }))
        );

      console.log("Fe message ", message);
    }
    console.log("Fe message in backend ", message);
  });
}

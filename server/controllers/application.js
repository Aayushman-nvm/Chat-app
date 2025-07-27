import jwt from "jsonwebtoken";
import { messageModel } from "../model/message.js";
import { Users } from "../model/user.js"

export async function getMessages(req, res) {
  const { userId } = req.params;
  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ");
  const token = authToken[1];
  const { id: ourId, name } = jwt.verify(token, process.env.SECRET);
  console.log("ID, name: ", ourId, name);
  const messages = await messageModel
    .find({
      $or: [
        { "sender.id": userId, "recipient.id": ourId },
        { "sender.id": ourId, "recipient.id": userId },
      ],
    })
    .sort({ createdAt: 1 });
    console.log("Message History: ",messages);
    res.json(messages);
  console.log("UserId in be: ", userId);
}

export async function getUsers(req, res){
  const users=await Users.find({},{'_id':1,name:1});
  res.json(users);
};
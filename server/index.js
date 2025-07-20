import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";

import router from "./routes/serverRoutes.js";

dotenv.config();

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(express.json());
app.use(cors());
app.use("/", router);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error));

const server = app.listen(PORT, () => {
  console.log(`Server runnng on: http://localhost:${PORT}`);
});

const ws = new WebSocketServer({ server });

ws.on("connection", (connection) => {
  console.log("Web socket connected");
  connection.on("message", async (data) => {
    const message = JSON.parse(data);
    if (message.type === "token") {
      try {
        const token = jwt.verify(message.secret, process.env.SECRET);
        const userID = token.id;
        console.log("USER ID: ", userID);
      } catch (error) {
        console.log(error);
      }
    }
  });
});

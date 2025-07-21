import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { setupWebsocket } from "./webSockets/webSockets.js";
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

setupWebsocket(server);
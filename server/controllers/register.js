import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Users } from "../model/user.js";

export async function handleLogin(req, res) {
  console.log(req.body);

  const body = req.body;
  const user = await Users.findOne({ email: body.email });

  const isMatch = await bcrypt.compare(body.password, user.password);
  const token = jwt.sign({ id: user._id }, process.env.SECRET);
  
  const finalUser=user.toObject();
  delete finalUser.password
  res.json({ token, user:finalUser });
}

export async function handleRegister(req, res) {
  console.log(req.body);

  const body = req.body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(body.password, salt);

  const newUser = await Users.create({
    name: body.name,
    email: body.email,
    password: passwordHash,
  });

  const savedUser = await newUser.save();

  res.json(savedUser);
}
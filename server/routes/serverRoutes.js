import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/register.js";
import { getMessages } from "../controllers/messages.js";

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/messages/:userId", getMessages);

export default router;

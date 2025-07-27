import { Router } from "express";
import { handleLogin, handleRegister, handleLogout } from "../controllers/register.js";
import { getMessages, getUsers } from "../controllers/application.js";

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/messages/:userId", getMessages);
router.get("/users", getUsers);

export default router;

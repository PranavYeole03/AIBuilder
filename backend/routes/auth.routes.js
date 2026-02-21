import express from "express"
import { googleAuth, logout } from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/google-login", googleAuth)
authRouter.get("/log-out", logout)

export default authRouter;
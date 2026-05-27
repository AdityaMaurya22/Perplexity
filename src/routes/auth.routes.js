import {Router} from "express";
import {registerValidator, loginValidator} from "../validator/auth.validator.js";
import {register, verifyEmail, login, getMe} from "../controllers/auth.controller.js";
import {authUser} from "../middleware/auth.middleware.js";

const authRouter = Router();


// Register route
// http://localhost:3000/api/auth/register
// body: {username, email, password}
authRouter.post("/register",registerValidator, register);

// Email verification route
// http://localhost:3000/api/auth/verify-email?token=jwtToken
authRouter.get("/verify-email", verifyEmail)

// Login route
// http://localhost:3000/api/auth/login
// body: {email, password}
authRouter.post("/login", loginValidator, login )

authRouter.get("/get-me", authUser, getMe)

export default authRouter;
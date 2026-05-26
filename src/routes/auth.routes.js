import {Router} from "express";
import {registerValidator} from "../validator/auth.validator.js";
import {register} from "../controllers/auth.controller.js";

const authRouter = Router();


// Register route
// http://localhost:3000/api/auth/register
// body: {username, email, password}
authRouter.post("/register",registerValidator, register);

export default authRouter;
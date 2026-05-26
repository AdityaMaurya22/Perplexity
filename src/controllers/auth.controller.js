import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with the same username or email already exists",
            sucess: false,
            err: "User already exists"
        })
    }

    // password hashing is handled in the user model using mongoose pre hook
    const user = await userModel.create({
        username,
        email,
        password
    })

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `<p>Hello ${username},</p>
        <p>Thank you for registering on Perplexity! We're thrilled to have you as part of our community. If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p><p>Happy exploring!</p>`
    })

    res.status(201).json({
        message: "User registered successfully",
        sucess: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
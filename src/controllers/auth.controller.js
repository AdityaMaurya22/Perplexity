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
            success: false,
            err: "User already exists"
        })
    }

    // password hashing is handled in the user model using mongoose pre hook
    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        html: `<p>Hello ${username},</p>
        <p>Thank you for registering on Perplexity! We're thrilled to have you as part of our community. If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p><p>Happy exploring!</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>Best regards,<br/>The Perplexity Team</p>`
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {



        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;
        await user.save();

        const html = `<h1>Email Verified Successfully</h1>
        <p>Your email has been verified successfully. You can now log in to your account.</p>`

        res.send(html);
    } catch (err) {
        res.status(400).json({
            message: "Invalid token",
            sucess: false,
            err: err.message
        })
    }
}

export async function login(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(400).json({
            message: "User with this email does not exist",
            success: false,
            err: "User not found"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Incorrect password",
            success: false,
            err: "Incorrect password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

export async function getMe(req, res){
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if(!user){
        return res.status(400).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    })
}




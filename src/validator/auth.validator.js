import {body, validationResult} from "express-validator";

function validate(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }   
    next();
}

export const registerValidator = [
    body("username").trim().notEmpty().withMessage("username is reqired").matches(/^[a-zA-Z0-9]+$/).withMessage("username must contain only letters and numbers"),

    body('email').trim().notEmpty().withMessage("email is required").isEmail().withMessage("Provide a valid email address"),

    body('password').notEmpty().withMessage("password is required").isLength({min: 6, max: 15 }).withMessage("password must be at least 6-15 characters long"),

    validate
]


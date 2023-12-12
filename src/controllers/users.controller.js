//Controller de API Users
//Importaciones
import { response } from "express";
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";    //JWT
import transporter from "../utils/nodemailer.js";

import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const userManager = new UserManager();

//Controller GET User
export const GETAllUsers = async (req, res, next) => {
    try {
        const users = await userManager.getUsers(next);
        if(users){
            res.status(200).send(users);
        }
        else{
            return CustomError.new(errorsDictionary.usersNotFound);
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller POST User
export const POSTUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await userManager.addUser(userData, next);
        if(user){
            user.payload ? res.status(200).send({ created: user.message, user: user.payload }) : res.status(404).send({ error: user.message })
        }
        else{
            return CustomError.new(errorsDictionary.userNotCreated)
        }
    } catch (error) {
        error.from = "controller";
        return next(error)
    }
}

//Controller POST Login User JWT
export const POSTUserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.validateLogin(email, password, next);
        if (!user) { return CustomError.new(errorsDictionary.auth)}
        if (!user.payload) {
            res.status(400).send({ error: true, message: user.message })
        } else {
            const token = generateToken({ sub: user.payload._id.toString(), user: { email: user.payload.email } })
            res.cookie('accessToken', token, {
                maxAge: (24 * 60 * 60) * 5000,
                httpOnly: true,
            })
            res.status(200).send({ error: false, accessToken: token })
        }
    } catch (error) {
        error.from = "controller";
        return next(error)
    }
}
//Controller GET User JWT
export const GETUser = (req, res) => {
    res.send({ error: false, user: req.user });
}

//Controller GET User con Sessions
export const GETCurrentUser = (req, res, next) => {
    try {
        if (!req.user) return CustomError.new(errorsDictionary.unauthorized);
        else {
            const filterData = userManager.filterData(req.user, next);
            if(filterData){
                res.status(200).send(filterData);
            }else{
                return CustomError.new(errorsDictionary.internalError)
            }
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }

}

//Controller PUT Role user
export const PUTUserRole = async (req, res, next) => {
    try {
        const id = req.params.uid;
        const newRole = req.body.role
        if (id.length < 24) {
            res.status(404).send({ error: true, message: "Id number to short" });
        } else {
            const response = await userManager.updateUserRole(id, newRole, next);
            if(response){
                response.error ? res.status(response.code).send({ error: true, message: response.message }) : res.status(200).send({ error: false, message: response.message })
            }
            else{
                return CustomError.new(errorsDictionary.internalError)
            }
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller PUT Role user
export const PUTLogedUserRole = async (req, res, next) => {
    try {
        const id = req.user.id;
        let newRole
        if(req.user.role === "user" || req.user.role === "premium"){
            newRole = "premium";
        }if(req.user.role === "admin")
        {
            newRole = "admin";        
        }
        if (id.length < 24) {
            res.status(404).send({ error: true, message: "Id number to short" });
        } else {
            const response = await userManager.updateUserRole(id, newRole, next);
            if(response){
                response.error ? res.status(response.code).send({ error: true, message: response.message }) : res.status(200).send({ error: false, message: response.message })
            }
            else{
                return CustomError.new(errorsDictionary.internalError)
            }
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Post user para /register
export const POSTNone = async (req, res, next) => {
    try {
        res.status(201).send({ message: "success", payload: req.user._id })
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

export const POSTSignout = async (req, res, next) => {
    try {
        const response = res.clearCookie('accessToken', {
            httpOnly: true,
        });
        if(response){
            req.session.destroy((error) => {
                res.status(200).send({ message: "User logged out" })
            });
        }else{
            return CustomError.new(errorsDictionary.userNotFoundOne)
        }
        
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}


//Controller POST Restore Password
export const POSTRestorePassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(req.user)
        {
            if(req.user.email !== email)  { return res.status(400).send({message: "Email Adress not match"})}
        }
        const user = await userManager.getUserByEmail(email, next)
        if (!user) return CustomError.new(errorsDictionary.userNotFoundOne)
        else {
            const id = user._id.toString();
            const restoreEmail = await transporter.sendMail({
                from: 'Support CoderApp <simeon60@ethereal.email>',
                to: `${user.username} <${user.email}>`,
                subject: 'Reset Password',
                html: `<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                        }
                
                        h1 {
                            color: #333;
                        }
                
                        p {
                            color: #666;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset</h1>
                        <p>Hello ${user.email},</p>
                        <p>We have received a request to reset the password for your account. To proceed, please click the link below:</p>
                        <p><a href="http:localhost:8080/restore/${id}" class="button">Reset Password</a></p>
                        <p>If you did not request this password reset, you can safely ignore this message.</p>
                        <p>Thank you,<br>The Support Team</p>
                    </div>
                </body>
                </html>`
            })
            res.status(200).send({ message: "Email sent!" })
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller POST Update user password
export const POSTUserResetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword, id } = req.body;
        const user = await userManager.getUserById(id, next);
        if (password != confirmPassword) return CustomError.new(errorsDictionary.passwordNotMatch);
        else {
            const response = await userManager.updateUserPassword(id, password, next);
            if (response.error) {
                res.status(403).send({ user: user.email, id: id, errorMessage: response.message });
            }
            else {
                res.status(200).send({ user: user.email, id: id, message: response.message });
            }
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET Login Github User JWT
export const GETGithub = async (req, res, next) => {
    try {
        const user = req.user;
        const token = generateToken({ sub: user._id.toString(), user: { email: user.email } })
        res.cookie('accessToken', token, {
            maxAge: (24 * 60 * 60) * 5000,
            httpOnly: true,
        })
        res.redirect("/products");
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}


//Controller PUT Logged User Password
export const PUTLoggedUserPassword = async (req, res, next) => {
    try {
        const user = req.user;
        const { password, confirmPassword } = req.body;
        if (password != confirmPassword) return CustomError.new(errorsDictionary.passwordNotMatch);
        else {
            const response = await userManager.updateUserPassword(user._id, password, next);
            if(response){
                if (response.error) {
                    res.status(403).send({ user: user.email, id: user._id, errorMessage: response.message });
                }
                else {
                    res.status(200).send({ user: user.email, id: user._id, message: response.message });
                }
            }else{
                return CustomError.new(errorsDictionary.internalError)
            }

        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller POST Change Logged User Password
export const POSTChangeLoggedUserPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(req.user)
        {
            if(req.user.email !== email)  { return res.status(400).send({message: "Email Adress not match"})}
        }
        else{
            return CustomError.new(errorsDictionary.unauthorized)
        }
        const user = await userManager.getUserByEmail(email)
        if (!user) return CustomError.new(errorsDictionary.userNotFoundOne)
        else {
            const id = user._id.toString();
            const restoreEmail = await transporter.sendMail({
                from: 'Support CoderApp <simeon60@ethereal.email>',
                to: `${user.username} <${user.email}>`,
                subject: 'Reset Password',
                html: `<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                        }
                
                        h1 {
                            color: #333;
                        }
                
                        p {
                            color: #666;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset</h1>
                        <p>Hello ${user.email},</p>
                        <p>We have received a request to reset the password for your account. To proceed, please click the link below:</p>
                        <p><a href="http:localhost:8080/password/${id}" class="button">Reset Password</a></p>
                        <p>If you did not request this password reset, you can safely ignore this message.</p>
                        <p>Thank you,<br>The Support Team</p>
                    </div>
                </body>
                </html>`
            })
            res.status(200).send({ message: "Email sent!" })
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}
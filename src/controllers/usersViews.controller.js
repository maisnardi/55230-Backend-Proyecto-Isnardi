//Controller de Users Views
//Importaciones
import { el } from "@faker-js/faker";
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";
import transporter from "../utils/nodemailer.js";

//Instanciamos un nuevo productManager.
const userManager = new UserManager();

//Controller GET vista Login.
export const GETLoginView = async (req,res)=>{
    try{
        const users = await userManager.getUsers();
        res.render('login')      
    }catch(e){
        res.status(502).send({error:true});
    }
}
//Controller GET vista Register.
export const GETRegisterView = async (req,res)=>{
    res.render("register")
}

//Controller GET vista Profile.
export const GETProfileView = async (req,res)=>{
    const userData = {
        first_name: req.user.first_name.trim().length>0? req.user.first_name : false,
        last_name: req.user.last_name.trim().length>0? req.user.last_name : false,
        age: req.user.age.trim().length>0? req.user.age : false,
        username: req.user.username.trim().length>0? req.user.username : false,
        email: req.user.email,
        role: req.user.role,
    }
    res.render("profile", {user:userData})
}

//Controller GET vista Logout.
export const GETLogoutView = async (req,res)=>{
    res.clearCookie("accessToken");
    req.session.destroy((error)=>{
        res.redirect("/");
    });
}

//Controller GET vista Session
export const GETSessionView = (req,res)=>{
    res.send(req.session)
}

//Controller POST
export const POSTNone = async (req,res)=>{
    console.log(req.user);
    
}

//Controller GET vista Restore Password.
export const GETRestoreView = async (req,res)=>{
    res.render("restorePassword");
}

//Controller POST Restore Password
export const POSTRestorePassword = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await userManager.getUserByEmail(email)
        if (!user) res.render('restorePassword',{messageSend:"No user with that email address."})
        else{
            const id = user._id.toString();
            const restoreEmail = await transporter.sendMail({
                from: 'Support CoderApp <simeon60@ethereal.email>',
                to: `${user.username} <${user.email}>`,
                subject:'Reset Password',
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
                        <p><a href="http://localhost:8080/restore/${id}" class="button">Reset Password</a></p>
                        <p>If you did not request this password reset, you can safely ignore this message.</p>
                        <p>Thank you,<br>The Support Team</p>
                    </div>
                </body>
                </html>`
            })
            res.render('restorePassword',{messageSend:"An email has been sent with instructions. Please check your mailbox."})
        }
    } catch (error) {
        console.log(error)
    }
}

//Controller GET vista User reset password.
export const GETUserResetPasswordView = async (req,res)=>{
    try {
        const {userID} = req.params;
        const user = await userManager.getUserById(userID)
        res.render("restoreUserPassword", {user: user.email, id:user._id.toString()});
    } catch (error) {
        console.log(error)
    }
    
}

//Controller POST Update user password
export const POSTUserResetPassword = async (req, res)=>{
    try {
        const {password,confirmPassword,id} = req.body;
        const user = await userManager.getUserById(id);
        if (password != confirmPassword) return {error:true, message:"Passwords do not match"};
        else
        {
            const response = await userManager.updateUserPassword(id,password);
            if (response.error) {
                res.render("restoreUserPassword", {user: user.email, id:id, errorMessage: response.message});
            }
            else{
                res.render("restoreUserPassword", {user: user.email, id:id, message: response.message});
            }
        } 
    } catch (error) {
        console.log(error)
    }
}

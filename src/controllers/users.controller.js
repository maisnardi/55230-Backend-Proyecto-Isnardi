//Controller de API Users
//Importaciones
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";    //JWT
import transporter from "../utils/nodemailer.js";

//Instanciamos un nuevo productManager.
const userManager = new UserManager();

//Controller GET User
export const GETAllUsers = async (req,res)=>{
    try{
        const users = await userManager.getUsers();
        console.log(users); 
        res.status(200).send(users);    
    }catch(e){
        res.status(502).send({error:true});
    }
}

//Controller POST User
export const POSTUser = async (req,res)=>{
    try{
        const userData = req.body;
        const user = await userManager.addUser(userData);      
        user.payload ? res.status(200).send({created:user.message, user:user.payload}) : res.status(404).send({error:user.message})    
    }catch(e){
        res.status(502).send({error:true});
    }
}

//Controller POST Login User JWT
export const POSTUserLogin = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await userManager.validateLogin(email, password);
        if(!user.payload) {
            res.status(400).send({error:true, message: user.message})
        }else{
            const token = generateToken({sub:user.payload._id.toString(), user:{email:user.payload.email}})
            res.cookie('accessToken', token,{
                maxAge: (24*60*60)*1000,
                httpOnly:true,
            })
            res.status(200).send({error: false, accessToken: token})
        }
    } catch (error) {
        console.log(error)
    }
}
//Controller GET User JWT
export const GETUser = (req,res)=>{
    res.send({error:false, user:req.user});
}

//Controller GET User con Sessions
export const GETCurrentUser = (req, res)=>{
    try {
        if(!req.user) res.send("No user loged in");
        else{
            const filterData = userManager.filterData(req.user);
            res.send(filterData);
        }
    } catch (error) {
        console.log(error)
    }

}

//Controller PUT Role user
export const PUTUserRole = async (req,res)=>{
    try {
        const id = req.params.uid;
        const newRole = req.body.role
        if(id.length < 24)
        {
            res.status(404).send({error: true,message: "Id number to short"});
        }else{
            const response = await userManager.updateUserRole(id,newRole);
            // console.log(response)
            response.error ? res.status(response.code).send({error: true,message: response.message}) : res.status(200).send({error: false, message: response.message})
        }
    } catch (error) {
        console.log(error)
    }    
}

//Post user para /register
export const POSTNone = async (req,res)=>{
    console.log("entro")
    try {
        res.status(201).send({message: "success", payload: req.user._id})
    } catch (error) {
        console.log(error)
    }
}

export const POSTSignout = async (req, res)=>{
    try {
        const test=res.clearCookie('accessToken',{
            httpOnly:true,
        });
        req.session.destroy((error)=>{
            res.status(200).send({message: "User logged out"})
        });
    } catch (error) {
        res.status(404).send({message: "No user found"})
    }
}


//Controller POST Restore Password
export const POSTRestorePassword = async (req, res)=>{
    try {
        const {email} = req.body;
        const user = await userManager.getUserByEmail(email)
        if (!user) res.status(404).send({message:"User not found"})
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
            res.status(200).send({message:"Email sent!"})
        }
    } catch (error) {
        console.log(error)
    }
}

//Controller POST Update user password
export const POSTUserResetPassword = async (req, res)=>{
    try {
        const {password,confirmPassword,id} = req.body;
        const user = await userManager.getUserById(id);
        if (password != confirmPassword) res.status(400).send({error:true, message:"Passwords do not match"});
        else
        {
            const response = await userManager.updateUserPassword(id,password);
            if (response.error) {
                res.status(403).send({user: user.email, id:id, errorMessage: response.message});
            }
            else{
                res.status(200).send({user: user.email, id:id, message: response.message});
            }
        } 
    } catch (error) {
        console.log(error)
    }
}
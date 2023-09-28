//Controller de Users Views
//Importaciones
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";

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
        role: req.user.role
    }
    res.render("profile", {user:userData})
}

//Controller GET vista Logout.
export const GETLogoutView = async (req,res)=>{
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
    console.log(req.user)
    
}
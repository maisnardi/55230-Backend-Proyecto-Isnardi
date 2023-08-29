//Routes de los endpoints de las vistas de users

//Importaciones
import { Router } from "express";   //Router
import UserManager from "../dao/mongo/mongoUserManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";
import passport from "passport";

//Instanciamos un nuevo productManager.
const userManager = new UserManager();
//Instaciamos 
const userRouterViews = Router();

//Endpoints para express
//Endpoint GET para mostrar la vista de Login.
userRouterViews.get('/login', isLogged ,async (req,res)=>{
    try{
        const users = await userManager.getUsers();
        res.render('login')      
    }catch(e){
        res.status(502).send({error:true});
    }
})
//Endpoint POST para enviar los datos ingresado en la vista de Login. Con Passport.
userRouterViews.post("/login", passport.authenticate("login", {successRedirect:"/products",failureRedirect:"/login"}) ,async (req, res)=>{})

//Endoint GET de register para mostrar la vista del formulario de registro.
userRouterViews.get('/register', isLogged ,async (req,res)=>{
    res.render("register")
})

//Endoint POST de register para enviar los datos ingresado en la vista de registro.Con Passport.
userRouterViews.post('/register', passport.authenticate("register", {successRedirect: "/login", failureRedirect:"/register"}) , async (req,res)=>{})

//Endoint GET de profile para mostrar la vista del perfil del usuario.
userRouterViews.get('/profile', protectView ,async (req,res)=>{
    const userData = {
        first_name: req.user.first_name.trim().length>0? req.user.first_name : false,
        last_name: req.user.last_name.trim().length>0? req.user.last_name : false,
        age: req.user.age.trim().length>0? req.user.age : false,
        username: req.user.username.trim().length>0? req.user.username : false,
        email: req.user.email,
        role: req.user.role
    }
    res.render("profile", {user:userData})
})

//Endoint GET para cerrar la sesion del usuario.
userRouterViews.get('/logout', protectView ,async (req,res)=>{
    req.session.destroy((error)=>{
        res.redirect("/login");
    });
})

userRouterViews.get('/sessions', (req,res)=>{
    res.send(req.session)
})

export default userRouterViews;
//Routes de los endpoints de las vistas de users

//Importaciones
import { Router } from "express";   //Router
import UserManager from "../dao/mongo/mongoUserManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";

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
//Endpoint POST para enviar los datos ingresado en la vista de Login.
userRouterViews.post("/login", isLogged ,async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await userManager.validateLogin(email, password);
        if(!user.payload) return res.redirect("/login");
        else{
            delete user.payload.password;
            delete user.payload.salt;
            req.session.user = user.payload
            res.redirect("/products");  
        }
    } catch (error) {
        console.log(error)
    }
})

//Endoint GET de register para mostrar la vista del formulario de registro.
userRouterViews.get('/register', isLogged ,async (req,res)=>{
    res.render("register")
})

//Endoint POST de register para enviar los datos ingresado en la vista de registro.
userRouterViews.post('/register', isLogged ,async (req,res)=>{
    try {
        const user = req.body
        const response = await userManager.addUser(user);
        if(!response.payload)return res.redirect("/register")
        else res.redirect("/login");  
    } catch (error) {
        
    }  
})

//Endoint GET de profile para mostrar la vista del perfil del usuario.
userRouterViews.get('/profile', protectView ,async (req,res)=>{
    res.render("profile", {user:req.session.user})
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
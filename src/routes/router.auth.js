//Routes de los endpoints de la estrategia de github2

//Importaciones
import { Router } from "express";   //Router
import passport from "passport";

//Instaciamos 
const authRouter = Router();

//Redirecionador a github para inicio de sesion
authRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res)=>{});

//Callback
authRouter.get('/callback',passport.authenticate('github', {successRedirect:'/products',failureRedirect:'/login'}), (req, res)=>{});

export default authRouter;
//Routes de los endpoints de Users

//Importaciones
import { Router } from "express";   //Router
import UserManager from "../dao/mongo/mongoUserManager.js";
import {upload} from "../config/multer.js"

//Instanciamos un nuevo productManager.
const userManager = new UserManager();
//Instaciamos 
const userRouter = Router();

//Endpoints para express
//Endpoint GET 
userRouter.get('/', async (req,res)=>{
    try{
        const users = await userManager.getUsers();
        console.log(users)      
    }catch(e){
        res.status(502).send({error:true});
    }
})

userRouter.post('/', async (req,res)=>{
    try{
        const userData = req.body;
        console.log(userData)
        const users = await userManager.addUser(userData);
        console.log(users)
        users === true ? res.status(200).send({created:true}) : res.status(404).send({error:users})    
    }catch(e){
        res.status(502).send({error:true});
    }
})


export default userRouter;
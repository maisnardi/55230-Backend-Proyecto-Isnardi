//Controller de API Users
//Importaciones
import e from "express";
import UserManager from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";    //JWT

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
        const user = await userManager.addUser(userData);      //Revisar esta funcion no creo q tenga q estar aca
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
            res.send({error:true, message: user.message})
        }else{
            const token = generateToken({sub:user.payload._id.toString(), user:{email:user.payload.email}})
            res.cookie('accessToken', token,{
                maxAge: (24*60*60)*1000,
                httpOnly:true,
            })
            
            res.send({error: false, accessToken: token})
        }
    } catch (error) {
        console.log(error)
    }
}
//Controller GET User JWT
export const GETUser = (req,res)=>{
    res.send({error:false, user:req.user});
}
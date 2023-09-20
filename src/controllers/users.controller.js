//Controller de API Users
//Importaciones
import UserManager from "../services/user.service.js";

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
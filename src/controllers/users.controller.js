//Controller de API Users
//Importaciones
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
    try {
        res.status(201).send({message: "success", payload: req.user})
    } catch (error) {
        console.log(error)
    }
}
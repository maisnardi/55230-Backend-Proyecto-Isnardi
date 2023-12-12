//Importacion de modulos
import __dirname from "../dirname.js";
// import UserModel from "../../models/user.schema.js";
import crypto from "crypto";    //Importacion del módulo crypto, lo reemplazamos por bcrypt
import bcrypt from 'bcrypt';
import CurrentDTO from "../dto/current.dto.js";     //DTO Current

//import User from "../dao/mongo/users.mongo.dao.js"
import {UsersDAO} from "../dao/factory.js"


//Instaciamos la clase user
const UserDAO = new UsersDAO();

//Declaracion de clase UserManager
class UserManager{
    constructor(){}
    
    getUserById = async (id,next)=>{
        try {
            return await UserDAO.findById(id, next);    
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    getUserByEmail = async (email, next)=>{
        try {
            return await UserDAO.findByEmail(email, next);
        } catch (error) {
            error.from = "service";
            return next(error);
        }

    }

    addUser = async(user, next)=>{                              //utilizando bcrypt
        try {
            const dbUser = await UserDAO.findByEmail(user.email, next);
            if(dbUser)
            {
                return {message:"The entered user is already registered"};
            }else{
                user.salt = await bcrypt.genSalt(10)    //creo la llave para encriptar
                user.password = await bcrypt.hash(user.password, user.salt);   //encripto la clave ingresada por el usuario con la llave generada.
                if(user.email==="adminCoder@coder.com")
                {
                    user.role="admin";
                }
                const newUser = await UserDAO.insertUser(user, next);
                if(!newUser) return
                const storedUser = await UserDAO.findByEmail(user.email, next);
                return {payload:storedUser, message: "user created successfully"};
            }
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    getUsers = async(next)=>{
        try {
            let empty = [];
            const users = await UserDAO.findAllUsers(next);
            if(users){
                return users;
            }else{
                return empty;
            }
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

     validateLogin = async (email, password, next)=>{      //utilizando bcrypt
        try {
            const user = await UserDAO.findByEmail(email, next)
            if(!user){
                console.log("no existe el usuario")
                return {message:"plaese check email adress and password"};
            }
            const isEqual = await bcrypt.compare(password, user.password)
            if(isEqual)
            {
                return {payload:user,message:"Access granted"};
            }
            else{
                console.log("la clave esta mal")
                return {message:"plaese check email adress and password"}
            }
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    filterData = (user, next)=>{
        try {
            const data = new CurrentDTO(user,next);
            return data;
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    updateUserPassword = async (userID, newPassword, next)=>{
        try {
            const user = await UserDAO.findById(userID, next);    
            const isEqual = await bcrypt.compare(newPassword, user.password);       //comparo la clave ingresada con la almacenada.
            if(isEqual) {
                return {error:true , message:"The new password you entered is the same as your old password. Enter a different password!"}
            }else{
                const salt = await bcrypt.genSalt(10);    //creo la llave para encriptar
                const password = await bcrypt.hash(newPassword, salt);   //encripto la clave ingresada por el usuario con la llave generada.
                try {
                    await UserDAO.updateUser(userID, {salt:salt, password:password}, next);
                } catch (error) {
                    error.from = "service";
                    return next(error);
                }
                return {error: false , message: "Password changed!"}
            }
        } catch (error) {
            error.from = "service";
            return next(error);
        }
    }

    updateUserRole = async (userID, newRole, next)=>{
        try {
                if(newRole === "user" || newRole === "premium")
                {
                    const user = await UserDAO.findById(userID, next);
                    if(user){
                        if (user.role === "user"){
                            if(newRole==="user")return {error:true, code:400 ,message:"The user already has user privileges"}
                            else{
                                await UserDAO.updateUser(userID, {role:"premium"}, next)
                                return {error: false, code:200 ,message:"User role updated"}
                            }
                        }else if(user.role === "premium"){
                            if(newRole==="premium")return {error:true,code:304, message:"The user already has premium privileges"}
                            else{
                                await UserDAO.updateUser(userID, {role:"user"}, next)
                                return {error: false, code:200, message:"User role updated"}
                            }
                        }
                        else{
                            return {error:true, code:403 ,message: "No authorization, User is Admin"}
                        }
                    }else{
                        return {error:true, code:404 ,message: "No user found with that ID number"}
                    }
                    
                }
                else{
                    return {error:true , code:400 ,message: "Invalid user Role"}; 
                }
            } catch (error) {
                error.from = "service";
                return next(error);
        }
    }


}
export default UserManager;
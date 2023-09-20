//Importacion de modulos
import __dirname from "../dirname.js";
// import UserModel from "../../models/user.schema.js";
import crypto from "crypto";    //Importacion del módulo crypto, lo reemplazamos por bcrypt
import bcrypt from 'bcrypt';

import * as UserDAO from "../dao/mongo/users.mongo.dao.js"

//Declaracion de clase UserManager
class UserManager{
    constructor(){}
   
    getUserById = async (id)=>{
        //return await UserModel.findById(id)
        return await UserDAO.findById(id);
    }

    getUserByEmail = async (email)=>{
        //return await UserModel.find({email:email})
        return await UserDAO.findByEmail(email);
    }
    
    // addUser = async(user)=>{    //utilizando crypto
    //     try {
    //         const dbUser = await UserModel.findOne({email:user.email}).lean();
    //         if(dbUser)
    //         {
    //             return {message:"The entered user is already registered"};
    //         }else{
    //             user.salt = crypto.randomBytes(128).toString("base64");     //creo la llave para encriptar
    //             user.password =crypto.createHmac('sha256',user.salt).update(user.password).digest('hex');   //encripto la clave ingresada por el usuario con la llave generada.
    //             if(user.email==="adminCoder@coder.com")
    //             {
    //                user.role="admin";
    //             }
    //             const newUser = await UserModel.insertMany(user)
    //             return {payload:newUser, message: "user created successfully"};
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    addUser = async(user)=>{    //utilizando bcrypt
        try {
            //const dbUser = await UserModel.findOne({email:user.email}).lean();
            const dbUser = await UserDAO.findByEmail(user.email);
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
                //const newUser = await UserModel.insertMany(user);
                const newUser = await UserDAO.insertUser(user);
                console.log(newUser)
                //const storedUser = await UserModel.findOne({email:user.email}).lean();
                const storedUser = await UserDAO.findByEmail(user.email);
                console.log(storedUser)
                return {payload:storedUser, message: "user created successfully"};
            }
        } catch (error) {
            console.log(error);
        }
    }

    getUsers = async()=>{
        try {
            const users = await UserDAO.findAllUsers();
            return users;
        } catch (error) {
            return [];
        }
    }

    // validateLogin = async (email, password)=>{      //utilizando crypto
    //     try {
    //         const user = await UserModel.findOne({email});
    //         if(!user){
    //             console.log("no existe el usuario")
    //             return {message:"plaese check email adress and password"};
    //         }
    //         const decrytedPass =crypto.createHmac('sha256',user.salt).update(password).digest('hex');
    //         if(user.password === decrytedPass)
    //         {
    //             return {payload:user.toObject(),message:"Access granted"};
    //         }
    //         else{
    //             console.log("la clave esta mal")
    //             return {message:"plaese check email adress and password"}
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

     validateLogin = async (email, password)=>{      //utilizando bcrypt
        try {
            //const user = await UserModel.findOne({email}).lean();
            const user = await UserDAO.findByEmail(email)
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
            console.log(error)
        }
    }
}
export default UserManager;
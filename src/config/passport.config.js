//Importación de dependencias.
import passport from "passport";
import local from 'passport-local'
import GithubStrategy from 'passport-github2'

//Importación de managers.
import UserManager from "../dao/mongo/mongoUserManager.js";

//Instanciamos user.
const userManager = new UserManager()

const initLocalStrategy = ()=>{

//Estrategias
//Login
    passport.use('login', new local.Strategy({passReqToCallback:true, usernameField: 'email'}, async (req,email, password, done)=>{
        const response = await userManager.validateLogin(email, password);
        if(!response.payload)return done(null, false);
        else{
            return done(null, response.payload);
        }  
    }))

//Register
    passport.use('register', new local.Strategy({passReqToCallback:true, usernameField: 'email'}, async (req,email, password, done)=>{
        const user = req.body
        const response = await userManager.addUser(user);
        if(!response.payload)return done(null, false);
        else{
            return done(null, response.payload);
        }  
    }))

//GitHub
    passport.use('github', new GithubStrategy({
        clientID:'Iv1.b15411c31fe09348',
        clientSecret:'18669f3cf5f9430de24ec10a5b55469035049775',
        callbackURL:'http://localhost:8080/api/auth/callback',
    }, async (accessToken, refreshToken, profile, done)=>{
        const userEmail = profile._json.email;
        const user = await userManager.getUserByEmail(userEmail);
        if (user.length>0) return done(null, user[0])
        else{
            const newUser = await userManager.addUser({
                first_name: profile._json.name? profile._json.name.split(" ")[0] :" " ,
                last_name:profile._json.name? profile._json.name.split(" ")[1] :" ",
                email:userEmail,
                age:" ",
                password:" ",
                username:profile._json.login
            })            
            done(null, newUser.payload)
        } 
    } ))

//Serialización
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

//Desearialización
    passport.deserializeUser(async (id, done) => {
        try {
        const user = await userManager.getUserById(id);
        done(null, user);
        } catch (error) {
        done(null, false);
        }
    });
}

export default initLocalStrategy;
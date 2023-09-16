//Importacion del modulo de JWT
import jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";

//Key de JWT
export const SECRET= process.env.SECRET;

//Generamos el token
export const generateToken = (user)=>{
    console.log("entro a generateToken")
    console.log(user)
    const token = jwt.sign({user},SECRET,{expiresIn:"1hr"});
    return token;
}

//Middleware para validar JWT desde el header enviado por el cliente.
export const JWTMW = (req, res, next) =>{
    const authHeader = req.headers.autorization;
    if(!authHeader){
        return res.status(403).send({message: "No authorization"});
    }else{
        const token = authHeader.splite(" ")[1];
        try {
            const user = jwt.verify(token, SECRET);
            req.user=user.user;
            next();
        } catch (error) {
            return res.status(403).send({message: "No authorization"});
        }
    }
}

//Middleware para validar JWT desde COOKIES
export const JWTCookiesMW = (req, res, next)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.send({message: "No user loged in"})
    else{
        try {
            const cookieValid = jwt.verify(token, SECRET);
            next()
        } catch (error) {
            return res.send({error:true})
        }
    }
}
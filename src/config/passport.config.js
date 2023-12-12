//Importación de dependencias.
import passport from "passport";
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import jwt from "passport-jwt"
import { ENV } from "./config.js";
import cookieExtractor from "../utils/cookieJWT.js";

//Importación de managers.
import UserManager from "../services/user.service.js";
import CartManager from "../services/cart.service.js";

//Instanciamos user.
const userManager = new UserManager();
const cartManager = new CartManager();
const initLocalStrategy = () => {

    //Estrategias
    //Login
    passport.use('login', new local.Strategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
        const response = await userManager.validateLogin(email, password);
        if (!response.payload) return done(null, false);
        else {
            return done(null, response.payload);
        }
    }))

    //Register
    passport.use('register', new local.Strategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password,  done) => {
        const existUser = await userManager.getUserByEmail(email)
        if(!existUser)
        {
            const newCart = await cartManager.createCart(next);
            const user = { ...req.body, cartId: newCart }
            const response = await userManager.addUser(user, next);
            if (!response.payload) return done(null, false);
            else {
                return done(null, response.payload);
            }
        }
        else{
            return done(null, false)
        }
    }))

    //GitHub
    passport.use('github', new GithubStrategy({
        clientID: ENV.CLIENTID,
        clientSecret: ENV.CLIENTSECRET,
        callbackURL: 'http://localhost:8080/api/auth/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        const userEmail = profile._json.email;
        const user = await userManager.getUserByEmail(userEmail);
        if (user) return done(null, user)
        else {
            const newCart = await cartManager.createCart();
            const newUser = await userManager.addUser({
                first_name: profile._json.name ? profile._json.name.split(" ")[0] : " ",
                last_name: profile._json.name ? profile._json.name.split(" ")[1] : " ",
                email: userEmail,
                age: " ",
                password: " ",
                username: profile._json.login,
                cartId: newCart
            })
            done(null, newUser.payload)
        }
    }))

    //Passport JWT verifica la existencia de cookie y devuelve el usuario.
    const JWTStrategy = jwt.Strategy;
    passport.use("current", new JWTStrategy(
        {
            jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: ENV.SECRET,
        },
        async (payload, done) => {
            const user = await userManager.getUserById(payload.user.sub);
            if (!user) return done("Invalid credentials!");
            else {
                return done(null, user);
            }

        })
    );

    //Serialización
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

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
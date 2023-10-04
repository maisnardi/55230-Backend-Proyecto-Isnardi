//Importación de módulos.
import express  from "express";                 //Express.
import handlebars from 'express-handlebars'     //Motor de plantillas handlebars.
import { Server as HTTPServer} from "http";     //Para utilizar io dentro de routes.
import { Server as SocketIO } from "socket.io"; //socket.io.

import mongoose from "mongoose";                //Mongoose.
import cookieParser  from "cookie-parser";      //Cookies 
import session from "express-session";          //Sessions
import MongoStore from "connect-mongo";         //Mongo Store para guardar sessions data en mongo
import passport from "passport";                //Passport general

//Importación de routes.   
import productRouter from "./routers/routes.products.js";
import cartRouter from "./routers/routes.carts.js";
import productsViewsRouter from "./routers/routes.ProductsViews.js";
import chatRouter from "./routers/routes.chat.js";
import cartsViewRouter from "./routers/routes.CartView.js"
import userRouter from "./routers/routes.users.js";
import userRouterViews from "./routers/routes.usersViews.js";
import authRouter from "./routers/router.auth.js";
import ticketRouter from "./routers/routes.ticketView.js";
//Importación de configuraciones
import __dirname from "./dirname.js"            //Dirname


import initLocalStrategy from "./config/passport.config.js";    //Estrategias Passport local
import * as Commander from "./config/config.js";          //Process seleccion de puerto app

//Importación de Managers
import ChatManager from "./services/chat.service.js";

const chatManager = new ChatManager();

//Conexión con la base de datos externa, Atlas de mongoDB
const dbConnection = mongoose.connect(Commander.ENV.MONGO_URI)
dbConnection.then(()=>{console.log(`Conected to MongoDB database`)})

//Declaracion puerto servidor express.Viene desde Commander.
const PORT = Commander.ARGS.p;    //Default PORT = 8080;

//Inicializamos el servidor express.
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const httpServer = HTTPServer(app);
//Wrapper socketio
const io = new SocketIO(httpServer);

//Configuración de app con el middleware CoockieParser
app.use(cookieParser())

//Configuración de app con el middleware Sessions
app.use(session({
    secret:'secretCoderApp',
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({
        mongoUrl:Commander.ENV.MONGO_URI,
        ttl:3600,
    }),
}))


//Middleware de socket.io - para poder acceder a io dentro de las routes
app.use((req, res, next) => {
    req.io = io;
    next();
  });

//Configuración Passport Init
initLocalStrategy();
app.use(passport.initialize());
app.use(passport.session());

//Endpoints servidor express.
//Productos api.
app.use("/api/products",productRouter);
//Carts api.
app.use("/api/carts",cartRouter);
//Contenido static.
app.use("/public",express.static("public"));

//Motor de plantillas handlebars del servidor websocket.
app.engine('handlebars',handlebars.engine());   //seteamos el motor.
app.set('views',`${__dirname}/views`);          //le decimos donde estan las rutas de las vistas.
app.set('view engine', 'handlebars');           //espcificamos que motor de plantillas vamos a usar.

//Enpoints con handlebars, express y socket.io
app.use("/", productsViewsRouter);

//Endpoint del Chat.
app.use("/chat",chatRouter);

//Endpoint del Carts.
app.use("/carts",cartsViewRouter);

//Endpoints de Users api.
app.use("/api/",userRouter);

//Endpoint de UsersViews
app.use("/",userRouterViews);

//Endpoints de Passport-github2
app.use("/api/auth", authRouter);

//Endpoint de Ticket
app.use('/ticket', ticketRouter);

//Comunicaciones websocket
io.on('connection', socket=>{
    console.log(`Nuevo cliente conectado ID:${socket.id}`);
    socket.on("message", async (messageData)=>{
        console.log(`Mensage recibido desde el front${messageData.message}`)
        console.log(messageData)
        await chatManager.addMessages(messageData)
        console.log("Los datos fueron enviados a Atlas")
        socket.broadcast.emit("newMessage", messageData)
    })
})

//Inicializacion de express
httpServer.listen(PORT, ()=>{
    console.log(`Servidor express iniciado en el puerto ${PORT} `);
})


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
import productRouter from "./routes/routes.products.js";
import cartRouter from "./routes/routes.carts.js";
import productsViewsRouter from "./routes/routes.ProductsViews.js";
import chatRouter from "./routes/routes.chat.js";
import cartsViewRouter from "./routes/routes.cartView.js";
import userRouter from "./routes/routes.users.js";
import userRouterViews from "./routes/routes.usersViews.js";
import authRouter from "./routes/router.auth.js";

//Importación de configuraciones
import __dirname from "./dirname.js"            //Dirname
import initLocalStrategy from "./config/passport.config.js";    //Estrategias Passport local

//Importación de Managers
import ChatManager from "./dao/mongo/mongoChatManager.js";

const chatManager = new ChatManager();


//Conexión con la base de datos externa, Atlas de mongoDB
const dbConnection = mongoose.connect(`mongodb://usercoder:coder55230@ac-6o744vq-shard-00-00.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-01.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-02.9bmatez.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-55g89c-shard-0&authSource=admin&retryWrites=true&w=majority`)
dbConnection.then(()=>{console.log(`Conected to MongoDB database`)})

//Declaracion puerto servidor express.
const PORT = 8080;

//Inicializamos el servidor express.
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const httpServer = HTTPServer(app);
//Wrapper socketio
const io = new SocketIO(httpServer);

//Configuración de app con el middleware coockieParser
app.use(cookieParser())

//Configuración de app con el middleware Sessions
app.use(session({
    secret:'secretCoderApp',
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({
        mongoUrl:`mongodb://usercoder:coder55230@ac-6o744vq-shard-00-00.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-01.9bmatez.mongodb.net:27017,ac-6o744vq-shard-00-02.9bmatez.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-55g89c-shard-0&authSource=admin&retryWrites=true&w=majority`,
        //mongoUrl:'mongodb+srv://usercoder:coder55230@codercluster.9bmatez.mongodb.net/ecommerce?retryWrites=true&w=majority',
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


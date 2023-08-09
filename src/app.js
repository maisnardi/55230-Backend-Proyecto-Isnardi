//Importacion de módulos.
import express  from "express";     //Express.
import handlebars from 'express-handlebars'     //Motor de plantillas handlebars.
import { Server as HTTPServer} from "http";     //Para utilizar io dentro de routes.
import { Server as SocketIO } from "socket.io";     //socket.io.
import __dirname from "./dirname.js"
import mongoose from "mongoose";    //Mongoose.

//import de routes.   
import productRouter from "./routes/routes.ProductManager.js";
import cartRouter from "./routes/routes.CartManager.js";
import productsViewsRouter from "./routes/routes.ProductsViews.js";
import chatRouter from "./routes/routes.ChatManager.js";

import ChatManager from "./dao/mongo/mongoChatManager.js"
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

//Middleware de socket.io - para poder acceder a io dentro de las routes
app.use((req, res, next) => {
    req.io = io;
    next();
  });

//Endpoints servidor express.
//Productos.
app.use("/api/products",productRouter);
//Carts.
app.use("/api/carts",cartRouter);
//Contenido static.
app.use("/public",express.static("public"));

//Motor de plantillas handlebars del servidor websocket.
app.engine('handlebars',handlebars.engine());   //seteamos el motor.
app.set('views',`${__dirname}/views`);          //le decimos donde estan las rutas de las vistas.
app.set('view engine', 'handlebars');           //espcificamos que motor de plantillas vamos a usar.

//Enpoints con handlebars con express y socket.io
app.use("/", productsViewsRouter);

//Endpoint del Chat
app.use("/chat",chatRouter);

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


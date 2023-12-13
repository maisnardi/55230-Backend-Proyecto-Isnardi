//Importación de módulos.
import express from "express";                                  //Express.
import handlebars from 'express-handlebars'                     //Motor de plantillas handlebars.
import { Server as HTTPServer } from "http";                    //Para utilizar io dentro de routes.
import { Server as SocketIO } from "socket.io";                 //socket.io.
import cors from "cors";                                        //Cors.
import mongoose from "mongoose";                                //Mongoose.
import cookieParser from "cookie-parser";                       //Cookies 
import session from "express-session";                          //Sessions
import MongoStore from "connect-mongo";                         //Mongo Store para guardar sessions data en mongo
import passport from "passport";                                //Passport general
//import winston from "winston/lib/winston/config/index.js";      //Winston para loggers
import swaggerJSDoc from "swagger-jsdoc";                       //Swagger
import { serve, setup } from "swagger-ui-express"               //Swagger
import compression from "express-compression";                  //Compression
import cluster from "cluster";                                  //Cluster
import { GETLoggers } from "./controllers/loggers.controller.js";

//Importacion de Router principal (general)
import GeneralRauter from "./routers/general.router.js";
let router = new GeneralRauter();
router = router.getRouter();

//Importación de middleware Winston
import winstonHTTPMiddleware from "./utils/winstonHTTP.middleware.js";

//Importación de middleware de errores
import ErrorHandlerMiddleware from "./utils/error.middleware.js"

//Importación de middleware de not found
import NotFoundMiddleware from "./utils/notFound.middleware.js";

//Importación de configuraciones
import __dirname from "./dirname.js"            //Dirname

import initLocalStrategy from "./config/passport.config.js";    //Estrategias Passport local
import * as Commander from "./config/config.js";                //Process seleccion de puerto app
import options from "./config/swagger.js";                      //Configuraciones de Swagger

//Importación de Managers
import ChatManager from "./services/chat.service.js";

const chatManager = new ChatManager();

//Configuración del modulo de swagger
const specs = swaggerJSDoc(options)

//Conexión con la base de datos externa, Atlas de mongoDB
const dbConnection = mongoose.connect(Commander.ENV.MONGO_URI)
dbConnection.then(() => { console.log(`Conected to MongoDB database`) })

//Declaracion puerto servidor express.Viene desde Commander.
const PORT = Commander.ARGS.p;    //Default PORT = 8080;

//Inicializamos el servidor express.
const app = express();
app.use(cors());                                        //para utilizar cors
app.use(express.urlencoded({ extended: true }));        //para leer query y params
app.use(express.json());                                //para leer body(json)

//Compression con brotli
app.use(compression({ brotoli: { enabled: true, zlib: {} } }));

//Implementación de Swagger
app.use('/api/docs', serve, setup(specs))



const httpServer = HTTPServer(app);
//Wrapper socketio
const io = new SocketIO(httpServer);

//Configuración de app con el middleware CoockieParser
app.use(cookieParser())

//Configuración de app con el middleware Sessions
app.use(session({
    secret: 'secretCoderApp',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: Commander.ENV.MONGO_URI,
        ttl: 3600,
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
//Implementacion del enrutador principal (general)
app.use('/', router);

//Contenido static.
app.use("/public", express.static("public"));

//Motor de plantillas handlebars del servidor websocket.
app.engine('handlebars', handlebars.engine());   //seteamos el motor.
app.set('views', `${__dirname}/views`);          //le decimos donde estan las rutas de las vistas.
app.set('view engine', 'handlebars');           //espcificamos que motor de plantillas vamos a usar.

//Comunicaciones websocket
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ID:${socket.id}`);
    socket.on("message", async (messageData) => {
        await chatManager.addMessages(messageData)
        console.log("Los datos fueron enviados a Atlas")
        socket.broadcast.emit("newMessage", messageData)
    })
})
//Contenido estatico
app.use('/public', express.static(__dirname + '/public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

//Middleware de Winstone
app.use(winstonHTTPMiddleware);

//Middleware para pagina no encontrada
app.use(NotFoundMiddleware);

//Middleware de manejo de errores
app.use(ErrorHandlerMiddleware);

//Habilitacion de cluster
if (cluster.isPrimary) {
    for (let i = 0; i < 4; i++) {
        cluster.fork();
    }
}
else {
    console.log(`Worker PID: ${process.pid}`);
    //Inicializacion de express
    httpServer.listen(PORT, () => {
        console.log(`Servidor express iniciado en el puerto ${PORT} `);
    })
}





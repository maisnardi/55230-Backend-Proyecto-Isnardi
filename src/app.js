//Importacion de modulos
import express  from "express";     //Express
import productRouter from "./routes/routes.ProductManager.js";
import cartRouter from "./routes/routes.CartManager.js";

//Declaracion puerto servidor express
const PORT = 8080;

//Inicializamos el servidor express
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Endpoints
//Productos
app.use("/api/products",productRouter);
//Carts
app.use("/api/carts",cartRouter);
//Contenido static
app.use(express.static("public"));

//Pongo a escuchar al servidor
app.listen(PORT, ()=>{
    console.log(`Servidor express iniciado en el puerto ${PORT} `)
})
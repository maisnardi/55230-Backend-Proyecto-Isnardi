//Importacion de modulos
import express  from "express";     //Express
import ProductManager from "./ProductManager.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Declaracion puerto servidor express
const PORT = 8080;

//Inicializamos el servidor express
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Endpoints
//Endpoint con req.query
app.get('/products', async (req,res)=>{
    const {limit} = req.query;
    try{
        const products = await productManager.getProducts();
        limit? res.status(200).send(products.slice(0,limit)) : res.status(200).send(products);        
    }catch(e){
        res.status(502).send({error:true});
    }
})
//Endpoint con req.params
app.get('/products/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await productManager.getProductById(Number(id));    //otra opción await productManager.getProductById(+(id))
        typeof(product) === "string" ? res.status(404).send(product) : res.status(200).send(product);
    } catch(e){
        res.status(502).send({error:true});
    }
})

//Pongo a escuchar al servidor
app.listen(PORT, ()=>{
    console.log(`Servidor express iniciado en el puerto ${PORT} `)
})
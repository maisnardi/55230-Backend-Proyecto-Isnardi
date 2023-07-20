//Routes de los endpoints de Productos

//Importaciones
import { Router } from "express";   //Router
import ProductManager from "../ProductManager.js";
import {upload} from "../config/multer.js"

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
//Instaciamos 
const productRouter = Router();

//Endpoints para express
//Endpoint GET con req.query
productRouter.get('/', async (req,res)=>{
    const {limit} = req.query;
    try{
        const products = await productManager.getProducts();
        limit? res.send(products.slice(0,limit)) : res.send(products);        
    }catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint GET con req.params
productRouter.get('/:pid', async (req,res)=>{
    try {
        const {pid} = req.params;
        console.log(pid)
        const product = await productManager.getProductById(Number(pid));    //otra opción await productManager.getProductById(+(id))
        typeof(product) === "string" ? res.status(404).send(product) : res.status(200).send(product);
    } catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint POST con req.body
productRouter.post("/", upload.array('photo'),async (req,res)=>{
    try {
        const photos=[];
        let body;
        if(req.files)
        {
            req.files.forEach((element)=>{
            photos.push(element.destination+"/"+element.filename)
        })
            body={
                ...req.body,
                thumbnails: photos
            }
        }
        else{
            body={...req.body,
                thumbnails:[req.body.thumbnails]
            };
        }
        const response = await productManager.addProduct(body);
        res.status(response[0].code).send(response[1]);
        
        //Emit de datos socket.io       
        const products = await productManager.getProducts();
        req.io.emit("products", products);
    } catch (error) {
        res.status(502).send({error:"true"});
    }
})

//Endpoint PUT
productRouter.put('/:pid', upload.array('photo'),async (req,res)=>{
    try {
        const photos =[];
        const {pid} = req.params;
        console.log(req.files)
        if(req.files)
        {
            req.files.forEach((element)=>{
                photos.push(element.destination+"/"+element.filename)
            })
         }
        const body ={
            ...req.body,
            thumbnails: photos
        }
        const response = await productManager.updateProduct(Number(pid),body);
        response === "updated" ? res.status(200).send({update:true}) : res.status(404).send({error:"ID not found"})
        
        //Emit de datos socket.io     
        const products = await productManager.getProducts();
        req.io.emit("products", products);
    } catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint DELETE
productRouter.delete('/:pid', async (req,res)=>{
    try {
        const {pid} = req.params;
        console.log()
        await productManager.deleteProduct(Number(pid));
        res.status(200).send({deleted:true});

        //Emit de datos socket.io     
        const products = await productManager.getProducts();
        req.io.emit("products", products);
    } catch (error) {
        res.status(502).send({error:true});
    }
})

export default productRouter;
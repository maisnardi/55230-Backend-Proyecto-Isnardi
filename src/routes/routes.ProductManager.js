//Routes de los endpoints de Productos

//Importaciones
import { Router } from "express";   //Router
import ProductManager from "../ProductManager.js";
import {upload} from "../config/multer.js"

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
//Instaciamos 
const productRouter = Router();

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
    const photos=[];
    try {
        if(req.files)
        {
            req.files.forEach((element)=>{
            photos.push(element.path)
            })
         }
        const body ={
            ...req.body,
            thumbnails: photos
        }
        const response = await productManager.addProduct(body);
        switch (response) {
            case "OK":
                res.status(200).send({posted:"True."})
                break;
            case "cargado":
                res.status(400)
                res.send({error:"The product is already loaded."})
                break;
            case "incompleto":
                res.status(400).send({error: "Incomplete fields, please check them."});
                break;
            default:
                res.status(404).send({error: "File saving error"})
                break;
        }
    } catch (error) {
        res.status(502).send({error:true});
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
            photos.push(element.path)
            })
         }
        const body ={
            ...req.body,
            thumbnails: photos
        }
        const response = await productManager.updateProduct(Number(pid),body);
        response === "updated" ? res.status(200).send({update:true}) : res.status(404).send({error:"ID not found"})
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
    } catch (error) {
        res.status(502).send({error:true});
    }
})


export default productRouter;
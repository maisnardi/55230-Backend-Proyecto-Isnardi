//Routes de los endpoints de Productos

//Importaciones
import { Router } from "express";   //Router
import ProductManager from "../dao/mongo/mongoProductManager.js";
import {upload} from "../config/multer.js"

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
//Instaciamos 
const productRouter = Router();

//Endpoints para express
//Endpoint GET con req.query
productRouter.get('/', async (req,res)=>{
    const {limit=10, page=1 , sort, category, stock} = req.query;
    try{
        const products = await productManager.getProductsQuery(limit, page, sort,category, stock);               //Para uso con mongoProductManager
        //limit? res.send(products.slice(0,limit)) : res.send(products);        //Para uso con ProductManager (FS)
        res.send(products);        
    }catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint GET con req.params
productRouter.get('/:pid', async (req,res)=>{
    try {
        const {pid} = req.params;
        const product = await productManager.getProductById(pid);    //ahora necesito que pid sea un string
        typeof(product) === "string" ? res.status(404).send(product) : res.status(200).send(product);
    } catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint POST con req.body
productRouter.post("/", upload.array('photo'),async (req,res)=>{
    try {
        const photos=[];
        if(req.files.length>0)
        {
            req.files.forEach((element)=>{
                photos.push(element.filename)
                //photos.push(element.destination+"/"+element.filename)
            })
        }
        if(req.body.thumbnails)
            if(Array.isArray(req.body.thumbnails)){
                req.body.thumbnails.forEach((element)=>{
                    photos.push(element) 
                });
            }
            else{
                photos.push(req.body.thumbnails)
            }     
        const body={...req.body,
            thumbnails:photos 
        };
        
        const response = await productManager.addProduct(body);
        res.status(response[0].code).send(response[1]);
        
        //Emit de datos socket.io       
        if(response[1].posted){
            req.io.emit("newProduct", body, response[2].id);
        }
        
    } catch (error) {
        res.status(502).send({error:"true"});
    }
})

//Endpoint PUT
productRouter.put('/:pid', upload.array('photo'),async (req,res)=>{
    try {
        const photos =[];
        const {pid} = req.params;
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
        const response = await productManager.updateProduct(pid,body);
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
        const response = await productManager.deleteProduct(pid);
        res.status(response[0].code).send(response[1]);

        //Emit de datos socket.io
        if (!response[1].error){
            req.io.emit("delete", pid);
        }
    } catch (error) {
        res.status(502).send({error:true});
    }
})


export default productRouter;
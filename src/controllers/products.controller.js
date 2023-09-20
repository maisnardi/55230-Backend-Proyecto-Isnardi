//Controller de API Products
//Importaciones
import ProductManager from "../services/products.service.js";
import {upload} from "../config/multer.js"

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products with filters
export const GETProductsFilter = async (req,res)=>{
    const {limit=10, page=1 , sort, category, stock} = req.query;
    try{
        const products = await productManager.getProductsQuery(limit, page, sort,category, stock);               //Para uso con mongoProductManager
        //limit? res.send(products.slice(0,limit)) : res.send(products);        //Para uso con ProductManager (FS)
        res.send(products);        
    }catch(e){
        res.status(502).send({error:true});
    }
}

//Controller GET Product by ID
export const GETProductById = async (req,res)=>{
    try {
        const {pid} = req.params;
        const product = await productManager.getProductById(pid);    //ahora necesito que pid sea un string
        typeof(product) === "string" ? res.status(404).send(product) : res.status(200).send(product);
    } catch(e){
        res.status(502).send({error:true});
    }
}

//Controller POST Product
export const POSTProduct = async (req,res)=>{
    try {
        const photos=[];
        if(req.files.length>0)
        {
            req.files.forEach((element)=>{
                photos.push(element.filename)
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
}

//Controller PUT Update product
export const PUTUpdateProductsById = async (req,res)=>{
    try {
        const photos =[];
        const {pid} = req.params;
        if(req.files)
        {
            req.files.forEach((element)=>{
            photos.push(element.filename)
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
}

//Controller DELETE Product
export const DELETEProductById = async (req,res)=>{
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
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo');
//Routes de los endpoints de views de handlebars

//Importaciones
import { Router } from "express";   //Router
import ProductManager from "../ProductManager.js";
import { upload } from "../config/multer.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
//Instaciamos 
const productsViewsRouter = Router();

//Endpoint GET para mostrar productos en la view home de handlebars 
productsViewsRouter.get("/home", async (req,res)=>{
    try{
        const products = await productManager.getProducts();
        res.render("home",{products:products});    
    }catch(e){
        res.status(502).send({error:true});
    }
})
 
//Endpoint POST con req.body para agregar productos desde el form de localhost:8080/
productsViewsRouter.post("/", upload.array('photo'),async (req,res)=>{
    try {
        const photos=[];
        if(req.files.length>0)
        {
            req.files.forEach((element)=>{
            photos.push(element.destination+"/"+element.filename)
        })
        }
        if(req.body.thumbnails.length>0){
            photos.push(req.body.thumbnails)  
        }
        const body={...req.body,
            thumbnails:photos
        };
        const response = await productManager.addProduct(body);

        //Emit de datos socket.io       
        const products = await productManager.getProducts();
        req.io.emit("products", products);
        res.redirect("/home");
    } catch (error) {
        res.status(502).send({error:true});
    }
})

productsViewsRouter.get("/realtimeproducts", async (req, res, next)=>{
    try{
        const products = await productManager.getProducts();
        res.render("realtimeproducts")
        req.io.on('connection', socket=>{
            req.io.emit("products", products)
        })
    }catch(e){
        res.status(502).send({error:true});
    }
})

export default productsViewsRouter;
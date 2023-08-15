//Routes de los endpoints de views de handlebars

//Importaciones
import { Router } from "express";   //Router
import ProductManager from "../dao/mongo/mongoProductManager.js";
import { upload } from "../config/multer.js";
import productRouter from "./routes.ProductManager.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");
//Instaciamos 
const productsViewsRouter = Router();

//Endpoint GET para mostrar productos en la view home de handlebars 
productsViewsRouter.get("/home", async (req,res)=>{
    try{
        await productManager.getProducts().then(products => {
            const productsObj = products.map(product => product.toObject())
            res.render("home", {products: productsObj})
        });
        // res.render("home",{products:products});    
    }catch(e){
        res.status(502).send({error:true});
    }
})
 
//Endpoint POST con req.body para agregar productos desde el form de http://localhost:8080/
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
        console.log(typeof(products))
        req.io.emit("products", products);
        res.redirect("/home");
    } catch (error) {
        res.status(502).send({error:true});
    }
})
//Endpoint GET para visualizar todos los prodcutos en tiempo real en la vista http://localhost:8080/realtimeproducts
productsViewsRouter.get("/realtimeproducts", async (req, res, next)=>{
    try{
        res.render("realTimeProducts")
        const products = await productManager.getProducts();
        req.io.on('connection', socket=>{
            req.io.emit("products", products)
        })
        console.log("se enviaron los productos")
    }catch(e){
        res.status(502).send({error:true});
    }
})

//Endpoint GET con la vista http://localhost:8080/products  
productsViewsRouter.get("/products", async (req, res)=>{
    const {limit=10, page=1 , sort, category, stock} = req.query;
    try{
        const products = await productManager.getProductsQuery(limit, page, sort,category, stock)
        console.log(products)
        const ObjProducts = products.payload.map((product => product.toObject()))
        res.render("products", {nlink:products.nextLink,plink:products.prevLink, page:products.page, products:ObjProducts})                  
    }catch(e){
        res.status(502).send({error:true});
    }
})
//Endpoint GET con la vista http://localhost:8080/product/:cid  
productsViewsRouter.get("/product/:cid", async (req, res)=>{
    try {
        const {cid} = req.params;
        const product = await productManager.getProductById(cid)
        const jsonProduct = product.toJSON()  
        console.log(jsonProduct)     
        res.render("product", {product:jsonProduct})
    } catch (error) {
        res.status(502).send({error:true});
    }
})

export default productsViewsRouter;
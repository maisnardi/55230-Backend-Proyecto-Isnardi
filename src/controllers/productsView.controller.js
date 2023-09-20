//Controller de Products view
//Importaciones
import ProductManager from "../services/products.service.js";
import { upload } from "../config/multer.js";       //Multer

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products in Home View
export const GETProductsInHomeView = async (req,res)=>{
    try{
        await productManager.getProducts().then(products => {
            const productsObj = products.map(product => product.toObject())
            res.render("home", {products: productsObj})
        });
        // res.render("home",{products:products});    
    }catch(e){
        res.status(502).send({error:true});
    }
}

//Controller POST Products from Home View with socket.io
export const POSTProductsLive = async (req,res)=>{
    try {
        const photos=[];
        if(req.files.length>0)
        {
            req.files.forEach((element)=>{
            photos.push(element.filename)
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
}

//Controller GET Realtimeproducts
export const GETRealTimeProducts = async (req, res, next)=>{
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
}

//Controller GET AllProducts View
export const GETAllProductsView = async (req, res)=>{
    const {limit=10, page=1 , sort, category, stock} = req.query;
    try{
        const products = await productManager.getProductsQuery(limit, page, sort,category, stock);
        const ObjProducts = products.payload.map((product => product.toObject()));
        const user = req.user;
        const dataToRender = {
            nlink:products.nextLink,
            plink:products.prevLink? products.prevLink:false,
            page:products.page, 
            products:ObjProducts,
            user: user.first_name.trim().length>0   ? user.first_name +" "+user.last_name : user.username,
        }
        console.log()
        res.render("products", dataToRender)                  
    }catch(e){
        res.status(502).send({error:true});
    }
}

//Controller GET Product by ID
export const GETProductByIdView = async (req, res)=>{
    try {
        const {cid} = req.params;
        const product = await productManager.getProductById(cid)
        const jsonProduct = product.toJSON()       
        res.render("product", {product:jsonProduct})
    } catch (error) {
        res.status(502).send({error:true});
    }
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo');
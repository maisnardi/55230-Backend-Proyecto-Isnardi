//Controller de Products view
//Importaciones
import ProductManager from "../services/products.service.js";
import { upload } from "../config/multer.js";       //Multer

//Imports de creación de errores
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const productManager = new ProductManager("products");

//Controller GET Products in new View
export const GETProductsInNewView = async (req, res, next) => {
    try {
        let products = {};
        await productManager.getProducts(next).then(products => {
            const productsObj = products.map(product => product.toObject())
            if (req.user.role === 'premium') {
                productsObj.forEach(element => {
                    if (element.owner != "admin") {
                        if (element.owner.toString() === req.user._id.toString()) element.render = true;
                    }
                })
                products ={
                    products: productsObj,
                    filter: true,
                    display:req.display
                }
                res.render("new", products)
            }
            else {
                productsObj.forEach(element => { element.render = true })
                products ={
                    products: productsObj,
                    display:req.display
                }
                res.render("new", products)
            }
        });   
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

// //Controller GET Realtimeproducts
// export const GETRealTimeProducts = async (req, res, next) => {
//     try {
//         res.render("realTimeProducts")
//         const products = await productManager.getProducts(next);
//         if(!products) return new CustomError(errorsDictionary.notFound)
//         req.io.on('connection', socket => {
//             req.io.emit("products", products)
//         })
//         console.log("se enviaron los productos")
//     } catch (error) {
//         error.from = "controller";
//         return next(error);
//     }
// }

//Controller GET AllProducts View
export const GETAllProductsView = async (req, res, next) => {
    const { limit = 12, page = 1, sort, category, stock } = req.query;
    try {
        let dataToRender = {};
        const products = await productManager.getProductsQuery(limit, page, sort, category, stock, next);
        if(!products) return CustomError.new(errorsDictionary.notFound)
        const ObjProducts = products.payload.map((product => product.toObject()));
        if(req.user){
            const user = req.user;
            dataToRender = {
                nlink: products.nextLink,
                plink: products.prevLink ? products.prevLink : false,
                page: products.page,
                products: ObjProducts,
                user:user.username.length>1? user.username : user.first_name.trim().length > 0 ? user.first_name + " " + user.last_name : user.username,
                display:req.display,
            }
        }
        else{
            dataToRender = {
                nlink: products.nextLink,
                plink: products.prevLink ? products.prevLink : false,
                page: products.page,
                products: ObjProducts,
                display:req.display,
            }
        } 
        
        res.render("products", dataToRender)
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET Product by ID
export const GETProductByIdView = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid,next);
        if(!product) return CustomError.new(errorsDictionary.notFoundOne)
        const jsonProduct = product.toJSON();
        if(req.user){
            if(req.user.role === "premium"){
                if(jsonProduct.owner.toString() === req.user._id.toString()){
                    req.display.buy = false;
                    req.display.premium = true;
                }else{
                    req.display.buy= true;
                } 
            }
        }
        const displaydata = {
            product: jsonProduct,
            cid: req.user? req.user.cartId.toString() : false,
            display: req.display
        }
        res.render("product", displaydata)
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET Product by ID new
export const GETProductByIdViewUpdate = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid, next)
        if(!product) return CustomError.new(errorsDictionary.notFound)
        const jsonProduct = product.toJSON();
        res.render("updateProduct", jsonProduct)
        
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller Multer Middleware
export const MDWMulter = upload.array('photo');

//Controller GET vista Index.
export const GETIndex = async (req, res, next) => {
    try {
        const limit = 4
        const products = await productManager.getProductsQuery( limit, next);
        const dataToRender = {
            products: products.payload.map(product => product.toObject()),
            display:req.display,
        }
        res.render("index", dataToRender);
    } catch (error) {
        error.from = "controller";
        return next(error);
    }
}

//Controller GET Product by owner
export const GETProductByOwner = async (req, res, next) => {
    try {
        let products;
        if (req.user){
            if(req.user.role ==="admin"){
                await productManager.getProducts(next).then(produ => {
                    products = produ.map(product => product.toObject())
                })
            }else if(req.user.role ==="premium"){
                const owner = req.user._id.toString();
                console.log(owner)
                products = await productManager.getProductsByOwner(owner, next);
            }
            const render = {
                products: products,
                display: req.display,
            }
            res.render('updateProduct', render);
        }
        else{
            return CustomError.new(errorsDictionary.unauthorized)
        }
    } catch (error) {
        error.from = "controller";
        return next(error);
    }

    
}
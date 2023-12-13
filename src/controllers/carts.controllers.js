//Controller de API Carts
//Importaciones
import CartManager from "../services/cart.service.js";;
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller POST create new cart.
export const POSTCreateNewCart = async (req, res, next) => {
    try {
        //const cart = await cartManager.createCart(next)
        if (cart){
            cart.length != 0 ? res.status(201).send(cart) : CustomError.new(errorsDictionary.notCreated);
        }else{
            return CustomError.new(errorsDictionary.internalError);
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller GET req.params returns cart by id.
export const GETCartById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const data = await cartManager.getCartProductsById(cid, next);
        if (data) {
            return res.status(200).send(data)
        }else{
            return CustomError.new(errorsDictionary.idNotFound);
        }  
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller GET req.params returns cart by id.
export const GETCart = async (req, res, next) => {
    try { 
        let user = req.user;
        let cid = user.cartId.toString();
        const data = await cartManager.getCartProductsById(cid, next);
        if (data) {
            return res.status(200).send(data)
        }
        else{
            return CustomError.new(errorsDictionary.idNotFound);
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller POST req.params Add product to cart.
export const POSTAddProductToCartId = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const response = await cartManager.addProductToCart(cid, pid,next);
        if(response.message == "updated") {
            res.status(200).send({ updated: true });
        }
        else{
            res.status(404).send({ error: response.message });
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller DELETE req.params delete product from cart by id.
export const DELETEProductById = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartManager.deleteProduct(cid, pid, next) 
        if(result){
            console.log("result:",result)
            if(result.message == "deleted"){
                return res.status(200).send({ deleted: true })
            } 
            else {res.status(404).send({ error: result.message });}
        }else{
            return CustomError.new(errorsDictionary.notFound);
        }
    } catch (error) {
        error.from = "controller";
        next(error);
    }
}

//Controller DELETE req.params delete product from logged user cart by id.
export const DELETEUsersProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        let user = req.user;
        let cid = user.cartId.toString();
        const response = await cartManager.deleteProduct(cid, pid, next);
        if(response){
            if(response.message == "deleted")
            {
                res.status(200).send({ deleted: true })
            } else{
                res.status(404).send({ error: response.message });
            }
        }else{
            return CustomError.new(errorsDictionary.internalError);
        }
    } catch (error) {
        error.from = "controller";
        next(error);
    }
}

//Controller PUT update cart con req.boy y req.params
export const PUTUpdateProductById = async(req, res, next)=>{
    try {
        const cid = req.user.cartId.toString();
        const {pid} = req.params;
        const response = await cartManager.addProductToCart(cid, pid,next);
        if(response){
            if(response.message == "updated") {
                res.status(200).send({ updated: true });
            }
            else{
                res.status(404).send({ error: response.message });
            }
        }else{
            return CustomError.new(errorsDictionary.internalError);
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller PUT req.params and req.body Replace cart content by ID.
export const PUTUpadateFullCartbyId = async (req, res,next) => {
    try {
        const { cid } = req.params;
        const body = req.body;
        const result = await cartManager.updateCartArray(cid, body,next)
        if (result){
            if(result.message == "updated") {
                return res.status(200).send({ updated: true });
            }else{
                return res.status(404).send({ error: result })
            }
        }else{
            return CustomError.new(errorsDictionary.notFound);
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Controller PUT req.params increment product quantity
export const PUTIncrementQuantityById = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const body = req.body;
        const result = await cartManager.updateCartQuantity(cid, pid, body, next);
        if(result){
            if(result.message == "updated") {
                return res.status(200).send({ updated: true });
            }else{
                return res.status(404).send({ error: result })
            }
        }
        else{
            return CustomError.new(errorsDictionary.notFound);
        }
    } catch (error) {
        error.from = "controller";
        next(error);
    }
}

//Controller DELETE erase all products from cart
export const DELETEDeleteProductsById = async (req, res, next) => {
    try {
        const cid = req.user.cartId
        const result = await cartManager.deleteCartProducts(cid, next)
        if (result){
            result == true ? res.status(200).send({ delete: true }) : res.status(404).send({ error: result });
        }
        else{
            return CustomError.new(errorsDictionary.notFound);
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}

//Routes de los endpoints views de Carts

//Importaciones
import { Router } from "express";   //Router
import CartManager from "../dao/mongo/mongoCartManager.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");
//Instaciamos 
const cartsViewRouter = Router();


//Endpoint GET req.params
cartsViewRouter.get('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params;
        const data =await cartManager.getCartProductsById(cid);
        const dataObj = data.map(product => product.toObject())
        res.render("carts" , {products:dataObj,cart:cid})
    } catch (error) {
        console.log(error)
    }
})

export default cartsViewRouter;
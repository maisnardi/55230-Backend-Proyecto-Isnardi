//Routes de los endpoints de Carts

//Importaciones
import { Router } from "express";   //Router
import CartManager from "../CartManager.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");
//Instaciamos 
const cartRouter = Router();

//Endpoint POST
cartRouter.post("/", async (req, res)=> {
    try {
        const cart = await cartManager.createCart()
        cart =!false ? res.status(200).send(cart) : res.status(404).send({error: "Cart ID not foud"});
    } catch (error) {
        res.status(502).send({error:true});
    }
})

//Endpoint GET req.params
cartRouter.get('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params;
        const data =await cartManager.getCartProductsById(Number(cid));
        data? res.status(200).send(data) : res.status(404).send({error:'That cart ID does not exist'});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

//Endpoint POST con req.params
cartRouter.use("/:cid/product/:pid", async (req, res)=>{
    try {
        const {cid,pid} = req.params;
        (await cartManager.addProductToCart(Number(cid),Number(pid)))==true ? res.status(200).send({updated:true}) : res.status(404).send({error:"Cart not foud"});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

export default cartRouter;
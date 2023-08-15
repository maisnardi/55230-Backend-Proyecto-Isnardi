//Routes de los endpoints de Carts

//Importaciones
import { Router } from "express";   //Router
import CartManager from "../dao/mongo/mongoCartManager.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");
//Instaciamos 
const cartRouter = Router();

//Endpoint POST - Crea un nuevo carrito.
cartRouter.post("/", async (req, res)=> {
    try {
        const cart = await cartManager.createCart()
        cart =!false ? res.status(200).send(cart) : res.status(404).send({error: "Cart not created"});
        //res.status(200).send(cart)
    } catch (error) {
        res.status(502).send({error:true});
    }
})

//Endpoint GET req.params - Devuelve el carrito del ID recibido.
cartRouter.get('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params;
        const data =await cartManager.getCartProductsById(cid);
        data? res.status(200).send(data) : res.status(404).send({error:'That cart ID does not exist'});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

//Endpoint POST con req.params - Agrega un producto a un carrito.
cartRouter.post("/:cid/product/:pid", async (req, res)=>{
    try {
        const {cid,pid} = req.params;
        (await cartManager.addProductToCart(cid,pid))==true ? res.status(200).send({updated:true}) : res.status(404).send({error:"Cart not foud"});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

//Endpoint DELETE con req.params - Elimina del carrito un producto seleccionado.
cartRouter.delete("/:cid/product/:pid", async (req, res)=>{
    try {
       const {cid,pid} = req.params;
       await cartManager.deleteProduct(cid, pid) == true? res.status(200).send({deleted:true}) : res.status(404).send({error:"Cart o Product not foud"});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

//Endpoint PUT con req.params y req.body - Reemplazar por completo un array de productos.
cartRouter.put("/:cid", async (req, res)=>{
    try {
        const {cid} = req.params;
        const body = req.body;
        const result = await cartManager.updateCartArray(cid,body) 
        result == true? res.status(200).send({updated:true}) : res.status(404).send({error:result});
    } catch (error) {
        res.status(404).send({error:true});
    }
})

//Endpoint PUT con req.params - Aumenta el valor de quantity de un producto de un carrito.
cartRouter.put("/:cid/products/:pid", async(req, res)=>{
    try {
        const {cid,pid} = req.params;
        const body = req.body;
        const result = await cartManager.updateCartQuantity(cid,pid, body);
        result == true? res.status(200).send({updated:true}) : res.status(404).send({error:result});
    } catch (error) {
        res.status(404).send({error:true});
    }
})  

//Endpoint DELETE con req.params - Eleminina todos los productos de un carrito.
cartRouter.delete("/:cid", async (req, res)=>{
    try {
        const {cid} = req.params;
        const result = await cartManager.deleteCartProducts(cid)
        result == true? res.status(200).send({delete:true}) : res.status(404).send({error:result});
    } catch (error) {
        console.log(error)
    }
})

export default cartRouter;
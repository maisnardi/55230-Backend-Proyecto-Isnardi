//Controller de API Carts
//Importaciones
import CartManager from "../services/cart.service.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller POST create new cart.
export const POSTCreateNewCart = async (req, res)=> {
    try {
        const cart = await cartManager.createCart()
        cart.length !=0 ? res.status(200).send(cart) : res.status(404).send({error: "Cart not created"});
        //res.status(200).send(cart)
    } catch (error) {
        res.status(502).send({error:true});
    }
}

//Controller GET req.params returns cart by id.
export const GETCartById = async (req, res)=>{
    try {
        const {cid} = req.params;
        const data =await cartManager.getCartProductsById(cid);
        data? res.status(200).send(data) : res.status(404).send({error:'That cart ID does not exist'});
    } catch (error) {
        res.status(404).send({error:true});
    }
}

//Controller POST req.params Add product to cart.
export const POSTAddProductToCartId = async (req, res)=>{
    try {
        const {cid,pid} = req.params;
        (await cartManager.addProductToCart(cid,pid))==true ? res.status(200).send({updated:true}) : res.status(404).send({error:"Cart not foud"});
    } catch (error) {
        res.status(404).send({error:true});
    }
}

//Controller DELETE req.params delete product from cart by id.
export const DELETEProductById = async (req, res)=>{
    try {
       const {cid,pid} = req.params;
       await cartManager.deleteProduct(cid, pid) == true? res.status(200).send({deleted:true}) : res.status(404).send({error:"Cart o Product not foud"});
    } catch (error) {
        res.status(404).send({error:true});
    }
}

//Controller PUT req.params and req.body Replace cart content by ID.
export const PUTUpadateFullCartbyId = async (req, res)=>{
    try {
        const {cid} = req.params;
        const body = req.body;
        const result = await cartManager.updateCartArray(cid,body) 
        result == true? res.status(200).send({updated:true}) : res.status(404).send({error:result});
    } catch (error) {
        res.status(404).send({error:true});
    }
}

//Controller PUT req.params increment product quantity
export const PUTIncrementQuantityById = async(req, res)=>{
    try {
        const {cid,pid} = req.params;
        const body = req.body;
        const result = await cartManager.updateCartQuantity(cid,pid, body);
        result == true? res.status(200).send({updated:true}) : res.status(404).send({error:result});
    } catch (error) {
        res.status(404).send({error:true});
    }
}

//Controller DELETE erase all products from cart
export const DELETEDeleteProductsById = async (req, res)=>{
    try {
        const {cid} = req.params;
        const result = await cartManager.deleteCartProducts(cid)
        result == true? res.status(200).send({delete:true}) : res.status(404).send({error:result});
    } catch (error) {
        console.log(error)
    }
}

//Controller POST purchase cart
export const POSTPurchaseCart = async (req, res) =>{
    try{
        const {cid} = req.params;
        const noStockProducts = await cartManager.purchaseCart(cid);
        res.status(200).send({product:noStockProducts});
    }catch(error){
        console.log(error)
    }
}
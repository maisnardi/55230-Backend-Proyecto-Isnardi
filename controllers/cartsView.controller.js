//Controller de Carts view
//Importaciones
import CartManager from "../services/cart.service.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller GET Cart by id.
export const GETCartById = async (req, res)=>{
    try {
        const {cid} = req.params;
        console.log(cid)
        const data = await cartManager.getCartProductsById(cid);
        const dataObj = data.map(product => product.toObject())
        res.render("carts" , {products:dataObj,cart:cid})
    } catch (error) {
        console.log(error)
    }
}

//Controller POST purchase cart
export const POSTPurchaseCart = async (req, res) =>{
    try{
        console.log("entro en purchase")
        const {cid} = req.params;
        const noStockProducts = await cartManager.purchaseCart(cid);
        res.render(ticket)
    }catch(error){
        console.log(error)
    }
}

//Controller POST req.params Add product to cart.
export const POSTAddProductToCartId = async (req, res)=>{
    try {
        console.log("entro en add product")
        const {cid,pid} = req.params;
        if(await cartManager.addProductToCart(cid,pid)==true)
        {
            res.redirect(`/carts/${cid}`);
        } 
    } catch (error) {
        res.status(404).send({error:true});
    }
}
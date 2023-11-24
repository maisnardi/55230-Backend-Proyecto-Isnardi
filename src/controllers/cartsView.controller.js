//Controller de Carts view
//Importaciones
import CartManager from "../services/cart.service.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller GET Cart by id.
export const GETCartById = async (req, res)=>{
    try {
        let amount = 0;
        const {cid} = req.params;
        const data = await cartManager.getCartProductsById(cid);
        const dataObj = data.map(product => product.toObject())
        dataObj.forEach(element => {
            amount = amount + (element._id.price * element.quantity);       
        });
        const render = {
            products:dataObj,
            cart: {
                cid:cid
            }, 
            amount:amount
        }
        res.render("carts" , render)
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

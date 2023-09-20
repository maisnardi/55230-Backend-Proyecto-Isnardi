//Controller de Carts view
//Importaciones
import CartManager from "../services/cart.service.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller GET Cart by id.
export const GETCartById = async (req, res)=>{
    try {
        const {cid} = req.params;
        const data = await cartManager.getCartProductsById(cid);
        const dataObj = data.map(product => product.toObject())
        res.render("carts" , {products:dataObj,cart:cid})
    } catch (error) {
        console.log(error)
    }
}
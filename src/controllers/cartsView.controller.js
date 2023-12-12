//Controller de Carts view
//Importaciones
import CartManager from "../services/cart.service.js";
import CustomError from "../utils/Errors/CustomError.js";
import errorsDictionary from "../utils/Errors/EnumErrors.js";

//Instanciamos un nuevo productManager.
const cartManager = new CartManager("carts");

//Controller GET Cart by id.
export const GETCartById = async (req, res, next)=>{
    try {
        const user = req.user;
        const cid = user.cartId.toString();
        let amount = 0;
        const data = await cartManager.getCartProductsById(cid, next);
        if(data){
            const dataObj = data.map(product => product.toObject())
            dataObj.forEach(element => {
                amount = amount + (element._id.price * element.quantity);       
            });
            const render = {
                products:dataObj,
                cart: {
                    cid:cid
                }, 
                amount:amount,
                display: req.display
            }
            res.render("carts" , render)
        }
    } catch (error) {
        error.from = "controller"
        return next(error);
    }
}
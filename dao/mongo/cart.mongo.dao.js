//DAO Cart mongoose
import CartModel from "../../models/cart.schema.js"    //Mongoose


class Cart{
    //DAO find all carts
    findAllCarts = async ()=>{
        return await CartModel.find().populate("products._id");
    }

    //DAO insert products
    insertProducts = async (products)=>{
        //return await CartModel.insertMany({products});
        return await CartModel.create({products});
    }

    //DAO find by cart id
    findCartById = async (id)=>{
        return await CartModel.findById(id).populate("products._id");
    }

    //DAO find and update
    updateCartProducts = async (cartId, productsArray)=>{
        return await CartModel.findOneAndUpdate({ _id: cartId },{ products: productsArray});
    }
}

export default Cart;




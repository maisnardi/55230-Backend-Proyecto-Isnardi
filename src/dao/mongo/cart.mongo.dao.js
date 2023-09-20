//DAO Cart mongoose
import CartModel from "../../models/cart.schema.js"    //Mongoose

//DAO find all carts
export const findAllCarts = async ()=>{
    return await CartModel.find().populate("products._id");
}

//DAO insert products
export const insertProducts = async (products)=>{
    return await CartModel.insertMany({products});
}

//DAO find by cart id
export const findCartById = async (id)=>{
    return await CartModel.findById(id).populate("products._id");
}

//DAO find and update
export const updateCartProducts = async (cartId, productsArray)=>{
   return await CartModel.findOneAndUpdate({ _id: cartId },{ products: productsArray});
}
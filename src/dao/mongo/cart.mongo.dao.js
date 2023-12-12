//DAO Cart mongoose
import { ObjectId } from "mongodb";
import CartModel from "../../models/cart.schema.js"    //Mongoose
import mongoose from "mongoose";

class Cart {
    //DAO find all carts
    findAllCarts = async (next) => {
        try {
            return await CartModel.find().populate("products._id");
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO insert products
    insertProducts = async (products, next) => {
        try {
            //return await CartModel.insertMany({products});
            return await CartModel.create({ products });
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO find by cart id
    findCartById = async (id, next) => {
        try {
            return await CartModel.findById(id).populate("products._id");
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    //DAO find and update
    updateCartProducts = async (cartId, productsArray, next) => {
        try {
            return await CartModel.findOneAndUpdate({ _id: cartId }, { products: productsArray });
        } catch (error) {
            error.from = "mongo"
            return next(error);
        }
    }

    // //DAO find by cart id paginate
    // findCartByIdpaginate = async (id, next)=>{
        // try {
        //     console.log("llego al findCartByIdpaginate de mongo");
        //     //const cart = await CartModel.findById(id).populate("products._id");
        //     // const options = {
        //     //     limit: 2,
        //     //     populate: "products._id",
        //     //     select: paginateSubDocs("products", "name price")
        //     // }

        //     const cart = await CartModel.paginate({ _id: id}, options);

        //     // const result = await CartModel.aggregate([
        //     //     {
        //     //         $match: { _id: id }
        //     //     },
        //     //     {
        //     //         $unwind: '$products'
        //     //     },
        //     //     {
        //     //         $replaceRoot: { newRoot: '$products' }
        //     //     }
        //     // ]);
        //     console.log("cart paginate:",cart)
        //     //console.log("cart paginate:",cart.docs[0].products)
        //     //return cart
        // } catch (error) {
        //     console.log("error en findCartByIdpaginate de mongo");
        //     console.log(error);
        // }

        

    // }

    // findCartByIdPaginate = async (id, next) => {
    //     try {
            
    //         const resultado = await CartModel.aggregate([
    //             {
    //                 $match: { _id: new mongoose.Types.ObjectId(id) }
    //             },
    //             {
    //                 $unwind: '$products'
    //             },
    //             {
    //                 $replaceRoot: { newRoot: '$products' }
    //             },
    //             {
    //                 $limit:2
    //             }

    //         ]);
    //         await CartModel.populate(resultado, { path: "_id" })
    //         console.log('resultado:', resultado);
    //         return resultado;
    //     } catch (error) {
    //         console.error('Error al buscar productos paginados:', error);
    //         throw error;
    //     }
    // }
}

export default Cart;




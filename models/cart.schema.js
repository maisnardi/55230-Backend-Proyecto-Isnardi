//Importaciones
import mongoose, { model } from "mongoose";    //mongoose
import { ObjectId } from "mongodb";
import quantitySchema from "../models/quantity.schema.js"

//Schema de product
const cartSchema = new mongoose.Schema({
  _id:{
    type:ObjectId,
  },
  products:[quantitySchema]

  
})

//Model de product
const CartModel = mongoose.model('carts',cartSchema);

export default CartModel;
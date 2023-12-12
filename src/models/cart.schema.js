//Importaciones
import mongoose, { model } from "mongoose";             //mongoose
import mongoosePaginate from "mongoose-paginate-v2"     //Paginate
import { ObjectId } from "mongodb";
import quantitySchema from "../models/quantity.schema.js"

//Schema de product
const cartSchema = new mongoose.Schema({
  // _id:{
  //   type:ObjectId,
  // },
  products: [quantitySchema]


})

//Agregamos el plugin de paginate
cartSchema.plugin(mongoosePaginate);
//Model de product
const CartModel = mongoose.model('carts', cartSchema);

export default CartModel;
//Importaciones
import mongoose, { model } from "mongoose";    //mongoose
import { ObjectId } from "mongodb";

//Schema de quantity
const quantitySchema = new mongoose.Schema({
    _id:{                       
        type:mongoose.Schema.Types.ObjectId,
        ref: "products"     
    },
    quantity:{
        type:Number,
    },
})


export default quantitySchema;
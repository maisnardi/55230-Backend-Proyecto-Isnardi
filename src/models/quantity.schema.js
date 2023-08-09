//Importaciones
import mongoose, { model } from "mongoose";    //mongoose
import { ObjectId } from "mongodb";

//Schema de quantity
const quantitySchema = new mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,     
    },
    quantity:{
        type:Number,
    }
})


export default quantitySchema;
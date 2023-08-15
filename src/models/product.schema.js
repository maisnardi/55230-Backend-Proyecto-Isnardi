//Importaciones
import { ObjectId } from "mongodb";
import mongoose, { model } from "mongoose";    //mongoose
import mongoosePaginate from "mongoose-paginate-v2"     //Paginate

//Schema de product
const productSchema = new mongoose.Schema({
    _id:{
        type:ObjectId
    },
    title:{
        type:String,
        required: true
    },
    code:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    thumbnails:{
        type:Array
    },
    price:{
        type:Number,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    stock:{
        type:Number,
        required: true
    },
    status:{
        type:Boolean,
        required: true
    }
})
//Agregamos el plugin de paginate
productSchema.plugin(mongoosePaginate);
//Model de product
const ProductModel = mongoose.model('products',productSchema);

export default ProductModel;
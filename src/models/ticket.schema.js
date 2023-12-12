//Importaciones
import { ObjectId } from "mongodb";
import mongoose, { model } from "mongoose";    //mongoose
import quantitySchema from "../models/quantity.schema.js"
//Schema de Ticket
const ticketSchema = new mongoose.Schema({
    code:{
        type:String,
        required: true
    },
    purchase_datetime:{
        type:String,
        required: true
    },
    products:[quantitySchema],
    amount:{
        type:Number,
        required: true
    },
    purchaser:{
        type:String,
        required: true
    }
})



//Model de Ticket
const TicketModel = mongoose.model('tickets',ticketSchema);

export default TicketModel;
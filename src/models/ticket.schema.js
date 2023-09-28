//Importaciones
import { ObjectId } from "mongodb";
import mongoose, { model } from "mongoose";    //mongoose
import mongoosePaginate from "mongoose-paginate-v2"     //Paginate

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
    amount:{
        type:Number,
        required: true
    },
    purchaser:{
        type:String,
        required: true
    }
})

//Agregamos el plugin de paginate
ticketSchema.plugin(mongoosePaginate);

//Model de Ticket
const TicketModel = mongoose.model('tickets',ticketSchema);

export default TicketModel;
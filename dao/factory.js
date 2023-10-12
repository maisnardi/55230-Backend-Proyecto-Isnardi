import { ENV } from "../config/config.js";
const PERSISTANCE = ENV.PERSISTANCE
export let ChatsDAO;
export let UsersDAO;
export let TicketsDAO;
export let ProductsDAO;
export let CartsDAO;


switch(PERSISTANCE) {
    case "MONGO":
    default:
        console.log(`Persistant mode: ${PERSISTANCE}`)  
        const { default: chatsMongo } = await import("../dao/mongo/chat.mongo.dao.js");
        ChatsDAO = chatsMongo;
        const { default: usersMongo } = await import("../dao/mongo/users.mongo.dao.js");
        UsersDAO = usersMongo;
        const { default: ticketsMongo } = await import("../dao/mongo/tickets.mongo.dao.js");
        TicketsDAO = ticketsMongo;
        const { default: productsMongo } = await import("../dao/mongo/products.mongo.js");
        ProductsDAO = productsMongo;
        const { default: cartsMongo } = await import("../dao/mongo/cart.mongo.dao.js");
        CartsDAO = cartsMongo;
        break;
}

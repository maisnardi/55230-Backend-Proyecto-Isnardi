import CustomRouter from "./custom.router.js";
import ProductsRouter from "./router/products.routers.js";
import ProductsViewRouter from "./router/productsViews.routers.js";
import UsersRouter from "./router/users.routers.js";
import LoggersRouter from "./router/loggers.routers.js";
import MockRouter from "./router/mocks.routers.js"
import ChatRouter from "./router/chat.routers.js";
import CartsRouter from "./router/carts.routers.js"
import CartsViewsRouter from "./router/cartsView.routers.js"
import UsersViewsRouter from "./router/usersViews.routers.js"
import TicketRouter from "./router/tickets.routers.js"
import TicketViewRouter from "./router/ticketsViews.routers.js"
import PaymentsRouter from "./router/payment.routers.js"

//Instanciación de Routers
//Products
let products = new ProductsRouter();
products = products.getRouter();

//ProductsViews
let prodVWS = new ProductsViewRouter();
prodVWS = prodVWS.getRouter();

//Users
let users = new UsersRouter();
users = users.getRouter();

//Users Views
let usersVWS = new UsersViewsRouter();
usersVWS = usersVWS.getRouter();

//Carts
let carts = new CartsRouter();
carts = carts.getRouter()

//Carts Views
let cartsVWS = new CartsViewsRouter();
cartsVWS = cartsVWS.getRouter()

//Loggers 
let logger = new LoggersRouter();
logger = logger.getRouter();

//Mocks
let mocks = new MockRouter();
mocks = mocks.getRouter();

//Chat
let chat = new ChatRouter();
chat = chat.getRouter();

//Tickets
let tickets = new TicketRouter();
tickets = tickets.getRouter();

//Tickets Views
let ticketsVWS = new TicketViewRouter();
ticketsVWS = ticketsVWS.getRouter();

//Payments
let payments = new PaymentsRouter();
payments = payments.getRouter();

export default class GeneralRauter extends CustomRouter {
    init() {
        this.use('/api/products', products);
        this.use('/', prodVWS);
        this.use('/api/carts', carts);
        this.use('/carts', cartsVWS);
        this.use('/api/auth', users);
        this.use('/', usersVWS);
        this.use('/api/loggers', logger);
        this.use('/api', mocks);
        this.use('/chat', chat);
        this.use('/api/tickets', tickets);
        this.use('/tickets', ticketsVWS);
        this.use('/api/payments', payments);
    }
}
import CustomRouter from "./custom.router.js";
import ProductsRouter from "./router/products.routers.js";
import ProductsViewRouter from "./router/productsViews.routers.js";
import UsersRouter from "./router/users.routers.js";
import LoggersRouter from "./router/loggers.routers.js";
import AuthRouter from "./router/auth.routers.js"
import MockRouter from "./router/mocks.routers.js"
import ChatRouter from "./router/chat.routers.js";
import CartsRouter from "./router/carts.routers.js"
import CartsViewsRouter from "./router/cartsView.routers.js"
import UsersViewsRouter from "./router/usersViews.routers.js"

//Instanciación de Routers
//Products
let products = new ProductsRouter();
products = products.getRouter();

//ProductsViews
let prodViews = new ProductsViewRouter();
prodViews = prodViews.getRouter();

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

//Auth
let auth = new AuthRouter();
auth = auth.getRouter();

//Mocks
let mocks = new MockRouter();
mocks = mocks.getRouter();

//Chat
let chat = new ChatRouter();
chat = chat.getRouter();

export default class GeneralRauter extends CustomRouter{
    init(){
        this.use('/api/products', products);
        this.use('/', prodViews);
        this.use('/api/carts', carts);
        this.use('/carts', cartsVWS);
        this.use('/api', users);
        this.use('/',usersVWS);
        this.use('/api/loggers', logger);
        this.use('/api/auth', auth);
        this.use('/api', mocks);
        this.use('/chat', chat);
    }
}
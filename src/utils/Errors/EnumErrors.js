//Diccionario de errores

const errorsDictionary = {
    //products
    notFoundOne: { status: 404, message: "Not found product" },
    notFound: { status: 404, message: "Not found products" },
    incomplete: { status: 400, message: "Incomplete or invalid parameters" },
    auth: { status: 401, message: "Invalid credentials" },
    forbiden: { status: 403, message: "Not allowed" },
    productNotCreated: { status: 500, message: "Product not created" },
    invalid: { status: 502, message: "Invalid params" },
    unauthorized: { status: 401, message: "Unauthorized" },
    //carts
    notCreated: { status: 404, message: "Cart not created"},
    idNotFound: { status: 404, message: "That cart ID does not exist"},
    notFound: { status: 404, message: "Not found" },
    internalError: { status: 500, message: "Something went wrong" },

    //users
    userNotCreated: { status: 500, message: "User not created" },
    userNotFoundOne: { status: 404, message: "User not found" },
    usersNotFound: { status: 404, message: "Users not found" },
    passwordNotMatch: { status: 400, message: "Password not match" },
    //chats
    notFoundChats: { status: 404, message: "Not found chats" },
    messageNotDelivered: { status: 500, message: "Message not delivered" },

    //tickets
    notFoundTicket: { status: 404, message: "Not found ticket" },
    cartEmpty: { status: 404, message: "Cart is empty" },
    internalError: { status: 500, message: "Something went wrong" },
    //payments
    errorPayment: { status: 500, message: "MP error" },
};
export default errorsDictionary;

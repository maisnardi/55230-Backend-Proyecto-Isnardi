//Diccionario - Enum de códigos de Error

// const EErrors = {
//     ROUTING_ERROR:1,
//     CONTROLLER_ERROR:2,
//     SERVICE_ERROR:3,
//     DATABASE_ERROR:4,
//     USER_INPUT_ERROR:5,
// }

// export default EErrors;

const errorsDictionary = {
    notFoundOne: { status: 404, message: "Not found document" },
    notFound: { status: 404, message: "Not found documents" },
    incomplete: { status: 400, message: "Incomplete values" },
    auth: { status: 401, message: "Invalid credentials" },
    forbiden: { status: 403, message: "Not allowed" }
};
export default errorsDictionary;
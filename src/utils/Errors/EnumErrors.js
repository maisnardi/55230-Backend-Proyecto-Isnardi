//Diccionario de errores

const errorsDictionary = {
    notFoundProducts: {status:404, message: "No matching products"},
    notFoundOne: { status: 404, message: "Not found document" },
    notFound: { status: 404, message: "Not found documents" },
    incomplete: { status: 400, message: "Incomplete values" },
    auth: { status: 401, message: "Invalid credentials" },
    forbiden: { status: 403, message: "Not allowed" }
};
export default errorsDictionary;
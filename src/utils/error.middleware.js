export default function (error, req, res, next) {
    console.log("entro al mid de errores")
    let status = error.status || 500;
    let from = `${req.method} ${req.url} ${error.from || "fatal"}`;
    let message = `${error.message[0].toUpperCase()}${error.message.slice(1).toLowerCase()}` || "error handler";
    console.log( "Status:" + status);
    console.log("from:" +from);
    console.log("message:"+message);

    return res.status(status).json({ status, message, from });
}

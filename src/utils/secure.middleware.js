//Middleware para proteger las vistas si el usuario no se encuentra logueado.
export const protectView = (req,res,next) =>{
    //console.log(req.user)
    if(!req.user) return res.status(403).redirect("/");
    next();
};

//Middleware para que el usuario no pueda volver a loguearse si ya se encuentra logueado.
export const isLogged = (req,res,next) =>{
    if(req.user) return res.status(401).redirect("/products");
    next();
};
//Middleware para proteger las vistas si el usuario no se encuentra logueado.
export const protectView = (req,res,next) =>{
    if(!req.session.user) return res.redirect("/login");
    next();
};

//Middleware para que el usuario no pueda volver a loguearse si ya se encuentra logueado.
export const isLogged = (req,res,next) =>{
    if(req.session.user) return res.redirect("/products");
    next();
};
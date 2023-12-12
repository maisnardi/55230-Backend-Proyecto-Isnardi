const NotFoundMiddleware = (req, res, next)=>{
    try {
        const messege =  req.method + req.url;
        res.render('notFound',{messege:messege})
        
    } catch (error) {
        next(error);
    }
}

export default NotFoundMiddleware;
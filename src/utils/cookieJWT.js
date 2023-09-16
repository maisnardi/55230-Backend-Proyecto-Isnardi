const cookieExtractor = (req) =>{
    console.log("entro a cookie")
    const token = req.cookies.accessToken;
    return token ?? null;
}
export default cookieExtractor;
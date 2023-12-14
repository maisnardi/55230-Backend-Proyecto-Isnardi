import passport from "passport";
import logger from "../config/loggers/factory.js";
// middleware para usar con distintas estrategias.
const passportMW = (strategy, options) => async (req, res, next) => {
  passport.authenticate(strategy, options, (err, user, info) => {
    logger.INFO("Entro al passportMW");
    if (err) next(err);
    if (!user) {
      //return res.status(403).redirect("/");
      return res.status(401).send({
        error: true,
        message: info.messages ? info.messages : info.toString()
      })
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default passportMW;
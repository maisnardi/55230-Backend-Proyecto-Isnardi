import loggerDev from "./config.dev.js"
import loggerProd from "./config.prod.js";
import { ENV } from "../config.js";

console.log(ENV)
let env = ARGS.env;
let logger = null;

switch (env) {
  case "PROD":
    console.log("Environment: Production");
    logger = loggerProd;
    break;

  default: //Default DEV
    console.log("Environment: Development");
    logger = loggerDev;
    break;
}

export default logger;
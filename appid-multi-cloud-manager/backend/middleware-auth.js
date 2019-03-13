var log4js = require('log4js');

var logger = log4js.getLogger('middleware-auth');
logger.level = process.env["LOG_LEVEL"] || "trace";

function checkApiKey(req, res, next){
    var apiKey = req.headers["x-api-key"];
    logger.trace(">> checkApiKey apiKey:", apiKey);
    if (!apiKey || apiKey !== "m5pou9gyvw8psqlgnyi9a34fpgbndaidfgr9zs4r"){
        logger.trace("<< checkApiKey :: 403 Forbidden");
        return res.status(403).send("Forbidden");
    } else {
        logger.trace("<< checkApiKey :: 200 OK");
        return next();
    }
}

module.exports = {
    checkApiKey: checkApiKey
}
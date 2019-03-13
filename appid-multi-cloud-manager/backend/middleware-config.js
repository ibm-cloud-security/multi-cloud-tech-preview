var log4js = require('log4js');

var logger = log4js.getLogger('middleware-config');
logger.level = process.env["LOG_LEVEL"] || "trace";

const TENANT_ID = process.env["TENANT_ID"];
const CLIENT_ID = process.env["CLIENT_ID"];
const SECRET = process.env["SECRET"];
const APPID_URL = process.env["APPID_URL"];

logger.info("Initializing. Checking environment variables");
if (!TENANT_ID || 
    !CLIENT_ID ||
    !SECRET || 
    !APPID_URL){
        logger.fatal("Initialization failed. Make sure following environment variables are available: TENANT_ID, CLIENT_ID, SECRET, APPID_URL");
        process.exit(-1);
} else {
    logger.info("Initialization success. Configuration: ");
    logger.info("TENANT_ID:", TENANT_ID);
    logger.info("CLIENT_ID:", CLIENT_ID);
    logger.info("SECRET:", SECRET.substr(0,4) + "...[NOT SHOWING]...");
    logger.info("APPID_URL:", APPID_URL);
}

function getConfig(req, res, next){
    logger.trace(">> getConfig");
    res.json({
        tenantId: TENANT_ID,
        clientId: CLIENT_ID,
        secret: SECRET,
        authorizationUrl: APPID_URL + "/authorization",
        tokenUrl: APPID_URL + "/token",
        userinfoUrl: APPID_URL + "/userinfo",
        jwksUrl: APPID_URL + "/publickeys"
    });
    logger.trace("<< getConfig :: 200 OK");
}

module.exports = {
    getConfig: getConfig
}
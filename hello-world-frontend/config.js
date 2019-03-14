const log4js = require('log4js');

const logger = log4js.getLogger('hello-world-config');
logger.level = process.env['LOG_LEVEL'] || 'trace';

const CALLBACK_URL = '/appid/callback';

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const oauthServerUrl = process.env.APPID_URL;
const api_service_url = (process.env.SVC_HELLO_WORLD_API_SERVICE_HOST ? `http://svc-hello-world-api:3000` : 'http://localhost:3000').trim();
const public_web_url = (process.env.public_web_url || 'http://localhost:3000').trim();
const backend_url = (process.env.backend_url || 'http://localhost:8000').trim();

// Validate Configuration
logger.info('Initializing. Checking environment variables');
if (!tenantId || !clientId || !secret || !oauthServerUrl){
    logger.fatal('Initialization failed. Make sure following environment variables are available: TENANT_ID, CLIENT_ID, SECRET, APPID_URL');
    process.exit(-1);
}

logger.info('Initialization success');

// Get API Strategy Config
const getAppIDConfig = () => {
    return { tenantId, clientId, secret, oauthServerUrl, redirectUri: `${public_web_url}${CALLBACK_URL}` }
}

const getApiServiceUrl = () => {
    return api_service_url;
}

const getPublicWebUrl = () => {
    return public_web_url;
}

const getBackendUrl = () => {
    return backend_url;
}

module.exports = {
    getAppIDConfig,
    getApiServiceUrl,
    getPublicWebUrl,
    getBackendUrl
};
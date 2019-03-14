const request = require('request-promise');
const log4js = require('log4js');

const logger = log4js.getLogger('web-strategy-middleware');
logger.level = process.env['LOG_LEVEL'] || 'trace';

const webAppStrategyMiddleware = (apiServiceUrl, redirectUrl) => {
    return async (req, res, next) => {
        try {
            const context = req.session['APPID_AUTH_CONTEXT'];
            const accessToken = context && context.accessToken;

            // Send an access token if we have one to istio
            const options = {
                method: 'GET',
                uri: `${apiServiceUrl}/api/is_protected`,
                headers: { authorization: accessToken ? `Bearer ${accessToken}` : null },
                resolveWithFullResponse: true,
                simple: false
            };

            logger.info('Checking if user is authenticated', options);
            const response = await request(options);

            if (response.statusCode !== 401 && response.statusCode !== 200) {
                logger.error('Unexpected Response from is protected', { status: response.statusCode, body: response.body });
                return res.send({ error: 'Received un unexpected response', req: { status: response.statusCode, body: response.body } })
            }

            // If Istio rejects the access token - manually trigger a login
            if (response.statusCode === 401) {
                logger.info('Unauthenticated redirecting to login');
                return res.redirect(redirectUrl);
            }
            
            next()

        } catch (e) {
            logger.error('An error occurred processing the request', e);
            return res.send({ error: 'An error occurred processing the request', ...e })
        }
    }
};

module.exports = webAppStrategyMiddleware;

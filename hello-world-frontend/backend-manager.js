const request = require('request-promise');
const log4js = require('log4js');
const config = require('./config');

const logger = log4js.getLogger('backend-manager');
logger.level = process.env['LOG_LEVEL'] || 'trace';
const backend_url = config.getBackendUrl();

const getUserInfo = async (accessToken, idToken) => {
	try {
		const options = {
			method: 'GET',
			uri: `${backend_url}/api/user/data`,
			headers: { authorization: accessToken ? `Bearer ${accessToken} ${idToken}` : null },
			resolveWithFullResponse: true,
			simple: false,
			json: true
		};

		logger.info('Retrieving user data', options);
		if (process.env.fake_backend==1){
			return {
				status: 200,
				body: {
					total_donations: "$11.11",
					locale: "en-us"
				}
			}
		}
		
		const res = await request(options);
		logger.info('Backend response', { status: res.statusCode, body: res.body });
		return { status: res.statusCode, body: res.body }
	} catch (e) {
		logger.error('Backend error', e);
		return { status: 500 }
	}

};

module.exports = {
	getUserInfo
};

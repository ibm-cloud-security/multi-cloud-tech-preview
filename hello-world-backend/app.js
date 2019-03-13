const express = require('express');
const log4js = require('log4js');

const logger = log4js.getLogger('hello-world-backend');
logger.level = process.env['LOG_LEVEL'] || 'trace';

const app = express();

app.get('/api/user/data', (req, res) => {
	// Retrieve authorization header from request
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(404).send({ errorMsg: 'user not found'})
	}

	// Validate that first header component is Bearer
	const authHeaderComponents = authHeader.split(' ');
	if (authHeaderComponents[0] !== 'Bearer') {
		return res.status(404).send({ errorMsg: 'user not found'})
	}

	// Validate header has exactly 2 or 3 components (Bearer, access_token, [id_token])
	if (!(authHeaderComponents.length === 2 || authHeaderComponents.length === 3)) {
		return res.status(404).send({ errorMsg: 'user not found'})
	}

	// Validate second header component is a valid access_token
	const accessTokenString = authHeaderComponents[1];
	
	// Validate Token here.
	logger.info('User is authenticated', accessTokenString);

	res.status(200).send({
		total_donations: '$1234.56',
		locale: 'en-us'
	});
});

app.listen(8000, () => {
    logger.info('Listening on port 8000');
});

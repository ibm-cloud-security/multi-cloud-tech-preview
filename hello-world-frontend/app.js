const express = require('express');
const log4js = require('log4js');
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const backendManager = require('./backend-manager');
const webAppStrategyMiddleware = require('./middleware/web-strategy-middleware');
const config = require('./config');

const API_SERVICE_URL = config.getApiServiceUrl();
const PUBLIC_WEB_URL = config.getPublicWebUrl();
const LOGIN_URL = '/appid/login';
const CALLBACK_URL = '/appid/callback';
const LOGOUT_URL = '/appid/logout';

const logger = log4js.getLogger('hello-world-frontend');
logger.level = process.env['LOG_LEVEL'] || 'trace';

const app = express();

app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new WebAppStrategy(config.getAppIDConfig()));

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((obj, cb) => {
	cb(null, obj);
});

// Web
app.get('/', webAppStrategyMiddleware(API_SERVICE_URL, `${PUBLIC_WEB_URL}${LOGIN_URL}`), async (req, res) => {
	const context = req.session['APPID_AUTH_CONTEXT'];
	const accessToken = context && context.accessToken;
	const idTokenPayload = context && context.identityTokenPayload;
	const name = idTokenPayload ? (idTokenPayload.name || 'Authenticated user') : 'anonymous user' ;
	logger.info('User is authorized to view the page', name);

	const response = await backendManager.getUserInfo(accessToken);

	switch (response.status) {
		case 200:
			return res.send({ msg: `Hello ${name}`, userInfo: response.body });
		case 401:
			return res.send({ msg: `Hello ${name}`, error: 'Unauthorized' });
		case 404:
			return res.send({ msg: `Hello ${name}`, error: 'User not found' });
		case 500:
			return res.send({ error: 'Error contacting backend' });
		default:
			return res.send({ error: 'An unexpected error occurred' });
	}
});

// Proxy
app.get('/api/user/data', webAppStrategyMiddleware(API_SERVICE_URL, `${PUBLIC_WEB_URL}${LOGIN_URL}`), async (req, res) => {
	const context = req.session['APPID_AUTH_CONTEXT'];
	const accessToken = context && context.accessToken;
	const response = await backendManager.getUserInfo(accessToken);
	return res.status(200).send(response.body);
});

// App ID SDK
app.get(LOGIN_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));

app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.get(LOGOUT_URL, (req, res) => {
	WebAppStrategy.logout(req);
	res.redirect('/');
});

// API
app.get('/api/is_protected', (req, res) => {
	logger.info('is_protected - User is Authenticated');
	res.status(200).send('OK');
});

app.get('/api/auth_context', (req, res, next) => {
    res.json({ ...(req.session['APPID_AUTH_CONTEXT'] || {}) });
});

app.listen(3000, () => {
    logger.info('Listening on port 3000');
});

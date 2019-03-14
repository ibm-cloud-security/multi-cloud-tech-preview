const log4js = require('log4js');

const logger = log4js.getLogger('database-client');
logger.level = process.env['LOG_LEVEL'] || 'trace';


class DatabaseClient {

    constructor() {
        logger.debug('Instantiated Database Client');
        this.clusterData = {}
    }

    async keys(prefix) {
        return Object.keys(this.clusterData).reduce((acc, key) => {
            if (key.startsWith(prefix)) {
                acc.push(key)
            }
            return acc;
        },[])
    }
    
    async set(key, body) {
        this.clusterData[key] = body;
    }
    
    async get(key) {
        return this.clusterData[key];
    }

    async del(key) {
        delete this.clusterData[key];
    }

}

module.exports = new DatabaseClient();
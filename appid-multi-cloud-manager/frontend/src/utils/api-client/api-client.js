import Axios from 'axios';
import Logger from 'utils/logger/logger'

let logger = Logger.getLoggerWithLevel("ApiClient", Logger.TRACE);

let _client;

class ApiClient {
    static getClient() {
        // logger.debug(">> getClient");
        if (!_client) {
            _client = Axios.create({
                baseURL: "/api"
            });
        }
        // logger.debug("<< getClient");
        return _client;
    }

    static async getClusters() {
        logger.debug(">> getClusters");
        const clusters = (await this.getClient().get('/clusters')).data.clusters;
        logger.debug("<< getClusters");
        return clusters;
    }

    static async deleteCluster(guid) {
        logger.debug(">> deleteCluster", guid);
        await this.getClient().delete('/clusters/' + guid);
        logger.debug("<< deleteCluster");
    }

    static async updateClusterPolicy(guid, serviceName, protectionEnabled) {
        logger.debug(">> updateClusterPolicy", guid, serviceName, protectionEnabled);
        await this.getClient().post('/clusters/' + guid + '/policy', {
            protectionEnabled: protectionEnabled,
            serviceName: serviceName
        });
        logger.debug("<< updateClusterPolicy");
    }
}

export default ApiClient;

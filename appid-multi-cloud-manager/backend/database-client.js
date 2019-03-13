class DatabaseClient {

    constructor() {
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
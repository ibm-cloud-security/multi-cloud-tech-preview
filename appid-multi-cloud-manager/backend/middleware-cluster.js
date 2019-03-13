var log4js = require('log4js');
var redis = require('redis');
var URL = require("url").URL;

var logger = log4js.getLogger('middleware-clusters');
logger.level = process.env["LOG_LEVEL"] || "trace";

var connString = "rediss://admin:3e907322c4a078f65dd501e956c5a4cf18daa7b028c4164d1eae50c296ac67bc@5d010ddb-8f2b-4ba5-9477-cab40c314072.974550db55eb4ec0983f023940bf637f.databases.appdomain.cloud:30478/0";
var redisClient = redis.createClient(connString, {
    tls: {
        servername: new URL(connString).hostname,
        rejectUnauthorized: false
    }

});

const PROTECTED_SERVICES_PREFIX= "protected-services-cluster-guid-";
const CLUSTER_GUID_PREFIX = "cluster-guid-";

redisClient.on("error", function (err) {
    logger.error(err);
});

const {promisify} = require('util');
redisClient.asyncKeys = promisify(redisClient.keys).bind(redisClient);
redisClient.asyncSet = promisify(redisClient.set).bind(redisClient);
redisClient.asyncGet = promisify(redisClient.get).bind(redisClient);
redisClient.asyncHset = promisify(redisClient.hset).bind(redisClient);
redisClient.asyncHget = promisify(redisClient.hget).bind(redisClient);
redisClient.asyncHgetall = promisify(redisClient.hgetall).bind(redisClient);
redisClient.asyncDel = promisify(redisClient.del).bind(redisClient);

async function registerCluster(req, res, next) {
    logger.trace(">> registerCluster", JSON.stringify(req.body));

    // Sanitize input
    for (var i in req.body.services) {
        delete req.body.services[i].protectionEnabled;
    }

    await redisClient.asyncHset(CLUSTER_GUID_PREFIX + req.body.guid,
        "guid", req.body.guid,
        "name", req.body.name,
        "location", req.body.location,
        "lastActivityTimestamp", new Date(),
        "type", req.body.type,
        "services", JSON.stringify(req.body.services || {})
    );

    req.params.id = req.body.guid;
    return getCluster(req, res, next);
}

async function getAllClusters(req, res, next) {
    logger.trace(">> getAllClusters");
    var clustersArray = [];

    const keys = await redisClient.asyncKeys(CLUSTER_GUID_PREFIX + "*");

    for (var i in keys) {
        const key = keys[i];
        const cluster = await redisClient.asyncHgetall(key);
        cluster.services = JSON.parse(cluster.services || '{}');

        const protectedServices = await redisClient.asyncHgetall(PROTECTED_SERVICES_PREFIX + cluster.guid) || {};

        for (var serviceName in cluster.services) {
            cluster.services[serviceName].protectionEnabled = (protectedServices[serviceName] === "true");
        }
        clustersArray.push(cluster);
    }

    logger.trace("<< getAllClusters :: 200 OK");
    return res.json({clusters: clustersArray});
}

async function getCluster(req, res, next) {
    logger.trace(">> getCluster :: ", req.params.id);
    const cluster = await redisClient.asyncHgetall(CLUSTER_GUID_PREFIX + req.params.id);
    if (!cluster) {
        logger.trace("<< getCluster :: 404 Not Found");
        return res.status(404).send("Not Found");
    }

    cluster.services = JSON.parse(cluster.services || {});

    const protectedServices = await redisClient.asyncHgetall(PROTECTED_SERVICES_PREFIX + cluster.guid) || {};
    for (var serviceName in cluster.services) {
        cluster.services[serviceName].protectionEnabled = (protectedServices[serviceName] === "true");
    }

    logger.trace("<< getCluster :: 200 OK");
    return res.json({
        guid: cluster.guid,
        name: cluster.name,
        lastActivityTimestamp: cluster.lastActivityTimestamp,
        location: cluster.location,
        type: cluster.type,
        services: cluster.services
    });
}

async function setPolicy(req, res, next) {
    logger.trace(">> setPolicy :: ", req.params.id, JSON.stringify(req.body));
    await redisClient.asyncHset(PROTECTED_SERVICES_PREFIX + req.params.id, req.body.serviceName, req.body.protectionEnabled);
    logger.trace("<< setPolicy :: 200 OK");
    return res.send();
}

async function deleteCluster(req, res, next){
    logger.trace(">> deleteCluster :: ", req.params.id);
    await redisClient.asyncDel(CLUSTER_GUID_PREFIX + req.params.id);
    logger.trace("<< deleteCluster :: 200 OK");
    return res.send();
}

module.exports = {
    getAllClusters: getAllClusters,
    getCluster: getCluster,
    registerCluster: registerCluster,
    setPolicy: setPolicy,
    deleteCluster: deleteCluster
};

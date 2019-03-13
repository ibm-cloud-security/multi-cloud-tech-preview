const log4js = require('log4js');
const databaseClient = require('./database-client');
const URL = require("url").URL;
const logger = log4js.getLogger('middleware-clusters');
logger.level = process.env["LOG_LEVEL"] || "trace";

const PROTECTED_SERVICES_PREFIX= "protected-services-cluster-guid-";
const CLUSTER_GUID_PREFIX = "cluster-guid-";

async function registerCluster(req, res, next) {
    logger.trace(">> registerCluster", JSON.stringify(req.body));

    // Sanitize input
    for (var i in req.body.services) {
        delete req.body.services[i].protectionEnabled;
    }

    await databaseClient.set(CLUSTER_GUID_PREFIX + req.body.guid, {
        guid: req.body.guid,
        name: req.body.name,
        location: req.body.location,
        lastActivityTimestamp: new Date(),
        type: req.body.type,
        services: req.body.services || {}
    })

    req.params.id = req.body.guid;
    return getCluster(req, res, next);
}

async function getAllClusters(req, res, next) {
    logger.trace(">> getAllClusters");
    var clustersArray = [];

    const keys = await databaseClient.keys(CLUSTER_GUID_PREFIX);
    logger.info("key", keys);
    for (var i in keys) {
        const key = keys[i];
        const cluster = await databaseClient.get(key);
        const protectedServices = await databaseClient.get(PROTECTED_SERVICES_PREFIX + cluster.guid) || {};

        for (var serviceName in cluster.services) {
            cluster.services[serviceName].protectionEnabled = protectedServices[serviceName] === true;
        }
        clustersArray.push(cluster);
    }

    logger.trace("<< getAllClusters :: 200 OK");
    logger.info(clustersArray);
    return res.json({clusters: clustersArray});
}

async function getCluster(req, res, next) {
    logger.trace(">> getCluster :: ", req.params.id);
    const cluster = await databaseClient.get(CLUSTER_GUID_PREFIX + req.params.id);
    if (!cluster) {
        logger.trace("<< getCluster :: 404 Not Found");
        return res.status(404).send("Not Found");
    }

    const protectedServices = await databaseClient.get(PROTECTED_SERVICES_PREFIX + cluster.guid) || {};
    console.log("protected", protectedServices);
    for (var serviceName in cluster.services) {
        cluster.services[serviceName].protectionEnabled = protectedServices[serviceName] === true;;
    }

    logger.trace("<< getCluster :: 200 OK");
    return res.json(cluster);
}

async function setPolicy(req, res, next) {
    logger.trace(">> setPolicy :: ", req.params.id, JSON.stringify(req.body));
    await databaseClient.set(PROTECTED_SERVICES_PREFIX + req.params.id, {
        serviceName: req.body.serviceName,
        protectionEnabled: req.body.protectionEnabled
    });
    logger.trace("<< setPolicy :: 200 OK");
    return res.send();
}

async function deleteCluster(req, res, next){
    logger.trace(">> deleteCluster :: ", req.params.id);
    await databaseClient.del(CLUSTER_GUID_PREFIX + req.params.id);
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

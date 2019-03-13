var express = require('express');
var log4js = require('log4js');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var logger = log4js.getLogger('appid-multi-cloud-manager');
logger.level = process.env["LOG_LEVEL"] || "trace";

logger.info("Starting...");

app.use(cors());

var authRouter = express.Router();
authRouter.use(require("./middleware-auth").checkApiKey);

var clustersRouter = express.Router();
clustersRouter.get("/", require('./middleware-cluster').getAllClusters);
clustersRouter.get("/:id", require('./middleware-cluster').getCluster);
clustersRouter.delete("/:id", require('./middleware-cluster').deleteCluster);
clustersRouter.post("/", require('./middleware-cluster').registerCluster);
clustersRouter.post("/:id/policy", require('./middleware-cluster').setPolicy);

var configRouter = express.Router();
configRouter.get("/", require('./middleware-config').getConfig);

app.use(bodyParser.json());
app.use(express.static("./public"));
app.use("/api/clusters", clustersRouter);
app.use("/api/config", authRouter, configRouter);

app.listen(3001, () => {
    logger.info("Server running at http://localhost:3001");
});
package main

import (
	"app/clusters"
	"app/config"
	"app/env"
	"log"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {

	env, err := env.NewDashboardEnv()
	if err != nil {
		log.Fatal("FATAL: Environment not configured")
		os.Exit(-1)
	}

	router := gin.Default()

	dir, err := os.Getwd()
	router.Use(static.Serve("/", static.LocalFile(dir+"/public", true)))

	v1 := router.Group("/api")

	config.RegisterConfigRouter(env, v1.Group("/config"))
	clusters.RegisterClusterRouter(env, v1.Group("/clusters"))

	router.Run(":3001")
}

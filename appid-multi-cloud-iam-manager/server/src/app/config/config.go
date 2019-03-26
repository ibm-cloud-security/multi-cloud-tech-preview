package config

import (
	"app/env"
	"net/http"

	"github.com/gin-gonic/gin"
)

type controller struct {
	env *env.Env
}

func RegisterConfigRouter(env *env.Env, router *gin.RouterGroup) {
	ctrl := controller{
		env: env,
	}

	router.Use(AuthMiddleware(env.APIKey))
	router.GET("/", ctrl.getConfig)
}

func (ctrl *controller) getConfig(c *gin.Context) {
	c.JSON(http.StatusOK, ctrl.env.AppIDCredentials)
}

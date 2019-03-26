package config

import "github.com/gin-gonic/gin"

// AuthMiddleware : API Key Authorization Middleware
func AuthMiddleware(expectedKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if apiKey := c.GetHeader("x-api-key"); apiKey == expectedKey {
			c.Next()
		} else {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid API KEY"})
			return
		}
	}
}

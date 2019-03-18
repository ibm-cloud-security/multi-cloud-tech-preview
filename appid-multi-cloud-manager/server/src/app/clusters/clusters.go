package clusters

import (
	"app/database"
	"app/env"
	"errors"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type contoller struct {
	env      *env.Env
	database database.Database
}

func RegisterClusterRouter(env *env.Env, router *gin.RouterGroup) {
	clusterRouter := contoller{
		env: env,
	}

	router.GET("/", clusterRouter.getClusters)
	router.GET("/:id", clusterRouter.getCluster)
	router.DELETE("/:id", clusterRouter.deleteCluster)
	router.POST("/", clusterRouter.registerCluster)
	router.POST("/:id/policy", clusterRouter.setClusterPolicy)
}

func (ctrl *contoller) getCluster(c *gin.Context) {
	clusterID := c.Param("id")
	cluster, err := ctrl.findCluster(clusterID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cluster)
}

func (ctrl *contoller) deleteCluster(c *gin.Context) {
	clusterID := c.Param("id")
	ctrl.database.Delete(ClusterGuidPrefix + clusterID)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (ctrl *contoller) registerCluster(c *gin.Context) {
	// Parse Request
	var clusterInfo ClusterInfo
	if err := c.Bind(&clusterInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad cluster format"})
		return
	}
	log.SetFlags(log.LstdFlags)
	log.Print("Shutting down....")
	clusterInfo.LastActivityTimestamp = time.Now()

	// Sanitize services
	for key, v := range clusterInfo.Services {
		v.IsProtectionEnabled = false
		clusterInfo.Services[key] = v
	}

	// Store
	ctrl.database.Set(ClusterGuidPrefix+clusterInfo.GUID, clusterInfo)

	// Retrieve normalized cluster
	cluster, err := ctrl.findCluster(clusterInfo.GUID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, *cluster)
}

func (ctrl *contoller) setClusterPolicy(c *gin.Context) {
	// Parse Request
	clusterID := c.Param("id")
	var policyRequest DashboardPolicyRequest
	if err := c.Bind(&policyRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad policy format"})
		return
	}

	// Get original service policy map
	policies := ctrl.database.Get(ProtectedServicesPrefix + clusterID)
	if policies == nil {
		policies = make(map[string]bool)
	}

	// Cast and update policy map
	p := policies.(map[string]bool)
	p[policyRequest.ServiceName] = policyRequest.IsProtectionEnabled
	ctrl.database.Set(ProtectedServicesPrefix+clusterID, policies)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (ctrl *contoller) getClusters(c *gin.Context) {
	keys := ctrl.database.Keys(ClusterGuidPrefix)
	clusterArray := make([]ClusterInfo, len(keys))
	for i := range keys {
		guid := after(keys[i], ClusterGuidPrefix)
		clusterInfo, err := ctrl.findCluster(guid)
		if err != nil {
			continue
		}
		clusterArray[i] = *clusterInfo
	}

	c.JSON(http.StatusOK, gin.H{
		"clusters": clusterArray,
	})
}

func (ctrl *contoller) findCluster(clusterID string) (*ClusterInfo, error) {
	// Get cluster configuration
	clusterInfo := ctrl.database.Get(ClusterGuidPrefix + clusterID)
	if clusterInfo == nil {
		return nil, errors.New("Cluster not found")
	}
	cluster := clusterInfo.(ClusterInfo)

	// Get cluster's service policies
	services := ctrl.database.Get(ProtectedServicesPrefix + clusterID)
	if services == nil {
		return &cluster, nil
	}
	policies := services.(map[string]bool)

	// Apply policies to services
	for k, v := range cluster.Services {
		if result, ok := policies[k]; ok {
			v.IsProtectionEnabled = result
		} else {
			v.IsProtectionEnabled = false
		}
		cluster.Services[k] = v
	}

	return &cluster, nil
}

func after(value string, a string) string {
	pos := strings.LastIndex(value, a)
	if pos == -1 {
		return ""
	}
	adjustedPos := pos + len(a)
	if adjustedPos >= len(value) {
		return ""
	}
	return value[adjustedPos:len(value)]
}

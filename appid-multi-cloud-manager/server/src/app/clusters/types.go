package clusters

import "time"

const (
	ProtectedServicesPrefix = "protected-services-cluster-guid-"
	ClusterGuidPrefix       = "cluster-guid-"
)

// ClusterInfo encapsulates the Kubernetes cluster information to be sent to App ID
type ClusterInfo struct {
	Name                  string             `json:"name"`
	GUID                  string             `json:"guid"`
	Type                  string             `json:"type"`
	Location              string             `json:"location"`
	LastActivityTimestamp time.Time          `json:"lastActivityTimestamp"`
	Services              map[string]Service `json:"services,string"`
}

// Service encapsulates a Kubernetes Service
type Service struct {
	Name                string `json:"name"`
	Namespace           string `json:"namespace"`
	IsProtectionEnabled bool   `json:"protectionEnabled"`
}

// DashboardPolicyRequest Service encapsulates a Kubernetes Service
type DashboardPolicyRequest struct {
	ServiceName         string `json:"serviceName"`
	IsProtectionEnabled bool   `json:"protectionEnabled"`
}

package env

import (
	"errors"
	"log"
	"os"
)

const (
	appIDUrl = "APPID_URL"
	secret   = "SECRET"
	clientID = "CLIENT_ID"
	tenantID = "TENANT_ID"
)

type AppIDInstance struct {
	TenantID           string `json:"tenantId"`
	ClientID           string `json:"clientId"`
	Secret             string `json:"secret"`
	OauthURL           string `json:"authorizationUrl"`
	TokenEndpoint      string `json:"tokenUrl"`
	UserInfoEndpoint   string `json:"userinfoUrl"`
	PublicKeysEndpoint string `json:"jwksUrl"`
}

type Env struct {
	AppIDCredentials *AppIDInstance
	APIKey           string
}

func NewDashboardEnv() (*Env, error) {
	env := &Env{}
	appIDCredentials := &AppIDInstance{}

	// Retrieve Environment Variables
	appidURL := os.Getenv(appIDUrl)
	appIDCredentials.Secret = os.Getenv(secret)
	appIDCredentials.ClientID = os.Getenv(clientID)
	appIDCredentials.TenantID = os.Getenv(tenantID)
	env.AppIDCredentials = appIDCredentials
	env.APIKey = "m5pou9gyvw8psqlgnyi9a34fpgbndaidfgr9zs4r"

	if appidURL == "" || appIDCredentials.Secret == "" || appIDCredentials.TenantID == "" || appIDCredentials.ClientID == "" {
		log.Print("Missing one of the following environment variables: APPID_URL SECRET TENANT_ID CLIENT_ID")
		log.Print("Shutting down....")
		return nil, errors.New("Missing App ID configuration")
	}

	appIDCredentials.OauthURL = appidURL + "/authorization"
	appIDCredentials.TokenEndpoint = appidURL + "/token"
	appIDCredentials.UserInfoEndpoint = appidURL + "/userinfo"
	appIDCredentials.PublicKeysEndpoint = appidURL + "/publickeys"

	return env, nil
}

# azure-appserv-custom-signin
App Service Client-directed sign-in

## Create the infrastructure

Create an app registration and a user:

```sh
az ad app create --sign-in-audience AzureADMyOrg --display-name "appserv-custom-signin"
az ad sp create --id <application_idd>
az ad user create --display-name myuser --password password --user-principal-name myuser@contoso.com
```

To the app registration:
- Add SPA platform (do not select token generation) and set `http://localhost:4200` as the redirect URI 
- Make sure you also set the Application ID URI, like in `api://<application_id>`
- Create a scope named `api://<application_id>/user_impersonation`

Create the infrastructure:

```sh
az group create -n rgapp -l eastus
az appservice plan create -g rgapp -n planapp --is-linux --sku B1
az webapp create -g rgapp -p planapp -n appcustomsignin789 -r "DOTNETCORE:7.0" --https-only
az webapp config set -g rgapp -n appcustomsignin789 --always-on true
```

Add the required app settings (environment variables):

```sh
az webapp config appsettings set -g rgapp -n appcustomsignin789 --settings \
        AzureAd__Domain="<DOMAIN>" \
        AzureAd__ClientId="<CLIENT_ID>" \
        AzureAd__TenantId="<TENANT_ID>" \
        WEBSITE_RUN_FROM_PACKAGE=1
```

Set up CORS:

```sh
az webapp cors add -g rgapp -n appcustomsignin789 --allowed-origins "*"
```

Restart the app:

```sh
az webapp restart -g rgapp -n appcustomsignin789
```

## Add Authenticatino to AppServ

Using the Portal, add an identity provider:

- Identity Provider: Microsoft
- App Registration Type: Pick existing
- Issuer URL: `https://login.microsoftonline.com/{TENANT_ID}`
- Restrict access: Require
- Unauthenticated requests: HTTP 401
- Token store: No
- Allowed token audiences: `api://{application_id}`

## Deploy the Web API to Azure

Enter the application directory:

```sh
cd api
```

Build and deploy the webapi to App Services:

```sh
bash build.sh
az webapp deployment source config-zip -g rgapp -n appcustomsignin789 --src ./bin/webapi.zip
```

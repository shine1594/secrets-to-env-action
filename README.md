# Javascript action that generate `.env` file from github secrets.

## Inputs

### secrets (*required*)
### env (*required*)
`all` | `production` | `development`
### prefix_prod
default: `'__PROD__'`
### prefix_dev
default: `'__DEV__'`
### file_name_prod
default: `'.env'`
### file_name_dev
default: `'.env.dev'`
### override_prod
default: `'false'`\
If this value is 'true', It will use prod-secrets as base when generating `.env.dev` and overwrite them by dev-secrets.

## Example usage
```
uses: actions/secrets-to-env-action@v1
with:
  secrets: '${{ toJSON(secrets) }}'
  env: 'all'
```

```
uses: actions/secrets-to-env-action@v1
with:
  secrets: '${{ toJSON(secrets) }}'
  env: 'production'
  file_name_prod: 'my_production_env.txt'
```

```
uses: actions/secrets-to-env-action@v1
with:
  secrets: '${{ toJSON(secrets) }}'
  env: 'production'
  prefix_prod: '__MY_PROD_PREFIX__'
```

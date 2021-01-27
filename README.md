# Javascript action that generate `.env` file from github secrets.

## Inputs

### secrets (_required_)

### secrets*env (_required_)

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
uses: shine1594/secrets-to-env-action@1.4.0
with:
  secrets: '${{ toJSON(secrets) }}'
  secrets_env: 'all'
```

```
uses: shine1594/secrets-to-env-action@1.4.0
with:
  secrets: '${{ toJSON(secrets) }}'
  secrets_env: 'production'
  file_name_prod: 'my_production_env.txt'
```

```
uses: shine1594/secrets-to-env-action@1.4.0
with:
  secrets: '${{ toJSON(secrets) }}'
  secrets_env: 'production'
  prefix_prod: '__MY_PROD_PREFIX__'
```

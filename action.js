const DEFAULT_PREFIX_DEV = "__DEV__";
const DEFAULT_PREFIX_PROD = "__PROD__";
const DEFAULT_PREFIX_STAG = "__STAG__";
const DEFAULT_FILE_NAME_DEV = ".env.dev";
const DEFAULT_FILE_NAME_STAG = ".env.stag";
const DEFAULT_FILE_NAME_PROD = ".env";

const parseSecrets = (prefix, secrets) =>
  Object.fromEntries(
    Object.entries(secrets)
      .filter(([key]) => key.startsWith(prefix))
      .map(([k, v]) => [k.replace(prefix, ""), v])
  );

const toEnvString = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");

const makeSuccessMessage = (file_names) =>
  `${file_names.map((n) => `'${n}'`).join(" and ")} file${
    file_names.length > 1 ? "s" : ""
  } created successfully.`;

const main = ({
  secrets,
  secrets_env,
  overwrite_prod = "false",
  file_name_prod = DEFAULT_FILE_NAME_PROD,
  file_name_stag = DEFAULT_FILE_NAME_STAG,
  file_name_dev = DEFAULT_FILE_NAME_DEV,
  prefix_prod = DEFAULT_PREFIX_PROD,
  prefix_stag = DEFAULT_PREFIX_STAG,
  prefix_dev = DEFAULT_PREFIX_DEV,
}) => {
  const secrets_obj = JSON.parse(secrets);
  const env_prod_obj = parseSecrets(prefix_prod, secrets_obj);
  const files = [];
  if (secrets_env === "production" || secrets_env === "all") {
    files.push([file_name_prod, toEnvString(env_prod_obj)]);
  }

  if (secrets_env === "stage" || secrets_env === "all") {
    const env_stag_obj = parseSecrets(prefix_stag, secrets_obj);
    files.push([
      file_name_stag,
      toEnvString(
        Object.assign(
          {},
          overwrite_prod === "true" ? env_prod_obj : {},
          env_stag_obj
        )
      ),
    ]);
  }

  if (secrets_env === "development" || secrets_env === "all") {
    const env_dev_obj = parseSecrets(prefix_dev, secrets_obj);
    files.push([
      file_name_dev,
      toEnvString(
        Object.assign(
          {},
          overwrite_prod === "true" ? env_prod_obj : {},
          env_dev_obj
        )
      ),
    ]);
  }
  return files;
};

export {
  DEFAULT_PREFIX_DEV,
  DEFAULT_PREFIX_STAG,
  DEFAULT_PREFIX_PROD,
  DEFAULT_FILE_NAME_DEV,
  DEFAULT_FILE_NAME_STAG,
  DEFAULT_FILE_NAME_PROD,
  parseSecrets,
  toEnvString,
  makeSuccessMessage,
  main,
};

const core = require("@actions/core");
const { promises: fs } = require("fs");
const { main, makeSuccessMessage } = require("./action.js");

const input_keys = [
  "secrets",
  "secrets_env",
  "prefix_prod",
  "prefix_dev",
  "file_name_prod",
  "file_name_dev",
  "overwrite_prod",
];

const inputs = input_keys.map((k) => [k, core.getInput(k)]);
const files = main(Object.fromEntries(inputs));
const file_names = files.map(([file_name]) => file_name);

Promise.all(
  files.map(([file_name, env_string]) => fs.writeFile(file_name, env_string))
)
  .then(() => makeSuccessMessage(file_names))
  .then(console.log)
  .catch((err) => core.setFailed(err.message));

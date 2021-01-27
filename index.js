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
];

const files = main(
  Object.fromEntries(input_keys.map((k) => [k, core.getInput(k)]))
);

Promise.all(
  files.map(([file_name, env_string]) => fs.writeFile(file_name, env_string))
)
  .then(() => makeSuccessMessage(files.map(([file_name]) => file_name)))
  .then(console.log)
  .catch((err) => core.setFailed(err.message));

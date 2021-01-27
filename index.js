import core from "@actions/core";
import { promises as fs } from "fs";
import { main, makeSuccessMessage } from "./action.js";

const input_keys = [
  "secrets",
  "env",
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

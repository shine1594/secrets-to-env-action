const { expect } = require("chai");
const {
  DEFAULT_PREFIX_DEV,
  DEFAULT_PREFIX_PROD,
  DEFAULT_FILE_NAME_PROD,
  DEFAULT_FILE_NAME_DEV,
  main,
  parseSecrets,
  toEnvString,
} = require("./action.js");

const secrets = {
  __PROD__SECRET_KEY1: "aaa",
  __PROD__SECRET_KEY2: "bbb",
  __PROD__SECRET_KEY3: "zzz",
  __DEV__SECRET_KEY1: "ccc",
  __DEV__SECRET_KEY2: "ddd",
  __DEV__SECRET_KEY4: "yyy",
  __MY__SECRET_KEY1: "eee",
  __MY__SECRET_KEY2: "fff",
  __MY__SECRET_KEY5: "xxx",
};

const prod_secret_obj = {
  SECRET_KEY1: "aaa",
  SECRET_KEY2: "bbb",
  SECRET_KEY3: "zzz",
};

const dev_secret_obj = {
  SECRET_KEY1: "ccc",
  SECRET_KEY2: "ddd",
  SECRET_KEY4: "yyy",
};

const my_secret_obj = {
  SECRET_KEY1: "eee",
  SECRET_KEY2: "fff",
  SECRET_KEY5: "xxx",
};

const merged_dev_secret_obj = {
  SECRET_KEY1: "ccc",
  SECRET_KEY2: "ddd",
  SECRET_KEY3: "zzz",
  SECRET_KEY4: "yyy",
};

const merged_my_secret_obj = {
  SECRET_KEY1: "eee",
  SECRET_KEY2: "fff",
  SECRET_KEY3: "zzz",
  SECRET_KEY5: "xxx",
};

const prod_env_string = `SECRET_KEY1=aaa\nSECRET_KEY2=bbb\nSECRET_KEY3=zzz`;
const dev_env_string = `SECRET_KEY1=ccc\nSECRET_KEY2=ddd\nSECRET_KEY4=yyy`;
const my_env_string = `SECRET_KEY1=eee\nSECRET_KEY2=fff\nSECRET_KEY5=xxx`;
const merged_dev_env_string = `SECRET_KEY1=ccc\nSECRET_KEY2=ddd\nSECRET_KEY3=zzz\nSECRET_KEY4=yyy`;
const merged_my_env_string = `SECRET_KEY1=eee\nSECRET_KEY2=fff\nSECRET_KEY3=zzz\nSECRET_KEY5=xxx`;

describe("parseSecrets", function () {
  it("default prod prefix", function () {
    expect(parseSecrets(DEFAULT_PREFIX_PROD, secrets)).to.eql(prod_secret_obj);
  });
  it("default dev prefix", function () {
    expect(parseSecrets(DEFAULT_PREFIX_DEV, secrets)).to.eql(dev_secret_obj);
  });
  it("custom prefix", function () {
    expect(parseSecrets("__MY__", secrets)).to.eql(my_secret_obj);
  });
});

describe("toEnvString", function () {
  it("prod", function () {
    expect(toEnvString(prod_secret_obj)).to.eql(prod_env_string);
  });
  it("dev", function () {
    expect(toEnvString(dev_secret_obj)).to.eql(dev_env_string);
  });
  it("custom", function () {
    expect(toEnvString(my_secret_obj)).to.eql(my_env_string);
  });
});

describe("main", function () {
  it("given all env and default options", function () {
    expect(
      main({ secrets: JSON.stringify(secrets), secrets_env: "all" })
    ).to.eql([
      [DEFAULT_FILE_NAME_PROD, prod_env_string],
      [DEFAULT_FILE_NAME_DEV, dev_env_string],
    ]);
  });

  it("given only production env and default options", function () {
    expect(
      main({ secrets: JSON.stringify(secrets), secrets_env: "production" })
    ).to.eql([[DEFAULT_FILE_NAME_PROD, prod_env_string]]);
  });

  it("given all env, custom prod prefix and custom prod file name", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "all",
        prefix_prod: "__MY__",
        file_name_prod: "my_prod_env.txt",
      })
    ).to.eql([
      ["my_prod_env.txt", my_env_string],
      [DEFAULT_FILE_NAME_DEV, dev_env_string],
    ]);
  });

  it("given all env, custom prod file name and override prod env", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "all",
        file_name_prod: "my_prod_env.txt",
        override_prod: "true",
      })
    ).to.eql([
      ["my_prod_env.txt", prod_env_string],
      [DEFAULT_FILE_NAME_DEV, merged_dev_env_string],
    ]);
  });

  it("given all env, custom dev prefix and custom dev file name", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "all",
        prefix_dev: "__MY__",
        file_name_dev: "my_dev_env.txt",
      })
    ).to.eql([
      [DEFAULT_FILE_NAME_PROD, prod_env_string],
      ["my_dev_env.txt", my_env_string],
    ]);
  });

  it("given prod env, custom prod prefix and custom prod file name", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "production",
        prefix_prod: "__MY__",
        file_name_prod: "my_prod_env.txt",
      })
    ).to.eql([["my_prod_env.txt", my_env_string]]);
  });

  it("given dev env, custom dev prefix and custom dev file name", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "development",
        prefix_dev: "__MY__",
        file_name_dev: "my_dev_env.txt",
      })
    ).to.eql([["my_dev_env.txt", my_env_string]]);
  });

  it("given dev env, custom dev prefix, custom dev file name and override prod env", function () {
    expect(
      main({
        secrets: JSON.stringify(secrets),
        secrets_env: "development",
        prefix_dev: "__MY__",
        file_name_dev: "my_dev_env.txt",
        override_prod: "true",
      })
    ).to.eql([["my_dev_env.txt", merged_my_env_string]]);
  });
});

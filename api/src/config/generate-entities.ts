const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { join, extname, basename } = require("path");
const { readdirSync, renameSync } = require("fs");
const fs = require("fs");

async function execute() {
  await exec("npx typeorm-model-generator");
}

execute();

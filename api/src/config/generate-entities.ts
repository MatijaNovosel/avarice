const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function execute() {
  await exec("npx typeorm-model-generator");
}

execute();

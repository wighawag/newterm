const fs = require("fs");
const frkterm = require("fork-terminal");

async function main() {
    const args = process.argv.splice(2);
    const command = args[0];
    const commandArgs = args.splice(1);

    const spawnOptions = {}; // TODO cwd

    let config = {};
    if (fs.existsSync(".newterm.js")) {
        const configModule = require("./.newterm.js");
        if (typeof configModule === "function") {
            config = await configModule();
        } else {
            config = configModule;
        }
    } else if (fs.existsSync(".newterm.json")) {
        config = JSON.parse(fs.readFileSync("./.newterm.json").toString());
    }
    if (config.terminal) {
        if (typeof config.terminal === "function") {
            config.terminal(command, commandArgs, spawnOptions);
        } else {
            spawnOptions.terminal = config.terminal;
            frkterm(command, commandArgs, spawnOptions);
        }
    } else {
        frkterm(command, commandArgs, spawnOptions);
    }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
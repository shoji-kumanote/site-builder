import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { build } from "./commands/build";
import { clean } from "./commands/clean";
import { info } from "./commands/info";
import { Config } from "./modules/Config";
import { Context } from "./modules/Context";

/** メイン処理 */
const main = async (): Promise<void> => {
  const argv = await yargs(hideBin(process.argv))
    .strict(true)
    .locale("en")
    .scriptName("site-builder")
    .usage("$0 [options] -- <command>")
    .help()
    .version()
    .option("config", {
      description: "Set configuration file(s).",
      array: true,
      type: "string",
      alias: "c",
      demandOption: true,
    })
    .option("dry-run", {
      description: "Don't create files.",
      type: "boolean",
      alias: "N",
      default: false,
    })
    .option("dev", {
      description: "Skip time-consuming processes.",
      type: "boolean",
      alias: "D",
      default: false,
    })
    .demandCommand(1, 1, "Command not found.", "")
    .command("info", "Show information.")
    .command("clean", "Remove distributed files.")
    .command("build", "Build all files.")
    .command("watch", "Watch file and process after build.").argv;

  const config = await Config.create(argv);
  const context = new Context(config);

  switch (argv._[0]) {
    case "info":
      info(context);
      break;

    case "clean":
      clean(context);
      break;

    case "build":
      build(context);
      break;

    default:
  }
};

main().catch(console.error);

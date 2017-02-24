import loadManifest from "./loadManifest";
import lintManifest from "../utils/lintManifest";
import * as status from "../utils/status";
import { countBy } from "lodash";
import chalk from "chalk";
import figures from "figures";

/**
 * Finds, lints and validates a manifest file.  Then outputs
 * the results to the terminal.
 *
 * @param  {Object} ctx
 */
export default function (ctx) {
  process.stdout.write(`Welcome!  We're going to attempt to validate your project's manifest file.  Just to be clear, this function is primarily checking schema and formatting.  Though we will try to help you along with best practices, we're not tracking down all your files or running your commands for you.\n\n\n`);
  loadManifest(ctx, function (err) {
    if (err) {
      process.stdout.write(`${chalk.bold.bgRed("Failure!  Error!  Sadness!")}\n\n`);
      process.stdout.write(`We were unable to locate or load your manifest file.  Here's why:\n\n`);
      process.stdout.write(`${chalk.red(err.message)}\n\n\n`);
      process.exit(1);
    }

    status.report("Linting manifest file now");

    // lint our manifest
    var logger = lintManifest(ctx.manifest, false);
    var messages = logger.all();

    status.complete();

    process.stdout.write(`\n\nAnd the results are in!  `);

    // bail out early if no issues
    if (messages.length === 0) {
      process.stdout.write(`Everything looks perfect!  You're good to go.\n\n\n`);
      process.exit(0);
    }

    // count up the results for the output
    var sum = countBy(messages, "type");
    process.stdout.write(`\n\nErrors: ${sum.error || 0}  `);
    process.stdout.write(`Warnings: ${sum.warning || 0}  `);
    process.stdout.write(`Suggestions: ${sum.suggestion || 0}\n\n`);

    // run through the logs we captured and format them appropriately
    messages.forEach(function ({ type, message }) {
      switch (type) {
        case "error":
          message = chalk.red(figures.cross + " " + message);
          break;
        case "warning":
          message = chalk.yellow(figures.warning + " " + message);
          break;
        default:
          message = figures.info + " " + message;
      }

      process.stdout.write(message + "\n");
    });

    process.stdout.write(`\n\n`);
    process.exit(0);
  });
}
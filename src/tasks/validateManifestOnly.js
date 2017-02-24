import loadManifest from "./loadManifest";
import lintManifest from "../utils/lintManifest";
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
  process.stdout.write(`Welcome!  We're going to attempt to validate your project's manifest file.`);
  loadManifest(ctx, function (err) {
    if (err) {
      process.stdout.write(`\n\n${chalk.bold.bgRed("Failure!  Error!  Sadness!")}`);
      process.stdout.write(`\n\nWe were unable to locate or load your manifest file.  Here's why:`);
      process.stdout.write(`\n\n${chalk.red(err.message)}\n\n`);
      process.exit(1);
    }

    process.stdout.write(`\n\nLinting your manifest now.  This make take a moment...`);

    // lint our manifest
    var logger = lintManifest(ctx.manifest, false);
    var messages = logger.all();

    process.stdout.write(`\n\nAnd the results are in!  `);

    // bail out early if no issues
    if (messages.length === 0) {
      process.stdout.write(`Everything looks perfect!  You're good to go.\n\n`);
      process.exit(0);
    }

    // count up the results for the output
    var sum = countBy(messages, "type");
    process.stdout.write(`\n\nErrors: ${sum.error}   Warnings: ${sum.warning}    Suggestions: ${sum.suggestion}\n\n`);

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

      process.stdout.write(message);
    });

    process.stdout.write(`\n\n`);

  });
}
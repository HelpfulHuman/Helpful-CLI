import chalk from "chalk";
import figures from "figures";

/**
 * Notify the user of an error (if any), otherwise log out
 * the success message for the command.
 *
 * @param  {Error} err
 * @param  {Object} ctx
 */
export default function (err, ctx) {
  if (err) printError(err);
  else printSuccess(ctx);
}

/**
 * Handles the formatting for displaying errors.
 */
function printError (err) {
  process.stdout.write(`
  ${chalk.bold.bgRed(figures.cross + " Failure!  Error!  Sadness!")}\n\n
  Oh man, this is embarrassing but we weren't able to complete the operation.\n\n
  ${chalk.bold("Why?")}\n
  ${chalk.red(err.message)}
  `);
}

/**
 * Handles the formatting for displaying the success message.
 */
function printSuccess (ctx) {
  process.stdout.write(`
  ${chalk.bold.green(figures.tick + " Success!")}\n\n
  We successfully added the package's contents to your current directory.\n\n
  `);
}
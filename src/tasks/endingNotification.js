import chalk from "chalk";

/**
 * Notify the user of an error (if any), otherwise log out
 * the success message for the command.
 */
export default function (err) {
  if (err) printError(err);
  else printSuccess(this);
}

function printError (err) {

}

function printSuccess (ctx) {
  console.log(chalk.bold().green("Success!"));
  console.log(`
  Good news, everyone!\n
  We were able to add ${ctx.name} to your current directory.
  `);
}
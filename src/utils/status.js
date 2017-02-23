import chalk from "chalk";

/**
 * Create a new status log.
 *
 * @param  {String} message
 * @param  {Number} length
 * @return {Object}
 */
export function report (message, length = 50) {
  process.stdout.write(fitLength(message, length));
}

/**
 * Formats the string to meet the desired length using spaces.
 *
 * @param  {String} message
 * @param  {Number} length
 * @return {String}
 */
function fitLength (message, length) {
  if (message.length > length) {
    return message.substr(0, length);
  }

  if (message.length < length) {
    var filler = new Array(length - message.length).join('.');
    return message + filler;
  }

  return message;
}

/**
 * Log a success status update.
 *
 * @param  {String} message
 */
export function complete (message = "Ok!") {
  process.stdout.write(message + "\n");
}

/**
 * Log a failure status update.
 *
 * @param  {String} message
 */
export function fail (message = "Fail.") {
  process.stdout.write(chalk.red(message) + "\n");
}
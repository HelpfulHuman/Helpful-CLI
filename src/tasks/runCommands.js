import sh from "shelljs";
import { eachSeries } from "async";
import processText from "../utils/processText";
import * as status from "../utils/status";

/**
 * Spawn async child processes that can be used to run the setup
 * commands specified in the template's helpful.json manifest file.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  // get the commands to run
  var commands = ctx.manifest.run;

  // ensure that the commands variable is an array
  commands = (Array.isArray(commands) ? commands : []);

  // short circuit if we have no commands
  if (commands.length === 0) return next();

  status.report("Running the specified set up commands");

  // change to the target directory
  sh.cd(ctx.paths.target);

  // run each command in a series
  eachSeries(commands, processCommand.bind(null, ctx), (err) => {
    if (err) status.fail();
    else status.complete();
    next(err);
  });
}

/**
 * Parse the command text and run it.
 *
 * @param  {Object} op
 * @param  {Callback<Error>} next
 */
function processCommand (ctx, op, next) {
  // process the command to run
  var cmd = processText(ctx, op.cmd);

  // run the formatted command
  sh.exec(cmd, function (code, stdout, stderr) {
    if (code !== 0) next(new Error(stderr));
    else next();
  });
}
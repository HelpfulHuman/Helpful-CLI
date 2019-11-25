import inquirer from "inquirer";

/**
 * Ask the questions specified in the helpful.json manifest.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  // get the questions that we're going to ask
  var questions = ctx.manifest.ask;

  // ensure that we have an array to work with
  questions = (Array.isArray(questions) ? questions : []);

  // skip the wizard if no questions available
  if (questions.length === 0) return next();

  process.stdout.write("\n\nTime to get some input:\n\n");

  // TODO overwrite the existing "when" functions with our abstraction

  // ask the questions and collect input
  inquirer
    .prompt(questions)
    .then(function (answers) {
      ctx.input = answers;
      process.stdout.write("\nGreat, thanks!\n\n\n");
      next();
    })
    .catch(next);
}
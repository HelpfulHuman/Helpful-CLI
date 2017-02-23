import inquirer from "inquirer";

/**
 * Ask the questions specified in the helpful.json manifest.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  return next(); // TEMP BYPASS
  // format the questions from OUR format to inquirer's
  var questions = this.manifest.questions.map(formatQuestion);
  // ask the questions and collect input
  inquirer.prompt(questions, (err, answers) => {
    // add the answers to the context if there are no errors
    if ( ! err) this.input = answers;
    next(err);
  });
}

/**
 * Act as an abstraction layer between our structure/syntax for questions
 * and inquirer's.
 *
 * @param  {Object[]} questions
 * @return {Object[]}
 */
function formatQuestion (q) {
  return q;
}
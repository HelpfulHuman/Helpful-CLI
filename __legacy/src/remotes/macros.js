import github from "./github";

/**
 * Short-circuit the fetchRemotes command by first checking if the given
 * source path is a Helpful Human repository macro.
 *
 * @param  {String} source
 * @param  {String} dest
 * @param  {Callback<Error, Boolean>} next
 */
export default function (source, dest, next) {
  var macro = MACROS[source];
  if ( ! macro) return next();
  github(macro, dest, next);
}

/**
 * Available macros
 */
const MACROS = {
  react: "helpfulhuman/react-project"
};
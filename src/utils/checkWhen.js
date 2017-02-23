import vm from "vm";
import util from "util";

/**
 * Check a when evaluation safely in a node VM.
 *
 * @param  {Object} ctx
 * @param  {Any} val
 * @return {Boolean}
 */
export default function (ctx, val) {
  if ( ! val) return true;
  if (typeof val === "function") return val(ctx.input);
  if (typeof val !== "string") {
    throw new Error("When values must be a function or string that can be evaluated!");
  }

  var script = new vm.Script(`var result = ${val}`);
  var context = new vm.createContext(Object.assign({}, ctx.input));
  var capture = util.inspect(context.runInContext(script));

  return !!capture.result;
}
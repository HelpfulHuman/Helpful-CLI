/**
 * Creates a logger utility for building up output across functions.
 * Pass in `true` to enable "strict mode", which will throw an error
 * when the fail() method is called.
 *
 * @param  {Boolean} strictMode
 * @return {Object}
 */
export default function (strictMode) {
  var messages = [];
  return {
    all () {
      return messages.slice(0);
    },
    suggest (message) {
      report.messages.push({ type: "suggestion", message });
    },
    warn (message) {
      report.messages.push({ type: "warning", message });
    },
    fatal (message) {
      if (strictMode) throw new Error(message);
      report.messages.push({ type: "error", message });
    }
  };
}
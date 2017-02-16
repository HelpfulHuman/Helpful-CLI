import { applyEachSeries } from "async";
import createContext from "./tasks/createContext";
import validateSource from "./tasks/validateSource";
import saveLocalCopy from "./tasks/saveLocalCopy";
import validateManifest from "./tasks/validateManifest";
import askQuestions from "./tasks/askQuestions";
import copyFiles from "./tasks/copyFiles";
import runSetupCommands from "./tasks/runSetupCommands";
import end from "./tasks/endingNotification";

/**
 * The operational tasks that occur (in order).
 */
const tasks = [
  validateSource,
  saveLocalCopy,
  validateManifest,
  askQuestions,
  copyFiles,
  runSetupCommands,
];

/**
 * Start the scaffolding process using a path that either
 * exists locally or at a remote URL.
 *
 * @param  {String} sourcePath
 * @param  {String} targetPath
 */
export function add (sourcePath, targetPath) {
  var ctx = createContext(sourcePath, targetPath);
  applyEachSeries(tasks, ctx, (err) => end(err, ctx));
}

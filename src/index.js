import { applyEachSeries } from "async";
import createContext from "./tasks/createContext";
import fetchRemote from "./tasks/fetchRemote";
import validateManifest from "./tasks/validateManifest";
import askQuestions from "./tasks/askQuestions";
import copyFiles from "./tasks/copyFiles";
import runSetupCommands from "./tasks/runSetupCommands";
import end from "./tasks/endingNotification";

/**
 * The operational tasks that occur (in order).
 */
const tasks = [
  fetchRemote,
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
export function install (sourcePath, targetPath) {
  var ctx = createContext(sourcePath, targetPath);
  applyEachSeries(tasks, ctx, (err) => end(err, ctx));
}

/**
 * Expose manifest validation as a standalone task.
 *
 * @param  {String} manifestPath
 */
export function validate (manifestPath) {
}
import { each } from "async";
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
const TASKS = [
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
 */
export default function main (sourcePath, targetPath) {
  var ctx = createContext(sourcePath, targetPath);
  each(TASKS.map(t => t.bind(ctx)), end.bind(ctx));
}

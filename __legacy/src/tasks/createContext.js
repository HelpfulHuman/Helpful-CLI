import path from "path";

/**
 * Sets up the initial structure of the context object using only
 * a sourcePath and targetPath string.
 *
 * @param  {String} sourcePath
 * @param  {String} targetPath
 * @return {Object}
 */
export default function createContext (sourcePath, targetPath) {
  return {
    manifestName: "helpful",
    paths: {
      source: sourcePath,
      targetRaw: targetPath,
      target: path.resolve(targetPath),
      temp: null,
      template: null
    },
    input: {},
    manifest: {}
  };
}
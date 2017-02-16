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
    source: {
      type: null,
      path: sourcePath,
      url: null
    },
    target: {
      originalPath: targetPath,
      path: path.resolve(targetPath)
    },
    input: {},
    manifest: {
      ask: [],
      copy: {},
      run: []
    }
  };
}
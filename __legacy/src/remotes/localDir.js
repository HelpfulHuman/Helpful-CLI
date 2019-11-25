import fs from "fs-extra";

/**
 * Copy files from a local directory to a temp directory if the
 * given path is in fact a local directory.
 *
 * @param  {String} source
 * @param  {String} dest
 * @param  {Callback<Error, Boolean>} done
 */
export default function (source, dest, done) {
  if ( ! fs.existsSync(source)) return done();
  fs.copy(source, dest, (err) => done(err, !err));
}
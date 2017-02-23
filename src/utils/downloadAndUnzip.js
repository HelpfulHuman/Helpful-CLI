import request from "request";
import unzip from "unzip";
import fs from "fs-extra";

/**
 * Attempts to download and unzip the given URL contents into
 * the given destination folder.  Should create the folder if it
 * does not exist already.
 *
 * @param  {String} url
 * @param  {String} dest
 * @param  {Callback<Error>} done
 */
export default function (url, dest, done) {
  // make sure our target directory exists
  fs.ensureDirSync(dest);

  // create write stream into the folder
  var output = fs.createWriteStream(dest);

  // attempt to stream .zip contents into dest folder
  var stream = request
    .get(url)
    .pipe(unzip.Parse())
    .pipe(output);

  // handle errors
  stream.on("error", done);

  // take care of any finishing tasks
  stream.on("finish", () => done());

}

import createRemote from "../utils/createRemote";
import downloadAndUnzip from "../utils/downloadAndUnzip";

export default createRemote(
  /^(?:https?\:\/\/)?(?:www\.)?(?:github\.com\/)?([\w\-]+\/[\w\-]+)/,
  "https://github.com/$1", ///blob/master/helpful.json",
  "https://github.com/$1/archive/master.zip",
  downloadAndUnzip
);
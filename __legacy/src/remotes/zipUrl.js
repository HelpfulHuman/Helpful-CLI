import createRemote from "../utils/createRemote";
import downloadAndUnzip from "../utils/downloadAndUnzip";

export default createRemote(
  /(.+)\.zip$/,
  "$1.zip",
  "$1.zip",
  downloadAndUnzip
);
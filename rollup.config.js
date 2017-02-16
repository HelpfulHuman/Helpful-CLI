import commonjs from "rollup-plugin-commonjs";
import buble from "rollup-plugin-buble";

export default {
  entry: "src/index.js",
  treeshake: false,
  format: "cjs",
  dest: "dist/index.js",
  plugins: [
    commonjs(),
    buble()
  ],
  onwarn (message) {
    if (/external dependency/.test(message)) return;
    console.error(message);
  }
};
import buble from "rollup-plugin-buble";

export default {
  entry: "src/index.js",
  treeshake: false,
  format: "cjs",
  dest: "dist/index.js",
  plugins: [
    buble()
  ],
  onwarn (message) {
    if (/external dependency/.test(message)) return;
    console.error(message);
  }
};
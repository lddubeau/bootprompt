/* eslint-env node */
import sourceMaps from "rollup-plugin-sourcemaps";
import fs from "fs";
import path from "path";
import deepcopy from "deepcopy";
import { terser } from "rollup-plugin-terser";
import multiEntry from "rollup-plugin-multi-entry";

const resolvedBootprompt = path.resolve(__dirname, "./build/js/bootprompt");

function alsoMinified(input) {
  const bundles = Array.isArray(input) ? input : [input];

  const ret = [];
  for (const bundle of bundles) {
    const copy = deepcopy(bundle);
    copy.output.file = copy.output.file.replace(/.js$/, ".min.js");
    copy.plugins.push(terser());
    ret.push(bundle, copy);
  }

  return ret;
}

export default alsoMinified([{
  input: "build/js/bootprompt.js",
  output: {
    file: "build/dist/bootprompt.js",
    format: "umd",
    name: "bootprompt",
    sourcemap: true,
    globals: {
      jquery: "$",
      bootstrap: "",
    },
  },
  plugins: [
    sourceMaps(),
  ],
}, {
  input: "build/js/locales/*.js",
  output: {
    file: "build/dist/bootprompt.locales.js",
    format: "umd",
    sourcemap: true,
    paths: {
      [resolvedBootprompt]: "./bootprompt",
    },
    globals: {
      [resolvedBootprompt]: "bootprompt",
    },
  },
  external: ["../bootprompt"],
  plugins: [
    sourceMaps(),
    multiEntry(),
  ],
}, ...fs.readdirSync("build/js/locales").filter(x => /.js$/.test(x)).map(x => ({
  input: `build/js/locales/${x}`,
  output: {
    file: `build/dist/locales/${x}`,
    format: "umd",
    sourcemap: true,
    // Somehow the path for loading bootprompt is messed up if this paths entry
    // is not used.
    paths: {
      [resolvedBootprompt]: "../bootprompt",
    },
    globals: {
      [resolvedBootprompt]: "bootprompt",
    },
  },
  external: ["../bootprompt"],
  plugins: [
    sourceMaps(),
  ],
}))]);

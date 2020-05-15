let resolve = require("@rollup/plugin-node-resolve");
let commonjs = require("@rollup/plugin-commonjs");
let json = require('@rollup/plugin-json');
let pkg = require('./package.json');
let typescript = require('rollup-plugin-typescript2');
const external = Object.keys(pkg.dependencies || {});
let {
    terser
} = require('rollup-plugin-terser');

export default {
    external: external,
    input: "src/index.ts",
    output: [{
        file: "dist/index.js",
        format: "cjs"
    }],
    plugins: [
        json(),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        resolve(),
        commonjs({
            include: [
                "node_modules/**"
            ]
        }),
        terser()
    ]
}
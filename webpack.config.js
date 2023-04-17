const path = require("path");
const nodeExternals = require("webpack-node-externals");//fix bug for express
const WebpackShellPlugin = require("webpack-shell-plugin");//run command after build finish
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");//resolve module in tsconfig.json

const {NODE_ENV = "production"} = process.env;
module.exports = {
    entry: "./src/server.ts",
    watch: NODE_ENV === "development",
    mode: NODE_ENV,
    target: "node",
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "server.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [
            new TsconfigPathsPlugin({
                /* options: see below*/
            }),
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["ts-loader"]
            }
        ]
    },
    // plugins: [
    //     new WebpackShellPlugin({
    //         obBuildEnd: ["yarn run:dev"]
    //     })
    // ]
}
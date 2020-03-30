require('dotenv').config();
const path = require("path");
const webpack = require('webpack');

module.exports = () => {
    console.log(process.env.PORT);
    return {
        target: "node",
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'inventoryServer.js',
        },
        module: {
            rules: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    node: "8.10"
                                }
                            }
                        ]
                    ]
                }
            }]
        },
        resolveLoader: {
            modules: [
                __dirname + '/node_modules'
            ]
        },

        plugins: [
            new webpack.DefinePlugin(
                    {
                    'process.env.PORT': process.env.PORT,
                    'process.env.SIGNATURE': JSON.stringify(process.env.SIGNATURE),
                    'process.env.URI': JSON.stringify(process.env.URI),
                    'process.env.LOGGER_URI': JSON.stringify(process.env.LOGGER_URI),
                    'process.env.LOGGER_LEVEL': JSON.stringify(process.env.LOGGER_LEVEL),
                    'process.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET),
                    'process.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET),
                    'process.env.SU_ADMIN': JSON.stringify(process.env.JWT_SECRET),
                    'process.env.SU_ADMINP': JSON.stringify(process.env.SU_ADMIN_PASS),

                }
            )
        ],
    }
}
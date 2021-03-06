const path = require('path');
const buildPath = path.resolve(__dirname, 'dist');
const srcAppPath = path.resolve(__dirname, 'src-app');
const srcStaticPath = path.resolve(__dirname, 'src-static');

const merge = require('webpack-merge');

// create html based on the bundled js name
const HtmlPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlPlugin({
    template: './src-template/index.html',
    // inject the script in body tag
    inject: 'body',
    // true doesn't work, need a object if want to enable minify
    // https://github.com/kangax/html-minifier#options-quick-reference
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
    },
    excludeChunks: ['sw'], // is entry property name
    cache: true,
});

// Use name instead of chunk id. Benefit both development and production.
// https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
const webpack = require('webpack');
const namedModulesPlugin = new webpack.NamedModulesPlugin(
);

// gzip compress
// I disabled this plugin.
// MySwPlugin and myPwaManifestPlugin hooks into 'done',
// And Compression-webpack-plugin hooks into 'emit'.
// https://github.com/webpack-contrib/compression-webpack-plugin/blob/a389f2dbdda9f084487618d8e8b9e0c210515c33/src/index.js#L148-L154
// So compress will execute before two my own plugin.
// Which cause 'cacheVersion not defined' error in sw.js.gz
// Compression should be very easy to handle in shell or Nginx.
// There is no need to figure out how to do it here.
// const CompressionPlugin = require('compression-webpack-plugin');
// const compressionPlugin = new CompressionPlugin({
//     filename: '[path].gz[query]', // default '[path].gz[query]'
//     // brotli available after Node 11.7
//     // algorithm: 'brotliCompress',
//     algorithm: 'gzip', // default 'gzip'
//     compressionOptions: {level: 9}, // default 9
//     threshold: 0, // default 0. Only compress asset bigger than this threshold
//     minRatio: 0.8, // default 0.8. Only compress asset will achieve this ratio.
//                    // 1 to compress all. 0.8 will filter images.
//     deleteOriginalAssets: false, // default false
//     // cache in node_modules/.cache/
//     cache: true,
// });

// two options for service worker, I already put the two demonstrations in this file.:
// 1. Set an entry for sw.js.
//    This works for build, but doesn't work for webpack-dev-server.
//    Because dev server put the whole file in an object and passes it to a function
//    function(){}({function(){eval("YourSwCode")},})
//    and will not run in my chrome maybe since serviceWorker has different environment than window.
//    So all listener defined in it will not take effect.
//    But this way make your sw.js through the webpack process, which means will be transpiled.
// 2. Use ServiceWorkerWebpackPlugin or NekR/offline-plugin(more stars).
//    sw.js will not be transpiled, but will work in development
//    mode. And you could use serviceWorkerOption for cache.

// 1st option for service worker
const srcSwPath = path.resolve(__dirname, 'src-service-worker');
// 2nd option for service worker
// const swPath = path.resolve(__dirname, 'src-service-worker/sw.js');
// const ServiceWorkerPlugin = require('serviceworker-webpack-plugin');
// const serviceWorkerPlugin = new ServiceWorkerPlugin({
//     entry: swPath,
// });

// enable HMR
const hmrPlugin = new webpack.HotModuleReplacementPlugin()

// My plugin 1: insert webpackGeneratedAssets and cacheVersion
// into sw.js for 1st option for service worker
// https://github.com/kossnocorp/on-build-webpack/issues/5#issuecomment-432192978
// todo: fs operation can not be used in webpack-dev-server, since no file created. 
//       use fs operation will cause bundle process fail.
//       Should use webpack api instead or read assets from
//       http://localhost:3000/webpack-dev-server.
const distSwPath = path.resolve(buildPath, 'sw.js');
const fs = require('fs');
const mySwPlugin = {
    apply: (compiler) => {
        // https://github.com/webpack/webpack/blob/3b344f24741bf7e55277d7e62134ad4bb64ac945/lib/Stats.js
        // assets: [
        //     {
        //         "name": "static/icon/16x16.c92b85a5b907c70211f4.ico",
        //         "size": 3870,
        //         "chunks": [],
        //         "chunkNames": [],
        //         "emitted": true
        //     }, ...
        // ]
        compiler.hooks.done.tap('mySwPlugin', (stats) => {
            let oldString = fs.readFileSync(distSwPath); //read existing contents into data
            let fd = fs.openSync(distSwPath, 'w+');
            let now = new Date();
            let forceTwoDigit = (s) => s.length === 1 ? '0' + s : s;
            let nowYYYYMMDDhhmmss =
                now.getFullYear().toString() +
                forceTwoDigit((now.getMonth() + 1).toString()) +
                forceTwoDigit(now.getDate().toString()) + '-' +
                forceTwoDigit(now.getHours().toString()) +
                forceTwoDigit(now.getMinutes().toString()) +
                forceTwoDigit(now.getSeconds().toString());
            let newString = new Buffer(
                'const cacheVersion="' + nowYYYYMMDDhhmmss + '";' +
                'const webpackGeneratedAssets=' +
                JSON.stringify(stats.toJson().assets
                    .map(i => i.name)
                    .filter(i => i !== 'sw.js') // remove sw.js
                    .filter(i => i !== 'index.html') // replace index.html with /
                    .filter(i => !/.*\.gz$/.test(i)) // remove gzip files
                    .concat('/') // add redirection page
                    .concat(pwaManifestName) // add manifest, it is not in the stats object
                ) + ';'
            );
            // write new string
            fs.writeSync(fd, newString, 0, newString.length, 0);
            // append old string or fs.appendFile(fd, oldString);
            fs.writeSync(fd, oldString, 0, oldString.length, newString.length);
            fs.close(fd);
        });
    }
};

// My plugin 2: generate pwa manifest
// todo: update file name, or inline it into index.html
const pwaManifestName = 'pwa-manifest.json';
const distPwaManifestPath = path.resolve(buildPath, pwaManifestName);
const myPwaManifestPlugin = {
    apply: (compiler) => {
        compiler.hooks.done.tap('myPwaManifestPlugin', (stats) => {
            require('fs').writeFileSync(
                distPwaManifestPath,
                JSON.stringify({
                    "name": "React App Sample",
                    "short_name": "React App",
                    "start_url": "/index.html",
                    "icons": [
                        {
                            "src": "favicon.ico",
                            "sizes": "64x64 32x32 24x24 16x16",
                            "type": "image/x-icon"
                        }
                    ],
                    "theme_color": "#000000",
                    "background_color": "#ffffff",
                    "display": "standalone"
                })
            );
        });
    }
};

const config = {};
config.common = {
    entry: {
        'immutable/js/main': './src-app/main.js',
        // 1st option for service worker
        'sw': './src-service-worker/sw.js',
    },
    module: {
        rules: [
            {
                include: [
                    srcAppPath,
                    // 1st option for service worker
                    srcSwPath
                ],
                test: /\.js$/,
                // Can not put babel options here, jest can not find this place
                // because I use webpack-merged to generate webpack configuration.
                use: {loader: 'babel-loader'},
            },
            // for css, it will be packaged in node_modules chunk
            // {
            //     test: /\.css$/,
            //     use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
            // },
            {
                include: [
                    srcStaticPath,
                ],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // outputPath have to be relative path,
                            // absolute path won't work in dev server.
                            outputPath: './immutable',
                            name() {
                                // if under dev environment, no hash.
                                return process.argv.some(i => i === 'dev') ?
                                    '[folder]/[name].[ext]' :
                                    '[folder]/[name].[hash:20].[ext]'
                            },
                        },
                    }
                ]
            },
        ],
    },
    plugins: [
        htmlPlugin,
        namedModulesPlugin,
        // 2nd option for service worker
        // serviceWorkerPlugin,
    ],
    optimization: {
        // SplitChunksPlugin, separate vendor chunks
        splitChunks: {
            cacheGroups: {
                // only separate chunks from node_modules
                default: false,
                vendors: false,
                lib: {
                    // sync + async chunks
                    chunks: 'all',
                    // node_modules path
                    test: /node_modules/,
                    name: 'immutable/js/node_modules',
                },
            }

        }
    }
};
config.dev = {
    // https://webpack.js.org/configuration/mode/#mode-development
    mode: 'development',
    // [In most cases, cheap-module-eval-source-map is the best option]
    // (https://webpack.js.org/guides/build-performance)
    devtool: 'cheap-module-eval-source-map',
    // must have host, otherwise can not access by ip, only can access by localhost.
    devServer: {
        contentBase: buildPath,
        hot: true,
        port: 3000,
        host: "0.0.0.0",
    },
    // Don't use hash in development environment
    // https://webpack.js.org/guides/build-performance
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: buildPath,
        globalObject: 'this',
    },
    plugins: [
        hmrPlugin,
    ],
};
config.prod = {
    mode: 'production',
    // hash: corresponding to build.
    // chunkhash: corresponding to entrypoints. js+css+wasm
    // contenthash(recommended): corresponding to assets.
    // https://github.com/webpack/webpack.js.org/issues/2096
    output: {
        // sw.js don't need hash
        // filename: '[name].[contenthash].js',
        filename: (chunkData) => {
            return chunkData.chunk.name === 'sw'
                ? '[name].js'
                : '[name].[contenthash].js';
        },
        chunkFilename: '[name].[contenthash].js',
        path: buildPath,
        // default globalObject is window, which is wrong for sw
        globalObject: 'this',
    },
    // Plugins order matters. If two plugins hooks into the same phase,
    // first register below will execute first.
    plugins: [
        mySwPlugin,
        myPwaManifestPlugin,
        // compressionPlugin,
    ],
};

module.exports = (env) => {
    // merge two config object
    return merge(config.common, config[env]);
};


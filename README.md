`npm start` 
启动3000端口的webpack-dev-server。
在这个状态下，没有service-worker，所以测试比较容易。

`npm test`
打开jest test runner。

`npm run build` 
build到dist文件夹。自动生成版本信息到dist/version
这个状态下，是有service-worker的，所以一定要用incognito，不然很可能有意外。

`deploy.sh`
发布到服务器上，会自动追加版本历史记录。
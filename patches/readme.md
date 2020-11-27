# 补丁说明

```javascript

由于@vue/cli 4.4.6版本创建的多page项目(本项目)，配置publicPath为相对路径'./'不生效(https://cli.vuejs.org/zh/config/#publicpath),

且不允许直接修改config.output.publicPath(validateWebpackConfig (node_modules\@vue\cli-service\lib\util\validateWebpackConfig.js:34:11))

但是因为本项目特殊需求，希望打包的publicPath均为相对路径，因此更改上述validateWebpackConfig.js文件中的校验，作为@vue+cli-service+4.5.9.patch补丁的内容。
```

- `npm i patch-package --save-dev` 安装`patch-package`工具后，修改依赖文件`validateWebpackConfig.js`，通过运行`npx patch-package @vue/cli-service`创建了当前patch文件:`@vue+cli-service+4.5.9.patch补丁`

- 后续运行`npm install`或是`yarn install`命令时，会自动为依赖包打上上述生成的补丁。

---
title: <webpack>CommonsChunkPlugin与optimization-splitChunks
date: 2019-01-15 00:00:00
tags: [webpack]
categories: webpack
---

### CommonsChunkPlugin

- 配置文档：https://www.webpackjs.com/plugins/commons-chunk-plugin/

- 例子

```
//打包node_modules的公共代码
new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    chunks: commonChunks,//所有入口集合，如果不添加（文档里面说默认是所有入口），但是实际使用过程中不会打包所有入口公共代码，多以还是要添加为所有入口集合。
    minChunks(module, count) {
        return (
            module.resource &&
            /\.js$/.test(module.resource) && module.resource.indexOf(
                path.join(__dirname, '../node_modules')) === 0 && count >= 2
        )
    }
}),
//打包src下的公共代码
new webpack.optimize.CommonsChunkPlugin({
    name: 'commonChunk',
    chunks: commonChunks,
    minChunks: function (module, count) {
        // 保证commonChunk中的内容都是js且是scr下面调用的
        return (
            module.resource && /\.js$/.test(module.resource) &&
            module.resource.indexOf(
                path.join(__dirname, '../src')
            ) === 0 && count >= config.build.minChunks
        )
    }
}),
// webpackComonsChunk的执行环境，包含module的映射信息，会经常变化
new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
}),
```

### optimization.splitChunks

- 配置文档：https://webpack.js.org/plugins/split-chunks-plugin/

```
optimization: {
    minimize: false,
    splitChunks: {
        minSize: 0,
        // automaticNameDelimiter: '-',//文件名称分隔符默认'~'
        chunks: "all",//选择哪些块进行优化，可选值：all、async和initial
        cacheGroups: {
            //拆分a入口文件node_modules引入的模块
            vendorA: {
                name: 'vendors-a',
                test (module, chunks) {//匹配
                    let res = (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 &&
                        chunks.length == 1 &&
                        chunks[0].name == 'a'
                    )
                    return res
                },
                // priority: 1,//打包首选优先级更高的缓存组，默认组的优先级为负，配置enforce会选择所有组
                chunks: 'all',
                minSize: 0,
                enforce: true,//需要设置为true，否则会根据priority（优先级）等其他配置打包
                minChunks: 1
            },
            //所有入口src下公共模块
            commons: {
                name: 'commons',
                test (module, chunks) {
                    let res = (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(path.join(__dirname, '../src')) === 0 &&
                        chunks.length >= 2
                    )
                    return res
                },
                chunks: 'all',
                minSize: 0,
                enforce: true,
                minChunks: 1
            },
            //所有入口node_modules下公共模块
            vendor: {
                name: 'vendors',
                test (module, chunks) {
                    let res = (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 &&
                        chunks.length >= 2
                    )
                    return res
                },
                chunks: 'all',
                minSize: 0,
                enforce: true,
                minChunks: 1
            }
        },
    },
    //webpack运行文件
    runtimeChunk: {
        name: "manifest"
    },
},
```

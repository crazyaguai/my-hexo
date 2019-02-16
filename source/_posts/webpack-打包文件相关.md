---
title: webpack-打包文件相关
date: 2018-12-21 15:34:10
tags: [webpack]
categories: webpack
---

### 打包js

- 命令行：webpack entry<entry> output

```
webpack index.js bundle.js
```
- webpack配置文件

### 打包ES6

- babel-loader：https://www.webpackjs.com/loaders/babel-loader/
- babel配置：https://crazyaguai.github.io/2018/11/14/Babel%E9%85%8D%E7%BD%AE/

```
{
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader'
    }
}
```

#### 打包ts

### 处理css

- 处理css并提取公共代码
- style-loader 创建style标签写入html中
- css-loader js可以引入css

1. loader

```
{
    test: /\.css$/,
    use: ExtractTextPlugin.extract(
        {
            fallback: [{
                loader: 'style-loader'
            }],
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true,//是否压缩
                        module: false,//是否使用css Module
                    }
                },{
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('autoprefixer')()
                        ]
                    }
                }
            ]
        }
    )
}
```

2. plugin

```
new ExtractTextPlugin({
    filename: 'css/[name][hash].min.css',
    allChunks: false,//默认false，指定提取范围，设置为true时异步加载的也会被提取出来
})
```

### 处理sass

- 安装依赖

```
npm install sass-loader node-sass --save-dev
```

1. loader

```
{
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader',
            options: {
                // singletion: true,//放在一个style中，开启后sourceMap会失效
                sourceMap: true
            }
        },
        {
            loader: 'css-loader',
            options: {
                // minimize: true,
                sourceMap: true
            }
        }, {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: [
                    require('postcss-sprites')({
                        spritePath: 'dist/img/',
                        retina: true,//处理视网膜屏两倍大图,图片需要以@2x结尾
                    }),
                    require('autoprefixer')(),
                ]
            }
        },{
            loader: 'sass-loader'
        }
    ]
}
```

2. 压缩提取的css并且删除重复内容

```
 new OptimizeCSSPlugin({
    cssProcessorOptions: {
        safe: true
    }
}),
```

3. css tree-shaking(对于变量css无法使用)

```
new PurifyCss({
    paths: glob.sync([
        path.resolve(__dirname,'../src/a.js'),
        path.resolve(__dirname,'../index.html')
    ])
}),
```

### PostCss

- 安装

```
npm install postcss postcss-loader autoprefixer --save-dev
```

- Autoprefixer 添加浏览器前缀
- css-nano 压缩css
- css-next 使用css新语法（css Variables\custom selectors\calc）
- postcss-sprites 转换雪碧图
- 在sass-loader和css-loader之间使用

```
{
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: true,
        plugins: [
            require('postcss-sprites')({
                spritePath: 'dist/img/',
                retina: true,//处理视网膜屏两倍大图,图片需要以@2x结尾
            }),
            require('autoprefixer')(),
        ]
    }
}
```

### Tree Shaking

#### js Tree Shaking
- 使用场景：常规优化、使用第三方库的某一个功能
- https://www.webpackjs.com/guides/tree-shaking/
- lodash 需要配置babel babel-plugin-lodash插件
```
new webpack.optimize.UglifyJsPlugin()
```

#### css Tree Shaking

- 安装 purifycss-webpack
- glob-all 支持多路径

```
new PurifyCss({
    paths: glob.sync([
        path.resolve(__dirname,'../src/a.js'),
        path.resolve(__dirname,'../index.html')
    ])
})
```

### 图片处理

- file-loader
- url-loader
- img-loader
- postcss-sprites

```
{
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
        // {
        //     loader: 'file-loader',
        //     options: {
        //         publicPath: '',
        //         name: 'img/[name][hash].[ext]',
        //         // useRelativePath: true,
        //         outputPath: ''
        //     }
        // },
        {
            loader: 'url-loader',//转换base64
            options: {
                limit: 100,
                // publicPath: '',
                name: 'img/[name][hash].[ext]',
                outputPath: ''
            }
        },{
            loader: 'img-loader',//压缩图片(3.x版本参数不同)
            options: {
                pngquant: {
                    quality: 80
                }
            }
        }
    ]
}
```

### 字体文件处理

```
{
    test: /\.(eot|woff2?|ttf|svg|otf)$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 100,//配置是否生成单独文件
                // publicPath: '../',
                name: 'fonts/[name][hash].[ext]',
                outputPath: ''
            }
        }
    ]
}
```

### 第三方js库

- webpack.providePlugin 不用在文件中import，webpack会注入

```
webpack.providePlugin({
    $: 'jquery',
})
```

- 使用别名引入非node_modules文件 https://www.webpackjs.com/configuration/resolve/， 然后再配置providePlugin

```
resolve: {
    alias: {
        jquery$: path.resolve(__dirname,'src/jquery.js')
    }
}
```

- imports-loader

```
{
    test: path.resolve(__dirname,src/index.js),
    use:[{
        loader: 'imports-loader',
        options: {
            $: 'jqury'
        }
    }]
}
```

### 提前加载webpack代码

- 将webpack代码插入html中
- inline-manifest-webpack-plugin 提取manifest文件到html中，减少浏览器请求，与htmlwebpackplugin搭配可能会有BUG，推荐使用下边的
- html-webpack-inline-chunk-plugin

```
new HtmlInlineChunkPlugin({
    name: 'manifest'
})
```

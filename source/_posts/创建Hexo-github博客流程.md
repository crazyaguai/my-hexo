---
title: 创建Hexo+github博客流程
date: 2018-08-20 09:45:53
tags: [hexo]
categories: hexo
---

HEXO快速、简单且功能强大的 Node.js 博客框架。
https://hexo.io/zh-cn/
## 安装
1.全局安装git以及nodeJs
2.全局安装hexo
```
npm install -g hexo
```
3.新建项目文件夹
```
mkdir hexo-project
```
4.进入项目文件夹，初始化hexo
```
cd hexo-project
hexo init
```
5.安装依赖
```
npm install
```
6.启动服务
```
hexo server || hexo s
```
访问 http://127.0.0.1:4000/

7.此时可以在本地访问服务，下面进行提交代码到git的步骤，首先在 github (https://github.com/) 上创建项目，注意项目名字有格式要求必须为：[github用户名].github.io，否则不能使用，参考：https://github.com/crazyaguai/crazyaguai.github.io 名称。

8.安装hexo-deployer-git提交代码到git用，在项目中执行
```
npm install hexo-deployer-git --save
```
9.配置根路径_config.yml文件
```
deploy:
  type: git
  repo: https://github.com/crazyaguai/crazyaguai.github.io(你的项目地址)
  branch: master
```
10.配置完成就可以将Hexo博客提交代码到github上了，执行
```
hexo clean && hexo generate && hexo deploy || hexo c && hexo g && hexo d
```
11.打开你的github hexo项目地址查看，例如 https://crazyaguai.github.io/




## 目录结构
- _config.yml：全局配置文件
- package.json：依赖
- scaffolds：文章脚手架，根据文件夹下的配置构建文章
- source：新建文章保存在这个文件夹下，在此修改文章
- themes：主题目录




## _config.yml文件配置
### 根路径_config.yml配置
```
# Hexo Configuration
## Docs: http://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/
# Site 这里的配置，哪项配置反映在哪里，可以参考我的博客
title:  #站点名，站点左上角
subtitle:  #副标题，站点左上角
description:  #给搜索引擎看的，对站点的描述，可以自定义
author:  #默认在站点左下角可以看到
email: #邮箱
language: zh-CN #语言包设置。
# URL #访问地址等信息设置，可根据需要自己修改。
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: #访问域名
root: /
permalink: :year/:month/:day/:title/ #具体内容页的存储路径结构
tag_dir: tags #标签目录名
archive_dir: archives #归档目录名
category_dir: categories #分类目录名
# Directory #默认文章和生成目录设置
source_dir: source
public_dir: public
# Writing 文章布局、写作格式的定义
new_post_name: :title.md # File name of new posts
default_layout: post
auto_spacing: false # Add spaces between asian characters and western characters
titlecase: false # Transform title into titlecase
max_open_file: 100
filename_case: 0
highlight:
  enable: true
  backtick_code_block: true
  line_number: true
  tab_replace:
# Category & Tag 分类和标签设置
default_category: uncategorized
category_map:
tag_map:
# Archives 默认值为2，如果这里都修改为1，相应页面就只会列出标题，而非全文
## 2: Enable pagination
## 1: Disable pagination
## 0: Fully Disable
archive: 1
category: 1
tag: 1
# Server 本地预览服务信息，默认端口是4000，有需要的话可以自己修改
## Hexo uses Connect as a server
## You can customize the logger format as defined in
## http://www.senchalabs.org/connect/logger.html
port: 4000
logger: false
logger_format:
# Date / Time format 日期格式
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: MMM D YYYY
time_format: H:mm:ss
# Pagination 每页显示文章数，可以自定义
## Set per_page to 0 to disable pagination
per_page: 5
pagination_dir: page
# Disqus Disqus 插件，我们会替换成“多说”
disqus_shortname:
# Extensions 这里配置站点所用主题和插件
## Plugins: https://github.com/hexojs/hexo/wiki/Plugins
## Themes: https://github.com/hexojs/hexo/wiki/Themes
theme: light
exclude_generator:
# Deployment 站点部署到github要配置
## Docs: http://hexo.io/docs/deployment.html
deploy:
  type: github
  repository:
  branch: master
```

### 主题_config.yml配置
```
menu: #右上角导航菜单，冒号前面是菜单名，后面是访问路径。
  Home: /
  Archives: /archives
  About: /about

widgets: #站点右边栏，可以调整顺序和增减内容，会自动调用主题layout/_widget目录下的同名文件。
- search
- category
- tagcloud
excerpt_link: Read More #列表页里Read more链接名称，可以替换成’查看更多‘等。
plugins:
twitter: #右边栏要显示twitter展示的话，需要在此设置
  username:
  show_replies: false
  tweet_count: 5
addthis: #分享设置
  enable: true
  pubid:
  facebook: true
  twitter: true
  google: true
  pinterest: true
fancybox: true #图片效果，默认
google_analytics: #google_analytics统计ID
rss:  #生成RSS路径
```

## 常用命令
- hexo new "postName" #新建文章
- hexo new page "pageName" #新建页面
- hexo clean #清除缓存
- hexo generate #生成静态页面至public目录
- hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
- hexo deploy #将.deploy目录部署到GitHub
### 命令简写
- hexo n "我的博客" == hexo new "我的博客" #新建文章
- hexo p == hexo publish
- hexo g == hexo generate#生成
- hexo s == hexo server #启动服务预览
- hexo d == hexo deploy#部署


## Hexo主题相关
参考：http://www.ahonn.me/2016/12/15/create-a-hexo-theme-from-scratch/


## 添加搜索
参考：https://www.jianshu.com/p/2010ad07d960


## 分类和标签设置
参考：http://ijiaober.github.io/2014/08/05/hexo/hexo-04/、
https://www.jianshu.com/p/3d2e7b3ec182



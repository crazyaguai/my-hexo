---
title: docker常用命令
date: 2020-06-11 00:00:00
tags: [docker]
categories:  docker
---

### 启动

- 启动命令：sudo service docker start
- 设置开机自启：sudo chkconfig docker on

### image

#### 获取镜像

- sudo docker pull ubantu

#### 列出本地镜像

- sudo docker images

#### 修改已有的镜像

```
//启动镜像容器
sudo docker run -p 8080:8080 -t -i yxc_test:v2 /bin/bash
//在容器中添加内容，修改完成后使用 exit 退出
gem install json
//使用docker commit命令 提交更新后的副本
sudo docker commit -m "Added json gem" -a "Docker Newbee" 0b2616b0e5a8 ouruser/sinatra:v2
```

#### 进入运行中的容器

docker exec -it bb5806a80788 /bin/sh

#### 使用 Dockerfile 创建镜像

1. Dockerfile文件 http://www.dockerinfo.net/dockerfile%E4%BB%8B%E7%BB%8D
2. docker build创建镜像

- sudo docker build -t="yxc_test:v2" .
- -t 标记来添加 tag，指定新的镜像的用户信息。 “.” 是 Dockerfile 所在的路径（当前目录），也可以替换为一个具体的 Dockerfile 的路径

3. docker tag 命令来修改镜像的标签：sudo docker tag 5db5f8471261 ouruser/sinatra:devel

#### 导入本地镜像

- sudo cat ubuntu-14.04-x86_64-minimal.tar.gz  |docker import - ubuntu:14.04

#### 上传镜像到 Docker Hub

- sudo docker push ouruser/sinatra

#### 存出/载入镜像

- sudo docker save -o ubuntu_14.04.tar ubuntu:14.04
- sudo docker load --input ubuntu_14.04.tar || sudo docker load < ubuntu_14.04.tar

#### 移除本地镜像

- sudo docker rmi training/sinatra
- 在删除镜像之前要先用 docker rm 删掉依赖于这个镜像的所有容器

#### 批量移除镜像（需要先删除容器）

- docker rmi $(docker images -q)

### Docker容器

#### 启动容器

- sudo docker run -t -i ubuntu:14.04 /bin/bash
- -t 选项让Docker分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上， -i 则让容器的标准输入保持打开

#### 启动已终止容器

- docker start

#### 守护态运行

- 需要让 Docker 容器在后台以守护态（Daemonized）形式运行。此时，可以通过添加 -d 参数来实现
- 获取容器的输出信息，可以通过 docker logs 命令

#### 终止容器

- 使用 docker stop 来终止一个运行中的容器
- 终止状态的容器可以用 docker ps -a 命令看到
- docker restart 命令会将一个运行态的容器终止，然后再重新启动它

#### 删除容器

- 使用 docker rm 来删除一个处于终止状态的容器

#### 批量删除容器

- docker stop $(docker ps -q) & docker rm $(docker ps -aq)


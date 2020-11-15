---
title: linux基础操作
date: 2020-08-24 08:02:00
tags: [linux]
categories: linux
---

### linux版本

#### 内核版本

- https://www.kernel.org/
- 5.7.14 主版本呢号、次版本号、末版本号
- 次版本号基数->开发板、偶数->稳定版

#### 发行版本

- 开源，厂商定制
- redhat
- fedora
- centos
- ubuntu
- debian

#### 发行版本

### 帮助命令

#### man

- manual缩写
- 参数：数字(1-9)：指定从哪本man手册中搜索帮助；关键字：指定要搜索帮助的关键字。
- man 1 ls，man 7 ls
- 按 q 退出

#### help

- bash内建命令，用于显示bash内建命令帮助信息
- 内建命令使用 man buildin 获取
- help [选项] [参数]
- 选项：-d 显示描述，-m 按照man手册输出，-s 只输出内建命令的命令格式
- 默认选项类似 -m

#### info

- info [选项] [参数]
- 选项：-d：添加包含info格式帮助文档的目录；-f：指定要读取的info格式的帮助文档；-n：指定首先访问的info帮助文件的节点；-o：输出被选择的节点内容到指定文件。

### 软件安装

#### 软件包管理器

1. centos、redhat使用yum包管理器，包格式rpm
2. debian、ubantu使用apt包管理器，包格式deb

#### rpm

- 包格式：yarn-1.3.2-lp151.3.2.x86_64.rpm，uwsgi-devel-2.0.18-8.fc30.x86_64.rpm，软件名称(yarn)+软件版本+系统版本(el7)+平台(x86_64)

- 需要将rpm包下载到本地安装
- 命令:rpm -q 查询 -i 安装 -e 卸载
- rpm -qa 查询所有安装的rpm包
- rpm -q vim-common 查询单个包
- 如果有依赖关系需要安装相关依赖包
 
 #### yum
 
 - yum源，修改配置文件，参考阿里源 [地址](https://developer.aliyun.com/mirror/)
 - 常用命令
 
1. 列出所有可更新的软件清单命令：yum check-update
2. 更新所有软件命令：yum update
3. 仅安装指定的软件命令：yum install <package_name>
4. 仅更新指定的软件命令：yum update <package_name>
5. 列出所有可安裝的软件清单命令：yum list
6. 删除软件包命令：yum remove <package_name>
7. 查找软件包 命令：yum search <keyword>
8. 清除缓存命令:
yum clean packages: 清除缓存目录下的软件包
yum clean headers: 清除缓存目录下的 headers
yum clean oldheaders: 清除缓存目录下旧的 headers
yum clean, yum clean all (= yum clean packages; yum clean oldheaders) :清除缓存目录下的软件包及旧的headers
9. yum info <package_name>查看软件信息

#### 源代码编译安装

### 基本命令

#### pwd

- 显示当前路径

#### ls

- ls -l 显示详细内容
- ls -a 显示隐藏文件
- ls -r 逆向显示（默认文件名排序）ls -lrt 使用时间排序
- ls -R 递归显示
- ls -lh 按接近文件大小显示
- ls -Sl 由大到小排序 ls -Slr 由小到大排序
 
#### cd

- cd - 回到上一个路径

#### mkdir

- 创建目录 mkdir ./a ./b ./c 创建多个目录
- mkdir -p ./a/b/c 创建多级目录

#### cp

- cp -v 显示复制过程
- cp -r 复制文件夹
- cp -p 保留原有文件属性（时间等）
- cp -a 保留文件属主等属性

#### mv

- 文件移动、重命名操作

### 文本查看

#### cat

- 文本内容显示到终端
- cat -n 添加行号

#### head

- 查看文件开头
- head -5 ./a 开头5行

#### tail

- 查看文件结尾
- tail -5 ./a 结尾5行
- tail -f ./a 跟踪显示，有追加会更新显示

#### wc

- wc -l ./a 查看文件行数
- 统计文件内容信息
- -c 字节数、 -l 行数、 -m 字符数、 -w 字数、 -L 最长行的长度

### 打包、压缩、解压

#### tar打包压缩

- tar -cf ./etc-back.tar /etc 打包tc文件夹
- tar -czf ./etc-back.tar.gz /etc 打包tc文件夹，并通过gzip压缩
- -j 通过bzip2 压缩，添加bz2后缀 tar -cjf ./etc-back.tar.bz2 /etc
- bzip2安装：yum install -y bzip2

#### tar解压

- tar -xf ./etc-back.tar -C /root 解压并放到root目录
- -zxf 解压gzip格式
- -jxf解压bzip2格式

### vi

#### 正常模式

- i 进入插入模式（光标位置），按 esc 返回正常模式
- I 进入插入模式，光标在所在行开头
- a 进入插入模式，光标在单词后位置
- A 进入插入模式，光标在所在行结尾
- o 进入插入模式，光标所在行下添加新行
- O 进入插入模式，光标所在行上添加新行
- : 进入命令模式，按 esc 返回正常模式
- hjkl 移动光标
- yy 复制一行，3yy 复制三行，y$ 复制光标位置到结尾
- p 粘贴 
- dd 剪切一行，d$ 剪切光标到结尾，3dd 剪切三行
- u 插销操作
- ctrl+r 重做操作
- x 单个字符删除
- r+输入新字符，单个字符替换
- 输入行数，shift+g，跳转到指定行开头
- g 文本第一行，G 文本最后一行
- ^ 跳转行开头，$ 跳转行结尾

#### 插入模式

#### 命令模式

- set nu 显示当前所在行
- w 保存，w+文件名 保存到新文件
- q 退出，wq 保存退出，q! 不保存退出
- !+linux命令 执行linux命令，!ls
- /+文本 搜索命令 ，n 向下移动，N 向上移动
- s/旧字符/新字符，当前行查找替换，只替换第一个
- %s/旧字符/新字符，全局查找替换，只替换第一个
- %s/旧字符/新字符/g，全局替换
- 3,5s/旧字符/新字符/g，3-5行之间替换
- set+命令，修改 vi 配置

#### 可视模式

- v 字可视模式
- V 行可视模式
- ctrl+v 块可视模式，配合 d、l、I(大写i)可以进行块操作，d 删除、I 插入

#### 全局配置

- vim /etc/vimrc 在结尾添加配置，如：set nu

### 用户、权限管理

#### 用户管理

- id 查找用户，id root 查看root用户信息，id 当前用户信息
- useradd 新建用户，useradd yxc
- userdel 删除用户，userdel -r yxc 删除用户以及相关配置文件
- passwd 修改用户密码，passwd yxc 更改指定用户密码，passwd 更改当前用户密码
- usermod 修改用户属性，usermod -d /home/yxc1 yxc 修改用户家目录
- chage 修改帐号和密码的有效期限
- 查看所有用户：cat /etc/passwd
- /etc/shadow 用户密码信息

#### 用户组

- groupadd 新建用户组，groupadd g1
- groupdel 删除用户组
- usermod -g yxc g1 修改用户所属组
- 查看所有用户组 cat /etc/passwd
- vim /etc/password 编辑用户配置文件，yxc:x:1000:1001::/home/yxc:/bin/bash，x 是否需要密码登录
- /etc/group 用户组信息

#### su

- su - yxc 切换用户，使用后 exit 退出
- su -c ls root 切换用户执行命令，执行后退出

#### sudo

- 使用 visudo 配置用户权限

### 文件权限

- drwxr-xr-x. 2 root root       19 7月  20 22:23 test
- -rw-r--r--. 1 root root    10240 7月  20 22:23 text.tar
- 类型 d 文件夹， - 普通文件， b 块特殊文件，c 字特殊文件， l 符号链接，f 管道链接，s 套接字文件
- rwx 文件类型，9个字符，分三组，所属用户、所属组、其他用户权限
- r 读权限， w 写权限， x 执行权限。
- 数字表示 r=4, w=2，x=1
- 目录权限表示：x 进入目录， rx 显示目录文件名， wx 修改目录内的文件名
- 权限冲突时以属主权限为主

#### 修改权限

- chmod u+x a.txt, chmod 755 a.txt，chmod u=rwx ./a 设置权限 u(用户)、g(组)、o(其他)、a(全部)，+(增加)、-(减少)、=(设置)
- chown 更改属主、属组，chown yxc ./a，chown :g1 ./a
- chgrp 单独更改属组，不常用

### 网络管理

1. 网络状态查看

- net-tools
安装：yum -y install net-tools
ifconfig、route、netstat
普通用户需要输入 /sbin/ifconfig
mii-tool eth0 查看网卡物理链接情况
route -n 查看网关（路由）-n 不解析域名
- iproute2
ip、ss

2. 网络配置
3. 路由命令
4. 网络故障排除
5. 网络服务管理
6. 常用网络配置文件

### 进程

#### ps、top查看进程

- ps -f 显示UID、 -a 显示所有进程、 -l 更详细的显示（线程）
- pstree
- top 显示模式按 1 切换cpu统计模式 、显示模式按 s 修改更新时间 ，top -p 1888 按进程查询

#### 进程控制命令

- 优先级调整（NI）：

1. nice 范围i -20到19，值越小优先级越高，占用资源越多，nice -n 10 ./a.sh
2. renice 重新设置优先级，renice -n 15 1888

- 进程的作业控制：

1. jobs，jobs 显示后台进程，将后台运行的进程切换至前台，fg 1(后台进程代码) 召回制前台
2. & 符号，后台运行进程， ./ a,sh &
3. ctrl+z 挂起正在运行的程序，jobs 查看进程，fg 展示至前台，bg 后台运行

#### 信号

- 终端用户输入中断命令，通过信号机制停止程序运行
- kill -l 查看kill支持的信号
- kill -9 [进程号] 结束程序

#### 守护进程

- nohup 将程序以忽略挂起信号的方式运行起来
- 守护进程：独立于控制终端并且周期性地执行某种任务或等待处理某些发生的事件。它不需要用户输入就能运行而且提供某种服务，不是对整个系统就是对某个用户程序提供服务。守护进程一般在系统启动时开始运行，除非强行终止，否则直到系统关机都保持运行。守护进程的名称通常以d结尾，比如sshd、xinetd、crond等。守护进程的父进程是init进程。
- screen  只要Screen本身没有终止，在其内部运行的会话都可以恢复。screen 进入screen环境，ctrl+a d 退出screen环境，screen -ls 查看screen的会话，screen -r sessionId 回复会话，安装：yum install screen，screent 中 使用 exit 命令退出。

#### 系统日志

- /var/log 文件夹
- messages 系统常规日志，dmesg 内核运行信息，secure 安全日志，cron 周期计划任务日志

#### service 控制系统服务

#### systemctl 系统管理工具

- 系统已安装的服务 /usr/lib/systemd/system/

#### SELinux

- 安全增强组件，会降低性能，大多数生产环境关闭
- getenforce 查询当前SELinux状态
- 配置文件 /etc/selinux/config SELINUX=，修改后需要重启生效
- setenforce 0,临时修改配置，重启后失效

### 内存与磁盘管理

1. 内存与磁盘使用查看

内存使用查看
- free free -m, free -g，Swap交换分区（虚拟内存），在磁盘中，内存不够之后会分到虚拟内存中
- top

磁盘使用查看
- fdisk fdisk -l 查看磁盘
- parted -l 查看分区
- df df -h 查看分区以及挂载目录
- du 显示每个文件和目录的磁盘使用空间
- du 与 ls 区别，ls 是实际大小，du 是所占磁盘空间，默认linux系统分区的 block size 是4k，使文件只有1个字节，也会占用4k，ls 显示的文件大小比du显示的磁盘占用空间小

2. ext4 文件系统
3. 磁盘配额使用
4. 磁盘分区与挂载
5. 交换分区（虚拟内存）查看创建
6. 软件RAID使用
7. 逻辑券管理
8. 系统综合状态查看
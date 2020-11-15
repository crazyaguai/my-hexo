---
title: git-使用
date: 2020-10-06 14:11:44
tags: [git]
categories: git
---

### git 概念

- 工作区(workspace)：存放本地项目文件
- 暂存区(stage)：通过add命令将工作区文件存放到暂存区
- 本地仓库(repository)：使用commit命令将暂存区文件添加到本地仓库
- 远程仓库(remote)：github、gitlab等托管仓库

![git流程](https://wx4.sinaimg.cn/mw690/a4006e99ly1gjnexixmijj20ii06kaaf.jpg)

### git config

- 配置文件存储位置：--global /etc/gitconfig、--system ~/.gitconfig、--local 工作区/.git/config

```
-- global对当前用户所有仓库有效
-- local 对某个仓库有效（缺省等同于local）
-- system 对系统登录所有用户有效
// 显示 cinfig 配置
git config --list

// 设置用户
git config --global user.name "yxc"
git config --global user.email "邮箱号"

// 设置编辑器
git config --global core.editor emacs

// 配置比较工具
git config --global merge.tool vimdiff

// 添加配置
git config -–add site.name yiibai

// 删除配置
git config --local -–unset site.name

// 获取帮助
git help
```

### git clone

- 除了HTTP(s)以外，还支持SSH、Git、本地文件协议等

```
git clone <版本库的网址> <本地目录名>
```

### git add

- 将工作区修改添加到暂存区

```
// 添加当前目录所有修改
git add .

// 添加.gitignore忽略的修改
git add -f .

// 查看add状态，修改是否提交
git add -i .
```

### git clone

- 除了HTTP(s)以外，还支持SSH、Git、本地文件协议等

```
git clone <版本库的网址> <本地目录名>
```

### git status

- 显示工作目录和暂存区的状态

### git diff

```
// 显示工作区与暂存区的差别
git diff

// 显示暂存区与HEAD的差别
git diff --cached
git diff --staged

// 显示工作区与HEAD的差别
git diff HEAD

// 显示两个分支的差别
git diff dev1 master

// 显示工作区与其他分支差别
git diff dev1

// 显示两次commit的差别
git diff SHA1 SHA2

// 比较当前src目录与上次提交的差别
git diff HEAD -- ./src

// 比较HEAD与上次提交的差别
git diff HEAD^ HEAD

// --stat 参数查看简单diff结果
git diff --stat
```

### git commit

```
// 将暂存区提交
git commit -m "change"

// 将工作区提交 -a
git commit -am "change"

// 撤销上次commit，生成新的commit --amend
git commit --amend -m "new change"

// 不验证eslint提交
git commit --no-verify -m "修改"

// —fixup、—squash 当前添加的commit是之前某一个commit的修正，以后执行互动式的git rebase的时候，这两个 commit 将会合并成一个
git commit --fixup <commit>
```

### git reset

- soft: 不改变工作区和暂存区，只移动 HEAD 到指定 commit。
- mixed: 只改变暂存区，不改变工作区。这是默认参数，通常用于撤销git add。
- hard：改变工作区和暂存区到指定 commit。该参数等同于重置，可能会引起数据损失。

```
// 将当前分支指针倒3个commit，并改变暂存区
git reset HEAD~3

// 倒退指针，不改变暂存区
git reset --soft HEAD~3

// 倒退指针，同时改变工作区
git reset --hard HEAD~3

// 回到HEAD之前的commit
git reset HEAD^
```

- 一些撤销操作

```
// 撤销暂存区的内容
git reset || git reset --mixed

// 撤销暂存区以及工作区的修改（回到HEAD状态）
git reset --hard

// 撤销向暂存区提交的文件
git reset -- ./test.txt
```

### git rm

- 用于从工作区或者索引中删除文件，提交commit时会将文件的删除操作提交
- 如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 -f。

```
// 删除工作区的文件
git rm a.txt

// 如果已经修改并放到暂存区，需要使用 -f 删除
git rm -f a.txt

// 从暂存区删除文件
git rm --cached a.txt
```

### git branch

```
// 查看分支列表
git branch -a

// 创建分支并切换
git branch dev1

// 删除分支
git branch -d dev1
git branch -D dev1 // 强制删除

// 分支改名
git branch -m dev1
git branch -m dev1 dev2

// 查看分支 merge 情况
git branch --merged
git branch --no-merged
```

### git checkout

```
// 切换分支
git checkout dev1

// 将工作区文件恢复到HEAD状态
git checkout -- a.txt
git checkout HEAD -- a.txt

// 创建新分支，并切换到新分支
git checkout -b dev1 origin/master
```

### git merge

```
// 将dev1合并到当前分支
git merge dev1

// --abort 发生冲突后放弃合并
git merge --abort dev1
```

### git mergetool

### git log

```
// 显示当前分支日志
git log

// 显示其他分支日志
git log origin/master

// --graph 显示连线、--oneline 一行展示、--decorate 显示分支
git log --graph --oneline --decorate
```

### git stash

```
// 暂时保存没有提交的工作
git stash

// 列出所有暂时保存的工作
git stash list

// 恢复某个暂时保存的工作
git stash apply stash@{1}

// 恢复最近一次stash的文件
git stash pop

// 丢弃最近一次stash的文件
git stash drop

// 删除所有的stash
git stash clear
```

### git tag

```
// 列出tag
git tag

// 添加标签，不使用 -m 会进入描述编辑模式
git tag -a v1.0 -m "标签描述"

// 查看标签相关信息
git show v1.0

// 给某次commit打标签
git tag -a v1.1 {commitid}

// 推送标签到远端
git push v1.0

// 删除标签
git tag -d v1.0
git push --delete origin v1.0
```

### git fetch

```
// 拉取所有远程分支
git fetch origin

// 拉取指定远程分支
git fetch origin dev1

// 拉取当前远程分支
git fetch
```

### git pull

```
// 拉取远程分支与本地分支合并
git pull origin dev1
git pull origin dev1:dev2

// 本地分支与对应的远程合并
git pull origin
git pull

// 使用rebase模式合并
git pull --rebase origin dev1
```

### git push

```

```

### git remote

### git rebase

### git with ssh

- 参考：[官方文档](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

1. 查看是否存在ssh配置

```
// 查看.ssh文件夹里是否存在key相关文件(.pub文件)
cd ~/.ssh
```

2. 新建ssh key文件

```
// 执行命令后第一步需要设置key文件名称
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

3. 修改config文件，编辑.ssh文件夹下config文件，没有创建

```
Host *
  Preferredauthentications publickey
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/yxc_git
```

4. 添加秘钥

```
eval $(ssh-agent -s)
ssh-add ~/.ssh/yxc_git(你的秘钥)
```

5. github\gitlab上添加公钥

```
// 测试连接情况
ssh -T git@github.com
```



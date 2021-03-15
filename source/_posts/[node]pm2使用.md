---
title: <node>pm2使用
date: 2020-09-11 00:00:00
tags: [pm2,node]
categories:  node
---
### 安装 

```
npm install pm2@latest -g
yarn global add pm2
```

### 更新

```
npm install pm2@latest -g
pm2 update
```

### 命令

```
// 启动
pm2 start app.js
pm2 start app.js --watch --ignore-watch="node_modules"

# Specify an app name
--name <app_name>
# Watch and Restart app when files change
--watch
# Set memory threshold for app reload
--max-memory-restart <200MB>
# Specify log file
--log <log_path>
# Pass extra arguments to the script
-- arg1 arg2 arg3
# Delay between automatic restarts
--restart-delay <delay in ms>
# Prefix logs with time
--time
# Do not auto restart app
--no-autorestart
# Specify cron for forced restart
--cron <cron_pattern>
# Attach to application log
--no-daemon

// 重启
pm2 restart <app_name,all,id>
pm2 reload <app_name,all,id>
// 停止
pm2 stop <app_name,all,id>
// 删除
pm2 delete <app_name,all,id>
// 信息
pm2 [list|ls|status|jlist|prettylist]
// 日志
pm2 logs
pm2 logs --lines 200
// 清空日志
pm2 flush
// 监控信息
pm2 monit
pm2 plus
```

### 配置文件

- 生成示例配置文件：pm2 ecosystem
- 配置文件支持 script、json、YAML 格式，js文件必须以.config.js结束
- pm2.config.json示例

```javascript
module.exports = {
  apps : [{
    name: 'demo',
    script: 'demo.js',
    args: '-a 1 -b 2',// 可以通过 process.env.args 获取
    instances: 1,// 实例数
    exec_mode: 'cluster',// 运行模式
    max_memory_restart: '2G', // '100M'
    watch: true,
    ignore_watch: ["[\/\\]\./", "node_modules"],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    // 启动时可以使用 --env production切换环境变量
    env_production: {
      NODE_ENV: 'production'
    },
    // 日志配置
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: './logs/server-error.log',
    out_file: './logs/server-data.log',
    listen_timeout: 8000,// 监听程序等待的时间，超过时间未监听到会重启
    kill_timeout: 1000,// kill程序之前等待时间
    max_restarts: 10,// 错误重启次数
    restart_delay: 80000,// 重启崩溃应用前等待时间
    autorestart: true,// 错误自动重启配置
    cron_restart: '0 15 1 ? * *',// 自动重启，实例每天1点15触发
  }],
};
```

### 集群模式

```
pm2 start app.js -i max
```

### docker部署

- 使用pm2-runtime：npm install pm2 -g

```
CMD ["pm2-runtime", "pm2.config.js"]
```
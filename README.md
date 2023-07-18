#  tiku-server

> 这个模块包含题库系统tikusys和学生考试系统examsys，server目录是服务端nodeJS代码目录。
> 阿里云服务器终端只能上传文件而无法上传文件夹，因此在上线时，为了避免频繁的上传操作，直接将打包的最终文件前端和后端合并到一个dist文件夹中了。

### 上线命令
```
npm run build:online # 如果还没有安装依赖请先npm install
```
1. 等待执行完毕后项目根目录生成一个online文件夹，它包含dist(前端目录)、server(服务端目录)，
最终会根据online文件夹生成online.zip压缩包
只需把online.zip压缩包上传到服务器根目录的www/wwwroot/tiku-server目录中即可

### 在阿里云终端的/tiku-server目录输入如下命令执行线上脚本（确保文件夹内存在online.zip）：
```
./online.sh
```

###### (online.sh会生成一个backup.zip， 它是上一个线上版本的备份，如果新上线的版本出现紧急bug，可以通过删除online.zip并将backup.zip改名为online.zip然后执行./online.sh的方式来回滚代码)


解压完毕后，目录信息为
###### 前端 -> /www/wwwroot/tiku-server/online/dist/*
###### 后端 -> /www/wwwroot/tiku-server/online/server/server/*
最后一步需要重启node服务，node服务使用pm2管理，以下两个重启操作选择一个：
###### 1. 直接在终端输入 pm2 restart all
###### 2. 登录宝塔管理页面 通过pm2软件管理页面 点击重启

##### 上线完成

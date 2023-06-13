#  tiku-server

> 这个模块包含题库系统tikusys和学生考试系统examsys，server目录是服务端nodeJS代码目录。
> 阿里云服务器终端只能上传文件而无法上传文件夹，因此在上线时，为了避免频繁的上传操作，直接将打包的最终文件前端和后端合并到一个dist文件夹中了。

### 上线命令
```
npm run build:online
```
这会在项目根目录生成一个online文件夹。
online文件夹包含dist(前端目录)、server(服务端目录)
最终生成online.zip
将online.zip上传到服务器根目录的www/wwwroot/tiku-server中
在/tiku-server输入如下命令：
```
rm -rf online // 删除online文件夹(如果有)
unzip online.zip // 解压online.zip到当前文件夹
```
解压完毕后，目录信息为
###### 前端 -> /www/wwwroot/tiku-server/online/dist/*
###### 后端 -> /www/wwwroot/tiku-server/online/server/server/*
上线完成

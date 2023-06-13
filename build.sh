#!/bin/bash
set -o errexit


echo "====================Build start========================"

rm -rf ./online #先移除dist目录
mkdir ./online



#1. 进入服务端目录，打包node代码，把代码复制到online/server中
cd server
npm run build
cd ../
cp -r ./server/dist/ ./online/server/

#2. build前端代码，把代码复制到online/dist目录里
npm run build
cp -r ./dist/ ./online/dist/



echo "========================打包完成=============================="

echo "====================生成online.zip...========================"

rm -rf online.zip

zip online.zip -r online

echo "====================生成online.zip完成========================"
echo "==========================Done==============================="

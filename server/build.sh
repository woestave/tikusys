#!/bin/bash
set -o errexit

rm -rf ./dist #先移除dist目录
tsc #执行tsc编译 会生成新的dist目录

cp -r ./node_modules ./dist/server/ #将node_modules复制到dist/server中
cp -r ./package.json ./dist/server/ #将package.json复制到dist/server中(server/src/index.js引入了package并做了module_alias引用)

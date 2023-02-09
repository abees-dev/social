#!/bin/bash
tar --exclude="node_modules" --exclude="build" --exclude=".env" --exclude=".github"  --exclude=".idea" --exclude="deploy"   -zcvf SERVICE.tgz *
cp SERVICE.tgz ./deploy && rm -rf SERVICE.tgz
cd ./deploy && chmod +x deploy.sh

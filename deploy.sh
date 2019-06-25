#!/usr/bin/env bash

#vpsUser='yourUserName'
#vpsIp='1.2.3.4'
#vpsDistPath='/your/dist/path'
#vpsDistHistoryPath='/your/dist/History'
source /wbfile/knowledge/Network.cfg/vps/vps.sh

# Deploy dist folder to remote server
proxychains4 rsync -azPir --delete ./dist/ ${vpsUser}@${vpsIp}:${vpsDistPath}

# Appand deploy history
cat dist/version | ssh ${vpsUser}@${vpsIp} "\
	printf '\n  Deploy on: ' >> ${vpsDistHistoryPath} && \
	TZ=Asia/Hong_Kong date -R >> ${vpsDistHistoryPath} && \
	cat >> ${vpsDistHistoryPath} \
	"

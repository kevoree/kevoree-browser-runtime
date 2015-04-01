#!/usr/bin/env bash
rsync -urltv --delete --rsh="ssh -l $1 -p $3" ./dist/* $1@$2:~/www/runjs

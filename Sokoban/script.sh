#!/bin/bash
filename=$(readlink -f $1);
node --stack-size=16000 sokoban.js $filename $2
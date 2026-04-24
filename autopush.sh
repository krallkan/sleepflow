#!/bin/bash
cd /home/kralkan/sleepflow
git add -A
git diff --cached --quiet && exit 0
git commit -m "auto: progress snapshot $(date '+%H:%M')"
git push origin master

#!/bin/bash
# Remove trailing \r character from the file

set -e
file=$1

if [ "$1" ]; then
  sed -i 's/\r$//' $file
else
  sed -i 's/\r$//' scripts/start-web.sh
  sed -i 's/\r$//' scripts/test.sh
  sed -i 's/\r$//' scripts/wait.sh
fi
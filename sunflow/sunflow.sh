#/bin/sh
mem=1G
echo hello
java -Xmx$mem -server -jar sunflow.jar $*

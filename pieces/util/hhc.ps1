
$param1=$args[0]
$param2=$args[1]
write-host $param1 $param2
node ../../node_modules/@hop/hiphop/bin/hhc.mjs $param1 -o $param2

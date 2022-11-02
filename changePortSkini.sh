#!/bin/bash

# Assign the filename
filenames="./blocklySkini/scripts/main2.js ./client/archive/bundle.js ./client/archive/golem.html ./client/archive/sequenceurClient.js ./client/clientListe/clientListebundle.js ./client/configurateur/configReactbundle.js ./client/controleur/controleurbundle.js ./client/parametrage/paramReactbundle.js ./client/score/parto1bundle.js ./serveur/ipConfig.json"

# Take the search string
read -p "Enter the port to change : " search

# Take the replace string
read -p "Enter the new port : " replace

for filename in $filenames
do
    if [[ $search != "" && $replace != "" ]]; then
        echo Change port in $filename --- $search replaced by $replace
        sed -i "s/$search/$replace/" $filename
    fi
done
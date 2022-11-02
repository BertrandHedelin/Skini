Write-Host “-- Change Websocket port Skini --”

$listfiles = ".\blocklySkini\scripts\main2.js",
".\client\archive\bundle.js",
".\client\archive\golem.html",
".\client\archive\sequenceurClient.js",
".\client\clientListe\clientListebundle.js",
".\client\configurateur\configReactbundle.js",
".\client\controleur\controleurbundle.js",
".\client\parametrage\paramReactbundle.js",
".\client\score\parto1bundle.js",
".\serveur\ipConfig.json"

# La chaine de caracteres a trouver dans les fichiers et celle de remplacement
$stringToReplace = Read-Host "Port to replace"
$replacementString = Read-Host "New port"

# On boucle sur tous les fichiers pour effectuer les changements
foreach ($file in $listfiles)
{
    $fileContent = Get-Content -Path $file
    if ($fileContent -imatch $stringToReplace) {  
        (Get-Content $file) | Foreach-Object {$_ -replace $stringToReplace, $replacementString} | Set-Content $file
        Write-Host "$($file) -- $stringToReplace replaced by $replacementString" -ForegroundColor "Green"
    }
}
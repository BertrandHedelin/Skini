Write-Host “-- Change Websocket port Skini --”

$listfiles = "C:.\blocklySkini\scripts\main2.js",
"C:.\client\archive\bundle.js",
"C:.\client\archive\golem.html",
"C:.\client\archive\sequenceurClient.js",
"C:.\client\clientListe\clientListebundle.js",
"C:.\client\configurateur\configReactbundle.js",
"C:.\client\controleur\controleurbundle.js",
"C:.\client\parametrage\paramReactbundle.js",
"C:.\client\score\parto1bundle.js",
"C:.\serveur\ipConfig.json"

# La chaine de caracteres a trouver dans les fichiers et celle de remplacement
$stringToReplace = Read-Host "Port to replace"
$replacementString = Read-Host "New port"

# On boucle sur tous les fichiers pour effectuer les changements
foreach ($file in $listfiles)
{
    $fileContent = Get-Content -Path $file
    if ($fileContent -imatch $stringToReplace) {  
        (Get-Content $file) | Foreach-Object {$_ -replace $stringToReplace, $replacementString} | Set-Content $file
        Write-Host "$($file) -- $stringToReplace a été remplacé par $replacementString" -ForegroundColor "Green"
    }
}
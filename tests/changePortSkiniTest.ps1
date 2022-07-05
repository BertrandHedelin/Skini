Write-Host “Change Websocket port Skini”

# Votre dossier contenant les fichiers
$folder = "C:\Users\berpetit.AD\Documents\nodeskini\tests"

#$listfiles = ".\toto.js",
#".\titi.js",
#".\tutu.js"

$listfiles = ".\blocklySkini\scripts\main2.js",
".\client\archive\bundle.js",
".\client\archive\golem.html",
".\client\archive\sequenceurClient.js",
".\client\clientListe\clientListebundle.js",
".\client\configurateur\configReactbundle.js",
".\client\controleur\controleurbundle.js",
".\client\parametrage\paramReactbundle.js",
".\client\score\parto1bundle.js"

Write-Host $listfiles

# La chaine de caracteres a trouver dans les fichiers et celle de remplacement
$stringToReplace = Read-Host "Port to replace"
$replacementString = Read-Host "New port"

# On boucle sur tous les fichiers pour effectuer les changements
foreach ($file in $listfiles)
{
    #Write-Host $file
    $fileContent = Get-Content -Path $file

    if ($fileContent -imatch $stringToReplace) {  
        #(Get-Content $file) | Foreach-Object {$_ -replace $stringToReplace, $replacementString} | Set-Content $file
        #Write-Host "$($file) -- $stringToReplace a été remplacé par $replacementString" -ForegroundColor "Green"
    }
}
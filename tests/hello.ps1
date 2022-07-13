Write-Host “Change Websocket port Skini”
#test-Path ("toto.js")

# Votre dossier contenant les fichiers
$folder = "C:\Users\berpetit.AD\Documents\nodeskini\tests"

$listfiles = ".\toto.js",
".\titi.js",
".\tutu.js"

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
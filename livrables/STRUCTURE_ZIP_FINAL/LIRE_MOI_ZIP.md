# Structure du ZIP final (Léa)

## À mettre DANS le ZIP

```text
LivresGourmands_Etape3_Haoui_ElMarzouki.zip
├── Liens.txt
├── Dossier-conception.pdf
├── README_REMISE.md          (court rappel)
└── video_demo.mp4            (seulement si tu n’as pas de lien vidéo)
```

## À NE PAS mettre dans le ZIP

- `node_modules/`
- `.env`
- `backend/node_modules/`
- `frontend/node_modules/`
- `frontend/dist/` (optionnel, inutile pour la remise)
- fichiers temporaires, caches, logs

## Le code complet

Le code (surtout `frontend/` + `backend/`) doit être sur **GitHub**.  
Le ZIP Léa sert surtout aux **liens + PDF (+ vidéo)**.

## Commande PowerShell (exemple)

À lancer **uniquement** quand Liens.txt est complet :

```powershell
cd "C:\Users\2537063\Downloads\Projet_final_-_Etape_3_-_Conception_visuelle_Integration_front-end__back-end"

$out = "livrables\LivresGourmands_Etape3_REMISE_FINALE.zip"
New-Item -ItemType Directory -Force -Path "livrables\_zip_staging" | Out-Null
Copy-Item "livrables\Liens.txt" "livrables\_zip_staging\Liens.txt"
Copy-Item "docs\Dossier-conception.pdf" "livrables\_zip_staging\Dossier-conception.pdf"
Copy-Item "livrables\README_REMISE.md" "livrables\_zip_staging\README_REMISE.md"
# Copy-Item "chemin\vers\video.mp4" "livrables\_zip_staging\video_demo.mp4"   # si besoin

if (Test-Path $out) { Remove-Item $out }
Compress-Archive -Path "livrables\_zip_staging\*" -DestinationPath $out
Remove-Item "livrables\_zip_staging" -Recurse -Force
Write-Host "ZIP créé : $out"
```

Si `Liens.txt` contient encore « À COMPLÉTER », **n’appelle pas** ce fichier « REMISE_FINALE ».

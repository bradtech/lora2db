#!/bin/bash

CURRENTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Current Dir: ${CURRENTDIR}"

PARENTDIR=`dirname $CURRENTDIR`
echo "Parent Dir: ${PARENTDIR}"

LORA2DB="$PARENTDIR/packages/lora2db"
EXEMPLE_PACKAGES="$PARENTDIR/packages/lora2db-example-basic"

LORA2DB_VERSION=$(grep -o '"version": "[^"]*"' "$LORA2DB/package.json" | cut -d'"' -f4)

IFS='.' read -ra VERSION_ARRAY <<< "$LORA2DB_VERSION"

PATCH_VERSION=$((VERSION_ARRAY[2] + 1))

NEW_VERSION="${VERSION_ARRAY[0]}.${VERSION_ARRAY[1]}.$PATCH_VERSION"
echo "${NEW_VERSION}"

sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$LORA2DB/package.json"
rm "$LORA2DB/package.json.bak"

for dossier in "$PARENTDIR/packages"/*; do
    # Vérifie si l'élément est un dossier
    if [ -d "$dossier" ] && [ "$dossier" != "$EXEMPLE_PACKAGES" ]; then
        echo "Dossier trouvé : $dossier"
        
        # Vérifie si le fichier package.json existe dans le dossier
        if [ -e "$dossier/package.json" ]; then
            echo "Mise à jour de la version dans $dossier/package.json"
            
            # Utilise sed pour mettre à jour le dernier composant de la version dans le fichier package.json
            sed -i.bak "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$dossier/package.json"
            rm "$dossier/package.json.bak"
        else
            echo "Aucun fichier package.json trouvé dans $dossier"
        fi
    fi
done






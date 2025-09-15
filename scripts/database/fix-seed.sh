#!/bin/bash

# Archivo temporal para el nuevo seed
temp_file=$(mktemp)

# Corregir todos los INSERT statements sin createdAt y updatedAt
sed -E 's/INSERT INTO (translations|pages|page_contents|components|system_config) \(([^)]+)\) VALUES/INSERT INTO \1 (\2, "createdAt", "updatedAt") VALUES/g; s/\), locale_/), NOW(), NOW(), locale_/g; s/\);$/, NOW(), NOW());/g' scripts/database/seed.sh > "$temp_file"

# Reemplazar el archivo original
mv "$temp_file" scripts/database/seed.sh

# Hacer ejecutable
chmod +x scripts/database/seed.sh

echo "✅ Script de seeds corregido"
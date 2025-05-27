#!/bin/bash

# Crear directorio si no existe
sudo mkdir -p /var/www/frontend

# Asumimos que tienes permisos para escribir en /var/www (si no, usa sudo)
cd /var/www/frontend

# Si ya existe el repo, hacer pull. Si no, clonar.
if [ -d ".git" ]; then
  git pull origin main
else
  git clone https://github.com/juani8/marketplace.git .
fi

# Entrar a la carpeta del código fuente si corresponde (ajustar si tu React está en /src o en la raíz)
cd src

npm install

# Generar el build donde nginx lo busca
npm run build -- --outDir=/var/www/frontend/dist

# Asegurar permisos
sudo chown -R www-data:www-data /var/www/frontend/dist
sudo chmod -R 755 /var/www/frontend/dist

# Reiniciar nginx
sudo systemctl restart nginx

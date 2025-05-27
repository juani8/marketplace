#!/bin/bash

# Ir al directorio del frontend
cd /var/www/frontend

# Obtener últimos cambios
git pull origin main

# Ir a la carpeta del código fuente
cd src

# Instalar dependencias y construir
npm install
npm run build -- --outDir=dist

# Reiniciar NGINX para servir la nueva build
systemctl restart nginx

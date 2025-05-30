#!/bin/bash
set -e

apt update -y
apt install -y git nginx curl

# Instalar Node.js si no existe
if ! command -v node > /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt install -y nodejs
fi

# Clonar o actualizar el proyecto
cd /var/www
if [ -d frontend ]; then
  rm -rf frontend
fi
git clone ${frontend_repo_url} frontend
cd frontend/src

# Crear archivo .env para Vite
cat <<EOF > .env
VITE_BACKEND_URL=${vite_backend_url}
EOF

npm install
npm run build

# Ajustar permisos
chown -R www-data:www-data /var/www/frontend/dist
chmod -R 755 /var/www/frontend/dist

# Configurar NGINX para servir el frontend
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80;
    root /var/www/frontend/dist;
    index index.html;
    server_name _;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
EOF

sudo nginx -t && sudo systemctl restart nginx

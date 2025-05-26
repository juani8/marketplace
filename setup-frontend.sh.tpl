#!/bin/bash
apt update -y
apt install -y git nginx curl

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Clonar y construir el proyecto
cd /var/www
git clone ${frontend_repo_url} frontend
cd frontend/src

# Crear archivo .env para Vite
cat <<EOF > .env
VITE_BACKEND_URL=${vite_backend_url}
EOF

npm install && npm run build

# Configurar NGINX para servir el frontend
cat <<NGINX > /etc/nginx/sites-available/default
server {
    listen 80;
    root /var/www/frontend/dist;
    index index.html;
    server_name _;

    location / {
        try_files \$uri /index.html;
    }
}
NGINX

systemctl restart nginx
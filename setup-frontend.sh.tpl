#!/bin/bash
set -e

apt update -y
apt install -y git nginx curl certbot python3-certbot-nginx

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
cd frontend

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
sudo tee /etc/nginx/sites-available/marketplace > /dev/null <<EOF
server {
    listen 80;
    server_name marketplace.deliver.ar;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name marketplace.deliver.ar;

    ssl_certificate /etc/letsencrypt/live/marketplace.deliver.ar/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/marketplace.deliver.ar/privkey.pem;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files ${try_files_directiva};
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
EOF

if [ -e /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

if [ -e /etc/letsencrypt/live/marketplace.deliver.ar/fullchain.pem ]; then
  echo "Certificate already exists, skipping certbot obtain"
else
  sudo certbot install --cert-name marketplace.deliver.ar --non-interactive --agree-tos --email pruebadepruebas@gmail.com
fi

if [ ! -e /etc/nginx/sites-enabled/marketplace ]; then
  sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/marketplace
fi

sudo nginx -t && sudo systemctl restart nginx

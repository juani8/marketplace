#!/bin/bash
set -e

# Instalar dependencias necesarias
apt update -y
apt install -y git nginx curl certbot python3-certbot-nginx

# Instalar Node.js si no existe
if ! command -v node > /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt install -y nodejs
fi

# Clonar o actualizar el proyecto frontend
cd /var/www
if [ -d frontend ]; then
  rm -rf frontend
fi
git clone ${frontend_repo_url} frontend
cd frontend

# Crear archivo .env para Vite (puedes dejar solo /api si usas Nginx proxy)
cat <<EOF > .env
VITE_BACKEND_URL=/api
EOF

npm install
npm run build

# Ajustar permisos
chown -R www-data:www-data /var/www/frontend/dist
chmod -R 755 /var/www/frontend/dist

# Configuración Nginx SOLO HTTP (sin SSL, para bootstrap de certbot)
sudo tee /etc/nginx/sites-available/marketplace > /dev/null <<EOF
server {
    listen 80;
    server_name marketplace.deliver.ar;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }
}
EOF

# Remove default site if present
if [ -e /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Enable site BEFORE certbot so certbot sees the server block
if [ ! -e /etc/nginx/sites-enabled/marketplace ]; then
  sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/marketplace
fi

# Test and reload nginx for HTTP-only config
sudo nginx -t && sudo systemctl reload nginx

# Run certbot to obtain and configure SSL certificate
if [ -e /etc/letsencrypt/live/marketplace.deliver.ar/fullchain.pem ]; then
  echo "Certificate already exists, skipping certbot obtain"
else
  sudo certbot --nginx --non-interactive --agree-tos --redirect --email pruebadepruebas@gmail.com -d marketplace.deliver.ar
fi

# Final nginx reload in case certbot changed anything
sudo nginx -t && sudo systemctl reload nginx

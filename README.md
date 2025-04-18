# 🛒 Marketplace App

Este proyecto es una aplicación web desarrollada con **React**, utilizando **Vite** como bundler y **Tailwind CSS** como framework de estilos.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React**: Librería de JavaScript para construir interfaces de usuario.
- ⚡ **Vite**: Empaquetador ultrarrápido para desarrollo moderno con React.
- 🎨 **Tailwind CSS**: Framework utility-first para estilos rápidos y personalizables.

---

## 📦 Instalación

1. Crear el proyecto:

```bash
npm create vite@latest
# Seleccionar:
# > Framework: React
# > Variant: JavaScript
cd marketplace
npm install
npm run dev
```

2. Instalar y configurar Tailwind CSS:

Guía oficial: [Install Tailwind CSS with Vite](https://v3.tailwindcss.com/docs/guides/vite)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Configurar los archivos `tailwind.config.js` y `index.css` para que Tailwind funcione correctamente.

---

## 🎨 Estilos personalizados

- Fuente `Poppins` importada desde Google Fonts y aplicada globalmente.
- Paleta de colores definida en `tailwind.config.js` bajo `theme.extend.colors`.
- Clases Tailwind como `bg-primary`, `text-neutral`, etc., están disponibles en todo el proyecto.

Para modificar la paleta o la fuente, editá los archivos:
- `src/styles/index.css` (fuentes)
- `tailwind.config.js` (colores y extend)

---

## 🔍 Estructura de carpetas

```bash
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/            # Imágenes, íconos, fuentes, etc.
│   ├── components/        # Componentes reutilizables (botones, inputs, etc.)
│   ├── hooks/             # Custom hooks (useAuth, useFetch, etc.)
│   ├── layouts/           # Layouts generales (SidebarLayout, AuthLayout)
│   ├── pages/             # Páginas principales (Home.jsx, About.jsx, etc.)
│   ├── router/            # Configuración de rutas
│   ├── apis/              # API services (axios config, endpoints)
│   ├── contexts/          # Redux/Zustand slices o contextos globales
│   ├── styles/            # Archivos CSS globales o tailwind config
│   ├── utils/             # Funciones auxiliares
│   ├── App.jsx
│   └── main.jsx
├── .env                   # Variables de entorno
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔧 Module resolver

Se ha configurado un **module resolver** en `vite.config.js` para permitir imports más limpios:

```js
import Button from '@components/Button';
import useAuth from '@hooks/useAuth';
```

Esto evita el uso de rutas relativas como `../../../components`.

---

## 🔌 Conexión con el backend

La conexión con APIs externas se realiza a través de `axios`, organizada en la carpeta `src/apis/`.

---

## 🧪 Scripts disponibles

- `npm run dev`: Ejecuta el servidor de desarrollo.
- `npm run build`: Compila la app para producción.
- `npm run preview`: Previsualiza la build de producción localmente.

---

## 📝 Personalización

- Podés modificar la fuente o los colores desde:
  - `index.html` → para fuentes de Google
  - `tailwind.config.js` → para la paleta de colores
  - `index.css` → para aplicar `@apply font-sans` global

---

## 📚 Recursos útiles

- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [React Router Docs](https://reactrouter.com/en/main)
- [Axios Docs](https://axios-http.com/docs/intro)
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



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
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js

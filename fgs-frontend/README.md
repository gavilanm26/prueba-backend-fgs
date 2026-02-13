# FGS Frontend

Este es un proyecto [Next.js](https://nextjs.org/) iniciado con `create-next-app`.

## Stack Tecnológico

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Radix UI](https://www.radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- **Manejo de Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Estado/Obtención de Datos:** [SWR](https://swr.vercel.app/)
- **Iconos:** [Lucide React](https://lucide.dev/)

## Primeros Pasos

Primero, instala las dependencias:

```bash
npm install
# o
pnpm install
```

Luego, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del Proyecto

- `app/`: Contiene las rutas y páginas de la aplicación (App Router).
- `components/`: Componentes de UI reutilizables.
- `lib/`: Funciones de utilidad y lógica compartida.
- `hooks/`: Hooks personalizados de React.
- `styles/`: Estilos globales.
- `public/`: Activos estáticos.

## Scripts

- `dev`: Ejecuta el servidor de desarrollo con Turbopack.
- `build`: Construye la aplicación para producción.
- `start`: Inicia el servidor de producción.
- `lint`: Ejecuta el linter.

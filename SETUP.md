# Setup Guide

## Prerequisites

- Node.js 18+ or 20+
- npm 9+ or yarn 1.22+

## Initial Setup

1. **Clone or copy the project**

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or manually create `.env` with:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development
```

4. **Start development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

### Development

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
```

### Testing

```bash
npm test            # Run Jest tests
npm test -- --watch # Run tests in watch mode
npm test -- --coverage # Run tests with coverage
```

## Project Structure

```
nuggebugge-admin-app/
├── public/              # Static assets
│   └── vite.svg
├── src/
│   ├── assets/         # Images, fonts, etc.
│   │   └── react.svg
│   ├── components/     # Reusable React components
│   │   ├── __tests__/  # Component tests
│   │   └── ExampleComponent.tsx
│   ├── config/         # App configuration
│   │   └── env.ts
│   ├── hooks/          # Custom React hooks
│   │   └── useExample.ts
│   ├── i18n/           # Internationalization
│   │   ├── en/
│   │   ├── kn/
│   │   └── index.ts
│   ├── pages/          # Page components
│   │   └── Home.tsx
│   ├── routes/         # Route configuration
│   │   └── Routes.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── App.tsx         # Main app component
│   ├── App.css         # App styles
│   ├── index.css       # Global styles
│   ├── main.tsx        # Entry point
│   ├── theme.ts        # MUI theme
│   ├── setupTests.ts   # Test setup
│   └── vite-env.d.ts   # Vite types
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── jest.config.ts
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration Files

### TypeScript Configuration

- `tsconfig.json` - Main TypeScript config with project references
- `tsconfig.app.json` - Config for application code
- `tsconfig.node.json` - Config for Vite config file

### Build Configuration

- `vite.config.ts` - Vite bundler configuration
- `jest.config.ts` - Jest test runner configuration

### Code Quality

- `eslint.config.js` - ESLint rules and plugins
- `.prettierrc` - Prettier code formatting rules

## Adding New Features

### Adding a New Page

1. Create a new component in `src/pages/`
2. Add route in `src/routes/Routes.tsx`

```tsx
import NewPage from '../pages/NewPage';

// In Routes component
<Route path="/new-page" element={<NewPage />} />
```

### Adding a New API Service

1. Create service file in `src/services/`
2. Use axios instance from `src/services/api.ts`

```typescript
import api from './api';

export const fetchData = async () => {
  const response = await api.get('/endpoint');
  return response.data;
};
```

### Adding a New Hook

1. Create hook file in `src/hooks/`
2. Use TanStack Query for data fetching

```typescript
import { useQuery } from '@tanstack/react-query';

export const useCustomHook = () => {
  return useQuery({
    queryKey: ['custom'],
    queryFn: fetchData,
  });
};
```

### Adding Translations

1. Add translations to `src/i18n/en/translation.json`
2. Add translations to `src/i18n/kn/translation.json`
3. Use in components:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <div>{t('key')}</div>;
```

## Customization

### Changing Theme

Edit `src/theme.ts` to customize Material-UI theme colors, typography, and components.

### Changing API Base URL

Update `VITE_API_BASE_URL` in your `.env` file.

### Adding More Languages

1. Create new folder in `src/i18n/` (e.g., `fr/`)
2. Add `translation.json` file
3. Update `src/i18n/index.ts` to include new language

## Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory. You can preview it with:

```bash
npm run preview
```

## Deployment

The app can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

Make sure to set environment variables in your hosting platform.

## Troubleshooting

### Port 5173 is already in use

Change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
});
```

### Module not found errors

Try clearing cache and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type errors

Make sure TypeScript version matches:

```bash
npm install typescript@latest --save-dev
```

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Router Documentation](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)


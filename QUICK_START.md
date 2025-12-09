# 🚀 Quick Start Guide

## Installation (5 minutes)

### 1. Install Dependencies

```bash
cd nuggebugge-admin-app
npm install
```

### 2. Create Environment File

Create `.env` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173**

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check for issues
npm run lint:fix         # Fix issues automatically
npm run format           # Format code with Prettier

# Testing
npm test                 # Run all tests
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage
```

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── services/       # API calls
├── routes/         # Route definitions
├── i18n/           # Translations
├── config/         # Configuration
├── assets/         # Images, fonts, etc.
└── theme.ts        # MUI theme
```

## Adding New Features

### Create a New Page

1. Create file: `src/pages/NewPage.tsx`

```tsx
import { Box, Typography } from '@mui/material';

function NewPage() {
  return (
    <Box>
      <Typography variant="h1">New Page</Typography>
    </Box>
  );
}

export default NewPage;
```

2. Add route: `src/routes/Routes.tsx`

```tsx
import NewPage from '../pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

### Create a New API Service

1. Create file: `src/services/userService.ts`

```typescript
import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};
```

### Create a Custom Hook

1. Create file: `src/hooks/useUsers.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/userService';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
```

### Add New Translation

1. Edit `src/i18n/en/translation.json`:

```json
{
  "welcome": "Welcome",
  "newKey": "New Translation"
}
```

2. Use in component:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <div>{t('newKey')}</div>;
```

## Customization

### Change App Title

Edit `index.html`:

```html
<title>Your App Name</title>
```

### Customize Theme Colors

Edit `src/theme.ts`:

```typescript
primary: {
  main: '#your-color',
},
```

### Change API Base URL

Update `.env`:

```env
VITE_API_BASE_URL=https://api.yourapp.com
```

## Troubleshooting

### Port Already in Use

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
});
```

### Clear Cache

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
npm install typescript@latest --save-dev
```

## VS Code Setup

### Recommended Extensions

Install these extensions:

- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

### Enable Format on Save

Settings should already be configured in `.vscode/settings.json`

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

## Documentation

- **README.md** - Main overview
- **SETUP.md** - Detailed setup guide
- **PACKAGE_VERSIONS.md** - Version comparison
- **PROJECT_SUMMARY.md** - Complete project details

## Need Help?

1. Check the documentation files
2. Review example code in `src/`
3. Check official docs:
   - [React](https://react.dev/)
   - [Vite](https://vitejs.dev/)
   - [Material-UI](https://mui.com/)
   - [TanStack Query](https://tanstack.com/query)

## Tips

- Use TypeScript for type safety
- Follow the folder structure
- Write tests for components
- Use TanStack Query for API calls
- Keep components small and focused
- Use Material-UI components
- Add translations for all text
- Follow ESLint rules

Happy coding! 🎉


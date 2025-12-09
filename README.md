# Nuggebugge Admin App

> A modern, production-ready React admin application with the latest package versions (December 2024)

This application is based on the `data-catalog-app` configuration but updated with the latest stable versions of all packages.

## ✨ Features

### Core Technologies

- **⚛️ React 18.3** - Latest React with concurrent features
- **📘 TypeScript 5.7** - Type-safe development with latest features
- **⚡ Vite 6** - Next generation frontend tooling with lightning-fast HMR
- **🎨 Material-UI 6.3** - Modern, accessible React UI components
- **🔄 TanStack Query 5** - Powerful asynchronous state management
- **🧭 React Router 7** - Latest client-side routing
- **🌍 i18next 24** - Complete internationalization solution
- **🧪 Jest & Testing Library** - Comprehensive testing setup
- **📏 ESLint 9 & Prettier 3** - Code quality and formatting

### What's Included

✅ Complete TypeScript configuration with composite projects  
✅ ESLint with React, TypeScript, and accessibility rules  
✅ Prettier for consistent code formatting  
✅ Jest configured with React Testing Library  
✅ Axios instance with interceptors  
✅ Material-UI theme customization  
✅ i18next with English and Kannada translations  
✅ Example components, pages, and hooks  
✅ TanStack Query setup with sensible defaults  
✅ Environment configuration support  
✅ VS Code settings and extensions recommendations

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting & Formatting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Fix issues automatically
npm run format        # Format code
```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── config/          # Configuration files
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization files
├── pages/           # Page components
├── routes/          # Route definitions
├── services/        # API service layer
├── theme.ts         # MUI theme configuration
├── App.tsx          # Main app component
└── main.tsx         # Application entry point
```

## Features

- ⚡️ Vite - Lightning fast HMR
- 🎨 Material-UI - Beautiful, accessible components
- 🔄 TanStack Query - Server state management
- 🧭 React Router - Declarative routing
- 🌍 i18next - Multi-language support
- 🎯 TypeScript - Type safety
- 🧪 Jest + Testing Library - Unit testing
- 📏 ESLint + Prettier - Code quality
- 🎨 Emotion - CSS-in-JS styling

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide and troubleshooting
- **[PACKAGE_VERSIONS.md](./PACKAGE_VERSIONS.md)** - Complete package version comparison and update notes

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | Main TypeScript config with project references |
| `tsconfig.app.json` | TypeScript config for app code |
| `tsconfig.node.json` | TypeScript config for Vite config |
| `eslint.config.js` | ESLint rules and plugins (flat config) |
| `jest.config.ts` | Jest test runner configuration |
| `.prettierrc` | Prettier code formatting rules |

## 📦 Key Package Updates

Compared to the original configuration:

- **Vite**: 5.4 → **6.0** (major update with performance improvements)
- **React Router**: 6.26 → **7.1** (major update with better types)
- **i18next**: 23.15 → **24.2** (major update)
- **TypeScript**: 5.5 → **5.7** (minor update with new features)
- **Material-UI**: 6.1 → **6.3** (minor update)
- **TanStack Query**: 5.56 → **5.62** (patch updates)
- All ESLint plugins and tools updated to latest

See [PACKAGE_VERSIONS.md](./PACKAGE_VERSIONS.md) for complete details.

## 🏗️ Removed Optional Packages

The following were project-specific and not included in this app (add if needed):

- `gsap` - Animation library
- `react-slick` / `slick-carousel` - Carousel components
- `swiper` - Alternative carousel

## 🎯 What's Different from data-catalog-app?

1. **Latest Package Versions** - All dependencies updated to December 2024
2. **Clean Slate** - No domain-specific code, ready for any project
3. **Better Documentation** - Comprehensive setup and version comparison docs
4. **Example Code** - Includes example components, hooks, and tests
5. **VS Code Integration** - Settings and extension recommendations
6. **Production Ready** - Follows best practices and patterns

## 💡 Next Steps

1. Update the app title in `index.html`
2. Customize the theme in `src/theme.ts`
3. Update translations in `src/i18n/`
4. Configure your API base URL in `.env`
5. Start building your features!

## 📖 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 About

Nuggebugge Admin App - A modern admin interface built with React and Material-UI.

## 📝 License

MIT


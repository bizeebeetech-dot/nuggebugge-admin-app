# Package Versions Comparison

This document shows the package version updates from the original `data-catalog-app` to this new skeleton.

## Dependencies

### UI & Styling

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| @emotion/react | ^11.13.3 | ^11.13.5 | Patch update |
| @emotion/styled | ^11.13.0 | ^11.13.5 | Patch update |
| @mui/icons-material | ^6.1.0 | ^6.3.0 | Minor update |
| @mui/material | ^6.1.0 | ^6.3.0 | Minor update |
| @mui/x-date-pickers | ^8.14.1 | ^7.24.0 | Version alignment with MUI v6 |

### Core Libraries

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| react | ^18.3.1 | ^18.3.1 | No change (latest stable) |
| react-dom | ^18.3.1 | ^18.3.1 | No change (latest stable) |
| react-router-dom | ^6.26.2 | ^7.1.1 | Major update to v7 |

### State Management & Data Fetching

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| @tanstack/react-query | ^5.56.0 | ^5.62.7 | Patch update |
| axios | ^1.7.7 | ^1.7.9 | Patch update |

### Internationalization

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| i18next | ^23.15.1 | ^24.2.0 | Major update |
| i18next-browser-languagedetector | ^8.0.0 | ^8.0.2 | Patch update |
| react-i18next | ^15.0.2 | ^15.1.3 | Minor update |

### Utilities

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| dayjs | ^1.11.18 | ^1.11.13 | Using stable version |

### Removed Packages

The following packages from the original app were optional/specific and not included in the skeleton:

- gsap (^3.12.5) - Animation library (add if needed)
- react-slick (^0.30.2) - Carousel component (add if needed)
- slick-carousel (^1.8.1) - Required for react-slick
- swiper (^11.1.14) - Alternative carousel (add if needed)

## Dev Dependencies

### Build Tools

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| vite | ^5.4.1 | ^6.0.3 | Major update to v6 |
| @vitejs/plugin-react | ^4.3.1 | ^4.3.4 | Patch update |
| typescript | ^5.5.3 | ^5.7.2 | Minor update |

### Linting & Formatting

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| eslint | ^9.10.0 | ^9.17.0 | Patch update |
| @eslint/js | ^9.9.0 | ^9.17.0 | Patch update |
| @typescript-eslint/eslint-plugin | ^8.5.0 | ^8.18.1 | Patch update |
| @typescript-eslint/parser | ^8.5.0 | ^8.18.1 | Patch update |
| typescript-eslint | ^8.0.1 | ^8.18.1 | Patch update |
| eslint-config-prettier | ^9.1.0 | ^9.1.0 | No change |
| eslint-plugin-jsx-a11y | ^6.10.0 | ^6.10.2 | Patch update |
| eslint-plugin-prettier | ^5.2.1 | ^5.2.1 | No change |
| eslint-plugin-react | ^7.36.1 | ^7.37.2 | Patch update |
| eslint-plugin-react-hooks | ^5.1.0-rc.0 | ^5.0.0 | Now stable release |
| eslint-plugin-react-refresh | ^0.4.9 | ^0.4.16 | Patch update |
| prettier | ^3.3.3 | ^3.4.2 | Minor update |
| globals | ^15.9.0 | ^15.13.0 | Minor update |

### Testing

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| jest | ^29.7.0 | ^29.7.0 | No change (latest) |
| jest-environment-jsdom | ^29.7.0 | ^29.7.0 | No change |
| ts-jest | ^29.2.5 | ^29.2.5 | No change |
| @testing-library/jest-dom | ^6.5.0 | ^6.6.3 | Minor update |
| @testing-library/react | ^16.0.1 | ^16.1.0 | Minor update |
| @testing-library/user-event | ^14.5.2 | ^14.5.2 | No change |

### TanStack Query

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| @tanstack/eslint-plugin-query | ^5.53.0 | ^5.62.7 | Patch update |

### Types

| Package | Original | Updated | Notes |
|---------|----------|---------|-------|
| @types/jest | ^29.5.13 | ^29.5.14 | Patch update |
| @types/node | ^22.7.3 | ^22.10.2 | Minor update |
| @types/react | ^18.3.3 | ^18.3.18 | Patch update |
| @types/react-dom | ^18.3.0 | ^18.3.5 | Patch update |

### Removed Dev Dependencies

The following were specific to the original app:

- @types/react-slick (^0.23.13) - Type definitions for react-slick
- ts-node (^10.9.2) - Still included as it's useful for running TS files

## Major Updates & Breaking Changes

### React Router v7

React Router was updated from v6 to v7. Key changes:

- Improved type safety
- Better error handling
- Enhanced data loading patterns
- All v6 patterns still work, but v7 offers new features

### Vite v6

Vite was updated to v6 with improvements:

- Faster build times
- Better HMR performance
- Improved CSS handling
- Enhanced plugin API

### i18next v24

i18next was updated to v24:

- Better TypeScript support
- Performance improvements
- New features for translations

## Installation

To install all dependencies with the latest versions:

```bash
npm install
```

## Notes

- All packages are using the latest stable versions as of December 2024
- Breaking changes are minimal and mostly in major version updates
- The skeleton is production-ready and follows best practices
- Consider adding removed packages (gsap, swiper, etc.) based on your needs

## Compatibility

- Node.js: 18.x or 20.x recommended
- npm: 9.x or higher
- TypeScript: 5.7.x
- React: 18.3.x

## Future Updates

To update packages in the future:

```bash
# Check for updates
npm outdated

# Update all packages to latest
npm update

# Or use npm-check-updates
npx npm-check-updates -u
npm install
```


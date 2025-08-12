# The Water Foundation Site

![The Water Foundation Wordmark and Tagline](https://i.imgur.com/jur0e6z.png)

A modern web application built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) for The Water Foundation.

![Astro Logo](https://astro.build/assets/press/astro-logo-light-gradient.png)
         with
![Tailwind CSS Logo](https://upload.wikimedia.org/wikipedia/commons/9/95/Tailwind_CSS_logo.svg)
         with
![Vitest Logo](https://vitest.dev/logo.svg)

## ✅ Implementation Status

### Theme & Mode System (v0.0.1.0)
- [x] **Dual Theme Support**: Default and Water themes with complete color palettes
- [x] **Dark/Light Mode**: Automatic color inversion with proper contrast ratios
- [x] **State Persistence**: localStorage integration for user preferences
- [x] **Component Integration**: Theme-aware components with semantic CSS classes
- [x] **Event System**: Custom events for coordinated UI updates
- [x] **Comprehensive Testing**: 51 unit and integration tests with 100% pass rate

### Key Features
- **Tailwind CSS v4**: Modern `@theme` directive with CSS custom properties
- **JavaScript Utilities**: `ThemeSwitcher` and `ModeSwitcher` classes
- **Astro Layouts**: Reusable `BoilerPlateHTML` and `BaseThemeLayout` components
- **Brand Kit Page**: Interactive demonstration of all theme combinations
- **Hero Component**: Full-width hero component with background cycling and responsive design


## 🏗️ Project Structure

```
twf-site/
├── site/                   # Main Astro application
│   ├── src/
│   │   └── pages/         # Route pages
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies and scripts
│   └── README.md         # Astro-specific documentation
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or later)
- pnpm (recommended package manager)

### Installation

1. Clone this repository
2. Navigate to the site directory:
   ```bash
   cd site
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

   ```bash
   pnpm add -D vitest @vitest/ui
   ```

### Development

Start the development server:
```bash
cd site
pnpm dev
```

The site will be available at `http://localhost:4321`

## 🧪 Testing

The project includes comprehensive test coverage for theme and mode switching functionality:

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once (CI mode)
pnpm test:run
```

### Test Coverage
- **51 total tests** across 4 test suites
- **ThemeSwitcher**: 24 unit tests covering initialization, switching, storage, and events
- **ModeSwitcher**: 7 unit tests for light/dark mode functionality  
- **Integration**: 14 tests for combined theme/mode operations and state management
- **Hero Component**: 6 unit tests covering rendering, background cycling, and interactive elements

### Hero Component Features
- **Background Cycling**: Smooth transitions between multiple background types (image, gradient, video, GIF)
- **Responsive Design**: Adapts to all screen sizes with proper aspect ratios
- **Overlay Support**: Configurable color and gradient overlays with opacity control
- **Content Areas**: Flexible layout for headers, subheaders, and call-to-action buttons
- **Accessible**: Proper ARIA attributes and semantic HTML structure
- **Tested**: Comprehensive test coverage for all interactive features

## 🎨 Theme System

### Available Themes
- **Default Theme**: Professional blue/gray color palette
- **Water Theme**: Ocean-inspired cyan/blue color palette

### Usage Examples

```javascript
// Theme switching
import { ThemeSwitcher } from './src/utils/theme-switcher.js';
const themeSwitcher = new ThemeSwitcher();

// Set specific theme
themeSwitcher.setTheme('water');

// Toggle between themes
themeSwitcher.toggleTheme();

// Get current theme
const currentTheme = themeSwitcher.getCurrentTheme();
```

```javascript
// Mode switching
import { ModeSwitcher } from './src/utils/mode-switcher.js';
const modeSwitcher = new ModeSwitcher();

// Toggle dark/light mode
modeSwitcher.toggleMode();

// Set specific mode
modeSwitcher.setMode('dark');
```

### CSS Custom Properties
Themes use semantic CSS variables that automatically adapt to dark/light modes:

```css
/* Example theme variables */
--color-primary-500: #3b82f6;    /* Default theme */
--color-secondary-100: #f1f5f9;  /* Light backgrounds */
--color-secondary-800: #1e293b;  /* Dark text */
```

## 📝 Available Scripts

All commands should be run from the root directory:

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local development server |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run test suite |
| `pnpm test:ui` | Run tests with interactive UI |
| `pnpm test:run` | Run tests once (CI mode) |
| `pnpm astro ...` | Run Astro CLI commands |

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build) v5.12.9 - The web framework for content-driven websites
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4.1.11 - Utility-first CSS framework
- **Testing**: [Vitest](https://vitest.dev) v3.2.4 - Fast unit testing framework
- **Package Manager**: pnpm - Fast, disk space efficient package manager
- **Language**: JavaScript/TypeScript
- **Build Tool**: Vite (via Astro) with `@tailwindcss/vite` plugin

## 📁 Key Directories

- **`src/pages/`** - File-based routing. Each `.astro` or `.md` file becomes a route
  - `index.astro` - Homepage with project overview
  - `brand-kit/index.astro` - Interactive theme system demonstration
  - `brand-kit/heros.astro` - Hero component examples and documentation
- **`src/components/`** - Reusable UI components
  - `basics/` - Core UI components
    - `Hero.astro` - Full-width hero component with background cycling and responsive design
  - `design-system/` - Theme-aware components (ColorVariableGrid, TextStylePatternsGrid)
- **`src/layouts/`** - Page layout components
  - `BoilerPlateHTML.astro` - HTML boilerplate with meta tags and fonts
  - `BaseThemeLayout.astro` - Theme-specific layout wrapper
- **`src/utils/`** - JavaScript utilities
  - `theme-switcher.js` - Theme management utility
  - `mode-switcher.js` - Dark/light mode utility
  - `__tests__/` - Comprehensive test suite (45 tests)
- **`src/styles/`** - Global CSS and Tailwind configuration
  - `global.css` - Tailwind imports and theme definitions
- **`public/`** - Static assets served directly

## 🔧 Configuration

- **`astro.config.mjs`** - Main Astro configuration with Tailwind CSS v4 integration
- **`vitest.config.js`** - Test configuration with jsdom environment
- **`tsconfig.json`** - TypeScript configuration
- **`package.json`** - Project dependencies and scripts

### Key Configuration Files

```javascript
// astro.config.mjs - Tailwind CSS v4 integration
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```javascript
// vitest.config.js - Test environment setup
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/utils/__tests__/setup.js'],
  },
});
```

## 🌐 Deployment

The site can be deployed to various platforms that support static sites or SSR:

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **SSR Hosting**: Cloudflare Pages, Deno Deploy, Node.js servers

Build for production:
```bash
cd site
pnpm build
```

## 📖 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro Discord Community](https://astro.build/chat)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `site/` directory
4. Test your changes with `pnpm dev`
5. Build and verify with `pnpm build`
6. Submit a pull request

## 📄 License

[Add your license information here]

---

Built with ❤️ using Astro

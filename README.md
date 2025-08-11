# TWF Site

A modern web application built with [Astro](https://astro.build) for The Water Foundation.

### Completed
- [x] Mode System
- [ ] Theme System


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

## 📝 Available Scripts

All commands should be run from the `site/` directory:

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local development server |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro ...` | Run Astro CLI commands |
| `pnpm astro -- --help` | Get help with Astro CLI |

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build) - The web framework for content-driven websites
- **Package Manager**: pnpm
- **Language**: JavaScript/TypeScript
- **Build Tool**: Vite (via Astro)

## 📁 Key Directories

- **`site/src/pages/`** - File-based routing. Each `.astro` or `.md` file becomes a route
- **`site/src/components/`** - Reusable UI components (Astro, React, Vue, Svelte, etc.)
- **`site/public/`** - Static assets (images, fonts, etc.) served directly

## 🔧 Configuration

- **`site/astro.config.mjs`** - Main Astro configuration file
- **`site/tsconfig.json`** - TypeScript configuration
- **`site/package.json`** - Project dependencies and scripts

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

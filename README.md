# The Water Foundation Site

![The Water Foundation Wordmark and Tagline](https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/ogImageLandscape__The-Water-Foundation.jpg?updatedAt=1758017379620)

<p align="center">
  <span style="font-size: 18px; font-weight: 500; color: #374151;">A modern web application built with</span>
  <span style="font-size: 20px; color: #ef4444; margin: 0 4px;">❤️</span>
  <span style="font-size: 18px; font-weight: 500; color: #374151;">by</span>
  <br/>
  <a href="https://lossless.group" target="_blank" rel="noopener" style="text-decoration: none; display: inline-flex; align-items: center; margin: 8px 0;">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__The-Lossless-Group.svg?updatedAt=1758016855404" alt="The Lossless Group" height="24" style="margin-right: 8px;" />
    <span style="font-size: 22px; font-weight: 600; color: #1f2937;">The Lossless Group</span>
  </a>
  <br/>
  <span style="font-size: 14px; color: #6b7280; margin-top: 12px; display: block;">
    SSG and Styles with 
    <a href="https://astro.build" style="color: #7c3aed; text-decoration: none; font-weight: 500;">Astro</a> 
    and 
    <a href="https://tailwindcss.com" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Tailwind CSS v4</a> 
    for <a href="https://the-water-foundation.org" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">The Water Foundation</a>
  </span>
</p>

## Table of Contents

- [Stack](#stack)
- [Content Authoring and Management Instructions](#content-authoring-and-management-instructions)
  - [📝 Developing Slide Presentations](#-developing-slide-presentations)
    - [1. Create a New Slide Deck](#1-create-a-new-slide-deck)
    - [2. Register the Slide Deck](#2-register-the-slide-deck)
    - [3. Add to the Presentations List](#3-add-to-the-presentations-list)
    - [4. Available Features](#4-available-features)
    - [5. Development Server](#5-development-server)
  - [🎪 Event Management](#-event-management)
    - [1. Create a New Event](#1-create-a-new-event)
    - [2. Event Page Creation](#2-event-page-creation)
    - [3. Event Fields Explained](#3-event-fields-explained)
    - [4. Integration with Events Index](#4-integration-with-events-index)
    - [5. Social Sharing Features](#5-social-sharing-features)
    - [6. Development Workflow](#6-development-workflow)

- [Site Development and Specifications](#site-development-and-specifications)
  - [✅ Implementation Status](#-implementation-status)
    - [Theme & Mode System (v0.0.1.0)](#theme--mode-system-v0010)
    - [Responsive Framework (v1.0.0)](#responsive-framework-v100)
    - [Key Features](#key-features)
  - [🎨 Button Variants Framework](#-button-variants-framework)
    - [Available Variants](#available-variants)
    - [Sizes](#sizes)
    - [Usage Example](#usage-example)
  - [📦 Major Dependencies](#-major-dependencies)

***

# Stack

<p align="center">
  <a href="https://astro.build" target="_blank" rel="noopener">
    <img src="https://astro.build/assets/press/astro-logo-light-gradient.png" alt="Astro" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://revealjs.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Reveal--SizeMod--Light.svg?updatedAt=1758016291602" alt="RevealJS" height="48" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tailwindcss.com" target="_blank" rel="noopener">
    <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__TailwindCSS--Lighter.webp?updatedAt=1758016076289" height="42" />
  </a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://vitest.dev" target="_blank" rel="noopener">
    <span style="display:inline-flex;align-items:center;gap:8px">
      <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/trademark__Vitest.webp?updatedAt=1758016614303" alt="Vitest" height="48" />
    </span>
  </a>
</p>

<p align="center">
  Modern site generation, presentations, styling, and testing.
</p>

***

# Content Authoring and Management Instructions

## 📝 Developing Slide Presentations

This project uses Astro with RevealJS to create beautiful, interactive slide presentations. Here's how to create a new slide deck:

### 1. Create a New Slide Deck

1. **Create a new markdown file** in `src/content/slides/` with this structure:

   ```markdown
   ---
   title: "Your Presentation Title"
   description: "Brief description of your presentation"
   theme: "water"  # or "default"
   transition: "slide"  # or "fade", "none", etc.
   tags: ["tag1", "tag2"]  # Optional tags
   ---
   
   # Your First Slide
   
   Content goes here...
   
   ---
   
   ## Second Slide
   
   More content...
   ```

2. **Add your content** using Markdown syntax. Use `---` to separate slides.

### 2. Register the Slide Deck

1. Open `src/pages/slides/[...slug].astro`
2. Add a new entry to the `getStaticPaths()` function:

   ```javascript
   {
     params: { slug: 'your-presentation-slug' },
     props: {
       title: "Your Presentation Title",
       description: "Brief description of your presentation",
       slideshow: "your-presentation-slug"
     }
   }
   ```

3. Add a new condition to render your slides:

   ```astro
   {slideshow === 'your-presentation-slug' && (
     <!-- Your slides go here -->
     <section>
       <h1>Your First Slide</h1>
       <p>Content goes here...</p>
     </section>
     
     <section>
       <h2>Second Slide</h2>
       <p>More content...</p>
     </section>
   )}
   ```

### 3. Add to the Presentations List

1. Open `src/pages/slides/index.astro`
2. Add a new entry to the `presentations` array:

   ```javascript
   {
     title: "Your Presentation Title",
     slug: "your-presentation-slug",
     description: "Brief description of your presentation",
     date: "YYYY-MM-DD",
     icon: "🎯"  // Choose an appropriate emoji
   }
   ```

### 4. Available Features

- **Themes**: Use `theme: "water"` or `theme: "default"`
- **Transitions**: Set `transition: "slide"`, `"fade"`, `"none"`, etc.
- **Backgrounds**: Add `data-background-color` or `data-background-image` to sections
- **Fragments**: Use `class="fragment"` for step-by-step animations
- **Speaker Notes**: Add notes with `<!-- .element: class="notes" -->`

### 5. Development Server

Run the development server to see your changes:

```bash
pnpm dev
```

Then visit `http://localhost:4321/slides/your-presentation-slug`

## 🎪 Event Management

This project includes a comprehensive event management system for creating splash pages and managing event information.

![Example Event](https://i.imgur.com/S3Wg3PD.png)


### 1. Create a New Event

1. **Create a new markdown file** in `src/content/events/` using the event `slug` (the URL path desired that is unique to the event) as the filename (e.g., `event-slug.md` for `/events/event-slug`). 

2. Add the event information to the markdown file with this structure:

   ```markdown
   ---
   title: "Meet The Water Foundation at [Event Name]"
   event_name: "EventName"
   upcoming_dates: "2025-09-15--2025-09-18"
   upcoming_location: "City, Country"
   url: https://eventwebsite.com/
   splash_page_path: /events/event-slug
   twf_zinger: "The Water Foundation is a think tank and capital catalyst, assuring full-stack financial innovations are tackling the urgent challenge of our time."
   invite_message: "Meet us at [Event Name], a gathering of water innovation leaders, investors, and changemakers."
   share_image: /share-banners/bannerImage--Event-Name.webp
   contact_email: "dive.deep@the-water-foundation.org"
   contact_phone: "+49 177 4543720"
   event_website: "https://eventwebsite.com/"
   ---
   ```

 - **twf_zinger**: The current positioning statement of the The Water Foundation that is most relevant for this event.
 - **invite_message**: The message you want to invite people to meet or join the team at the event.
 - **share_image**: The banner image for the event splash page that will be used in open graph social media shares. 

2. **Add the banner image** to `/public/share-banners/`


### 2. Event Page Creation

The system automatically creates event pages at `/events/[slug]` based on your markdown files. Each event page includes:

- **Dynamic content** loaded from markdown frontmatter
- **Social sharing** with LinkedIn and WhatsApp integration
- **Open Graph meta tags** for proper social media previews
- **Contact information** with email and phone links
- **Event details** with formatted dates and location
- **Responsive design** optimized for all devices

### 3. Event Fields Explained

- **`title`**: Page title and meta title for SEO
- **`event_name`**: Display name of the event (e.g., "TheDrop")
- **`upcoming_dates`**: Date range in format "YYYY-MM-DD--YYYY-MM-DD"
- **`upcoming_location`**: City and country where event takes place
- **`url`**: Official event website URL
- **`splash_page_path`**: Internal path for the event page
- **`twf_zinger`**: The Water Foundation's positioning statement
- **`invite_message`**: Main invitation message for the event
- **`share_image`**: Banner image for social media sharing (recommended: 1200x630px)
- **`contact_email`**: Contact email for event inquiries
- **`contact_phone`**: Contact phone number (optional)
- **`event_website`**: Link to event's official website

### 4. Integration with Events Index

Events automatically appear on the main events page (`/events`) when:
- The markdown file exists in `src/content/events/`
- The event data matches the collection schema
- The event is referenced in the events index page logic

### 5. Social Sharing Features

Each event page includes:
- **LinkedIn sharing** with proper Open Graph tags
- **WhatsApp sharing** with formatted message
- **Custom banner images** for social media previews
- **SEO optimization** with meta descriptions and titles

### 6. Development Workflow

1. Create the markdown file with event details
2. Add the banner image to `/public/share-banners/`
3. Test the page at `http://localhost:4321/events/[slug]`
4. Verify social sharing previews work correctly

# Site Development and Specifications

## ✅ Implementation Status

### Theme & Mode System (v0.0.1.0)
- [x] **Dual Theme Support**: Default and Water themes with complete color palettes
- [x] **Dark/Light Mode**: Automatic color inversion with proper contrast ratios
- [x] **State Persistence**: localStorage integration for user preferences
- [x] **Component Integration**: Theme-aware components with semantic CSS classes
- [x] **Event System**: Custom events for coordinated UI updates
- [ ] **Comprehensive Testing**: 51 unit and integration tests with 100% pass rate

### Responsive Framework (v1.0.0)
- [x] **Media Queries**: Mobile-first breakpoints for all device sizes
- [x] **Container Queries**: Component-level responsive design
- [x] **Utility Classes**: Comprehensive set of responsive utilities
- [x] **Performance Optimized**: Efficient CSS with `contain` and `content-visibility`
- [ ] **Accessibility**: Responsive design that maintains accessibility

### Key Features
- **Tailwind CSS v4**: Modern `@theme` directive with CSS custom properties
- **JavaScript Utilities**: `ThemeSwitcher` and `ModeSwitcher` classes
- **Astro Layouts**: Reusable `BoilerPlateHTML` and `BaseThemeLayout` components
- **Brand Kit Page**: Interactive demonstration of all theme combinations
- **Hero Component**: Full-width hero component with background cycling and responsive design
- **Responsive Components**: Built with both media and container queries for maximum flexibility
- **Header Component**: Responsive navigation with dark/light mode toggle and mobile menu
- **Footer Component**: Site-wide footer with navigation and contact information
- **Slides System**: Interactive presentations powered by [RevealJS](https://revealjs.com) with Water Theme integration


### 🎨 Button Variants Framework

The application features a comprehensive button system with multiple variants and sizes for consistent UI/UX:

#### Available Variants
- **Lean**: Glassmorphic effect with subtle hover states
- **Icon**: Circular buttons for icon-only actions
- **Gradient**: Filled gradient buttons with hover effects
- **Animated**: Buttons with animated hover effects
- **Ghost**: Transparent buttons with border
- **Text Gradient**: Buttons with gradient text and glassmorphic background
- **Partner**: Special variant with custom styling for partnership actions

##### Sizes
- `xs`: Extra small
- `sm`: Small
- `md`: Medium (default)
- `lg`: Large
- `xl`: Extra large
- `compact`: Compact size with standard padding

#### Usage Example
```astro
<ButtonVariants 
  href="/example"
  text="Click Me"
  variant="gradient"
  size="md"
  external={false}
  className="custom-class"
/>
```

## 📦 Major Dependencies

### Core
- **Astro**: v5.12.9 - Modern static site generator
- **Tailwind CSS**: v4.1.11 - Utility-first CSS framework
- **Vite**: Next generation frontend tooling (via Astro)
- **TypeScript**: Type-safe JavaScript

### UI & Styling
- **@tailwindcss/vite**: v4.1.11 - Vite plugin for Tailwind CSS
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Autoprefixer**: Add vendor prefixes to CSS rules

### Development & Testing
- **Vitest**: v3.2.4 - Fast unit testing framework
- **@vitest/ui**: v3.2.4 - UI for Vitest
- **jsdom**: v26.1.0 - JavaScript implementation of web standards

### Build & Tooling
- **pnpm**: v10.13.1 - Fast, disk space efficient package manager
- **ESLint**: Code quality and style checking
- **Prettier**: Code formatting

## 🧩 UI Components

### Header Component
- **Features**:
  - Responsive navigation that collapses into a mobile menu on smaller screens
  - Dark/light mode toggle with system preference detection
  - Accessible dropdown menus with keyboard navigation
  - Smooth transitions and animations
  - Support for custom logos and navigation items
  - Call-to-action button with configurable variants

### Footer Component
- **Features**:
  - Multi-column layout with configurable sections
  - Social media links with SVG icons
  - Copyright and legal links
  - Responsive design that adapts to different screen sizes
  - Consistent theming with the rest of the application

### Slides System
- **Features**:
  - Interactive presentations powered by [RevealJS](https://revealjs.com) 4.5.0
  - Full Water Theme integration with automatic dark/light mode support
  - Four-way navigation (horizontal and vertical slides)
  - Control buttons (exit, restart, fullscreen toggle)
  - Responsive design (16:9 aspect ratio) that works on all devices
  - Syntax highlighting for code blocks
  - CDN-based RevealJS loading (no npm dependencies required)
  - Content collections support for slide management
- **Usage**:
  - Visit `/slides/` to view available presentations
  - Create new slides in `src/content/slides/` directory
  - Use `.astro` files for component-based slides or `.md` for Markdown content

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

## 🌐 Responsive Framework

Our responsive design system combines traditional media queries with modern container queries for optimal flexibility across all devices.

### Breakpoints

We use a mobile-first approach with the following breakpoints:

| Breakpoint | Min-Width | Description        |
|------------|-----------|--------------------|
| `sm`       | 640px     | Small devices      |
| `md`       | 768px     | Tablets            |
| `lg`       | 1024px    | Laptops            |
| `xl`       | 1280px    | Desktops           |
| `2xl`      | 1536px    | Large desktops     |

### Media Queries

```css
/* Mobile-first media query example */
.component {
  /* Mobile styles */
  padding: 1rem;
  
  /* Small devices and up */
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
  
  /* Large devices and up */
  @media (min-width: 1024px) {
    padding: 2rem;
  }
}
```

### Container Queries

Container queries allow components to adapt based on their container size rather than viewport size:

```css
/* Parent container */
.container {
  container-type: inline-size;
  container-name: component;
  width: 100%;
}

/* Component styles that respond to container size */
@container component (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
  }
}
```

### Utility Classes

We provide responsive utility classes for common patterns:

```html
<!-- Hide on mobile, show on medium screens and up -->
<div class="hidden md:block">Visible on medium+</div>

<!-- Stack on mobile, row on larger screens -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### API Integrations

#### Unipile API

```text
//.env
UNIPILE_API_CUSTOM_URL=
UNIPILE_API_KEY=
```

The Unipile API is used to retrieve data for people. 
```bash
curl --request GET --url ${UNIPILE_API_CUSTOM_URL}/api/v1/accounts --header 'X-API-KEY:'${UNIPILE_API_KEY}' --header 'accept: application/json'
```

### Performance Optimization

- **CSS Containment**: Used to optimize rendering performance
- **Content Visibility**: Applied to off-screen content
- **Efficient Selectors**: Optimized for better rendering performance

### Accessibility

All responsive components maintain:
- Proper heading hierarchy
- Sufficient color contrast
- Keyboard navigation support
- Screen reader compatibility

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
- **Presentations**: [RevealJS](https://revealjs.com) v4.5.0 - HTML presentation framework (CDN-based)
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

Built by [The Lossless Group](https://lossless.group) with ❤️ using Astro

<a href="https://lossless.group" target="_blank" rel="noopener" style="text-decoration: none; display: inline-flex; align-items: center; margin: 8px 0;">
  <img src="https://ik.imagekit.io/xvpgfijuw/uploads/lossless/trademarks/bannerImage__The-Lossless-Group.png?updatedAt=1758016899338" alt="The Lossless Group" width="100%" style="margin-right: 8px;" />
</a>
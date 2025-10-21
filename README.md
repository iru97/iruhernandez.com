# Portfolio Website - Iru Hernández

A modern Vue 3 portfolio website showcasing my skills, projects and experience as a Frontend Developer.

## Overview

Modern, interactive portfolio built with Vue 3, TypeScript, and Tailwind CSS. Features an infinite carousel for projects, dark/light theme toggle, and smooth animations.

## Tech Stack

- **Vue 3** - Composition API, reactive components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D visualizations (planned)
- **Font Awesome** - Icons

## Features

- ✨ **Modern Design** - Clean, professional interface matching production site
- 🎨 **Dark/Light Theme** - Toggle with localStorage persistence
- 🎠 **Infinite Carousel** - Smooth project showcase with drag & wheel scroll
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance Optimized** - Fast loading, service worker ready
- 🎯 **SEO Ready** - Semantic HTML and meta tags

## Project Structure

```
src/
├── components/
│   └── sections/         # Section components
│       ├── HeroSection.vue
│       ├── ProjectsSection.vue  # Infinite carousel
│       ├── ExperienceSection.vue
│       ├── SkillsSection.vue
│       ├── ArticlesSection.vue
│       └── ContactSection.vue
├── composables/          # Reusable composition functions
│   ├── useTheme.ts
│   ├── useCustomCursor.ts
│   └── useStatsAnimation.ts
├── services/             # API services
│   └── githubService.ts
├── assets/               # Fonts, images, styles
└── App.vue               # Main app component
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Components

### Projects Carousel
- Infinite loop scroll
- Mouse wheel & drag support
- Snap-to-center effect
- Real GitHub projects integration

### Theme System
- Dark/light mode toggle
- System preference detection
- Smooth transitions

### Composables
- `useTheme` - Theme management
- `useCustomCursor` - Custom cursor logic
- `useStatsAnimation` - Animated statistics

## Color Palette

- **Primary**: `#197278` (Caribbean Current)
- **Secondary**: `#283d3b` (Dark Slate Gray)
- **Accent**: `#c44536` (Persian Red)
- **Light**: `#edddd4` (Champagne Pink)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Design based on production site at [iruhernandez.com](https://iruhernandez.com)
- Icons from [Font Awesome](https://fontawesome.com/)
- Quicksand font from [Google Fonts](https://fonts.google.com/specimen/Quicksand)

## License

MIT License - feel free to use as reference for your own portfolio!

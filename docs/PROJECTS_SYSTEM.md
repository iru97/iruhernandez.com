# Projects System Documentation

## Overview

This portfolio now features an **automated projects management system** that:
- Automatically fetches data from GitHub repositories
- Generates screenshots of live websites
- Displays projects in an enhanced visual carousel
- Provides detailed project modals with rich information
- Categorizes projects (owned, collaborative)
- Shows real-time GitHub statistics

## Architecture

### 1. Data Structure

**TypeScript Interfaces** (`src/types/project.ts`):
```typescript
interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;

  // Visual assets
  thumbnail: string;
  images: ProjectImage[];

  // Metadata
  type: 'owned' | 'contributed' | 'collaborative';
  category: 'web-app' | '3d-graphics' | 'mobile' | 'data-viz' | 'tool' | 'ai-platform' | 'saas';
  featured: boolean;
  tags: string[];
  techStack: string[];

  // Links & metadata
  github?: GitHubMetadata;
  liveUrl?: string;
  features: string[];
  role?: string;  // For collaborative projects
  contribution?: string;

  // ... more fields
}
```

### 2. Data Generation

**Automated Script** (`scripts/fetch-project-data.ts`):

The script automates data collection:

1. **GitHub Data**: Fetches repository information via GitHub API
   - README content
   - Stars, forks, language
   - Topics/tags
   - Last updated date

2. **Screenshots**: Generates live website previews
   - Uses free screenshot service (thum.io)
   - Fallback to gradient placeholders

3. **Output**: Creates `src/data/projects.json` with all data

**Usage**:
```bash
npm run fetch-projects
```

This regenerates the entire projects database automatically.

### 3. Project Configuration

Edit `scripts/fetch-project-data.ts` to add/modify projects:

```typescript
const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    id: 'my-project',
    name: 'My Amazing Project',
    shortDescription: 'Brief description',
    type: 'owned',  // or 'collaborative'
    category: 'web-app',
    github: 'repo-name',  // GitHub repo name
    liveUrl: 'https://myproject.com',
    // For collaborative projects:
    role: 'Frontend Developer',
    contribution: 'Built the entire UI',
    customData: {
      features: ['Feature 1', 'Feature 2'],
      techStack: ['Vue 3', 'TypeScript'],
      teamSize: 10,
      duration: '1 year'
    }
  }
];
```

Then run `npm run fetch-projects` to regenerate data.

## Components

### ProjectsSection.vue

**Enhanced Features**:
- ✅ Real project thumbnails (auto-generated screenshots)
- ✅ Badges (Featured, Live, Professional)
- ✅ Tech stack preview
- ✅ GitHub stats (stars, forks, language)
- ✅ Hover effects with image zoom
- ✅ Click to open detailed modal
- ✅ Maintains infinite carousel functionality

### ProjectModal.vue

**Modal Features**:
- 📸 Image gallery with thumbnails
- 📝 Full project description
- 🛠️ Complete tech stack list
- ⭐ Key features list
- 📊 GitHub statistics
- 👤 Role & contribution (for collaborative projects)
- 🔗 Action buttons (Visit Site, View Code)
- ⌨️ Keyboard navigation (ESC to close, arrows to navigate)
- 📱 Fully responsive

### useProjects Composable

**API**:
```typescript
const {
  allProjects,           // All projects
  featuredProjects,      // Featured only
  ownedProjects,         // Personal projects
  collaborativeProjects, // Professional work
  getProjectById,        // Find by ID
  getProjectsByCategory, // Filter by category
  getProjectsByTag,      // Filter by tag
} = useProjects();
```

## Current Projects

### Owned Projects (9)
1. **MeshMotion** - 3D GLB animation viewer (Live)
2. **AnalyticsMind** - Analytics platform (Live)
3. **WorldTime** - Timezone converter (Live)
4. **Datos Abiertos** - Spanish open data viz (Live)
5. **Experimental Lab** - Tech testing ground (Live)
6. **iruhernandez.com** - This portfolio (Live)
7. **AI Assistant** - React Native AI app
8. **Nuxt Pokemon App** - Pokemon browser
9. **Three.js Portfolio** - 3D showcase (Live)

### Collaborative Projects (5)
1. **Metricool** - Social media analytics SaaS
2. **Metricool Mobile** - Mobile app (iOS & Android)
3. **MyoLab Self** - Embodied AI platform
4. **MyoLab Demo** - AI demo platform
5. **Kinephy Canvas** - AI animation tools

## Customization

### Adding New Projects

1. Edit `scripts/fetch-project-data.ts`
2. Add your project to `PROJECT_CONFIGS` array
3. Run `npm run fetch-projects`
4. Build and deploy

### Changing Screenshot Service

The current implementation uses **thum.io** (free, no API key).

To change:
1. Edit `getScreenshotUrl()` in `scripts/fetch-project-data.ts`
2. Replace with your preferred service:
   - ApiFlash: Higher quality, requires API key
   - ScreenshotMachine: Good free tier
   - Puppeteer: Self-hosted option

### Styling

All styles use CSS variables from `src/assets/styles/original.css`:
- `--primary`: #197278
- `--accent`: #c44536
- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`

Dark theme is automatically handled.

## Performance

### Optimizations
- ✅ Lazy image loading
- ✅ Code splitting (vendor, three chunks)
- ✅ CSS modules
- ✅ Screenshot caching via CDN
- ✅ Minimal data in JSON (no heavy README markdown)

### Build Stats
```
dist/assets/index.css      38.56 kB │ gzip:  6.94 kB
dist/assets/index.js       51.49 kB │ gzip: 15.05 kB
dist/assets/vendor.js      70.69 kB │ gzip: 27.44 kB
```

## Future Enhancements

Potential improvements:
- [ ] Category filtering UI
- [ ] Search functionality
- [ ] Sort options (by date, stars, etc.)
- [ ] Project comparison feature
- [ ] Analytics tracking
- [ ] CMS integration for non-technical updates
- [ ] Video previews support
- [ ] Lightbox for images

## Maintenance

### Updating Projects

**Option 1: Automatic** (Recommended)
```bash
npm run fetch-projects
npm run build
```

**Option 2: Manual**
Edit `src/data/projects.json` directly (not recommended).

### Troubleshooting

**Issue**: Images not loading
- Check screenshot service availability
- Verify URLs are accessible
- Check placeholder.jpg exists in `/public/projects/`

**Issue**: Build fails
- Run `npm run build:check` for TypeScript errors
- Verify `projects.json` is valid JSON
- Check all imports are correct

**Issue**: Modal not opening
- Check browser console for errors
- Verify ProjectModal component is imported
- Ensure project IDs are unique

## Technologies Used

- **Vue 3** - Framework
- **TypeScript** - Type safety
- **GitHub API** - Repository data
- **Thum.io** - Screenshot generation
- **Vite** - Build tool
- **Teleport** - Modal rendering
- **Intersection Observer** - Lazy loading (potential)

## Credits

Automated projects system developed for Iru Hernández's portfolio.
Built with modern web technologies and best practices.

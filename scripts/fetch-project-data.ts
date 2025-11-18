/**
 * Automated Project Data Fetcher
 *
 * This script automates the process of gathering project data:
 * 1. Fetches GitHub repository data (README, stars, topics, etc.)
 * 2. Uses local screenshots from public/screenshots directory
 * 3. Extracts images from README files
 * 4. Compiles everything into a comprehensive projects.json
 *
 * Usage: npm run fetch-projects
 */

import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Project, ProjectsDatabase, GitHubMetadata, ProjectImage } from '../src/types/project';

// GitHub API Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'iru97';

// Screenshot API Configuration
// Using screenshotone.com - free tier available
// Alternative: Use placeholder for now and replace manually
const SCREENSHOT_API_URL = 'https://api.screenshotone.com/take?access_key=demo&url=';

interface ProjectConfig {
  id: string;
  name: string;
  shortDescription: string;
  type: 'owned' | 'contributed' | 'collaborative';
  category: 'web-app' | '3d-graphics' | 'mobile' | 'data-viz' | 'tool' | 'ai-platform' | 'saas';
  github?: string; // repo name only (for owned) or full URL (for contributed)
  liveUrl?: string;
  role?: string;
  contribution?: string;
  customData?: Partial<Project>;
}

// Project configurations
const PROJECT_CONFIGS: ProjectConfig[] = [
  // Owned & Deployed
  {
    id: 'meshmotion',
    name: 'MeshMotion',
    shortDescription: 'Advanced 3D GLB animation viewer with professional controls',
    type: 'owned',
    category: '3d-graphics',
    github: 'meshmotion.es',
    liveUrl: 'https://meshmotion.es',
  },
  {
    id: 'analyticsmind',
    name: 'AnalyticsMind',
    shortDescription: 'AI-powered Google Analytics platform with intelligent insights and custom dashboards',
    type: 'owned',
    category: 'saas',
    liveUrl: 'https://analyticsmind.es',
    customData: {
      fullDescription: 'AnalyticsMind is a next-generation Google Analytics platform that combines the power of AI (Anthropic Claude & OpenAI) with advanced data visualization to deliver actionable insights. Built with Next.js 15 and modern technologies, it transforms raw GA4 data into intelligent, customizable dashboards with drag-and-drop widgets, automated reporting, and AI-powered analysis that helps businesses make data-driven decisions faster.',
      techStack: [
        'Next.js 15',
        'React 18',
        'TypeScript',
        'Google Analytics Data API',
        'Anthropic AI SDK',
        'OpenAI',
        'Prisma',
        'PostgreSQL',
        'NextAuth v5',
        'Recharts',
        'TanStack Query',
        'Radix UI',
        'Framer Motion',
        'React Grid Layout',
        'Tailwind CSS'
      ],
      features: [
        'Real-time Google Analytics 4 data integration',
        'AI-powered insights with Claude & GPT models',
        'Drag-and-drop customizable dashboard builder',
        'Interactive data visualizations with Recharts',
        'Automated report generation and scheduling',
        'Export dashboards to PDF with custom branding',
        'Advanced filtering, segmentation, and date comparisons',
        'Multi-property and multi-view support',
        'Role-based access control with NextAuth',
        'Responsive design with mobile optimization',
        'Real-time data synchronization',
        'Custom metrics and calculated fields'
      ]
    }
  },
  {
    id: 'worldtime',
    name: 'WorldTime',
    shortDescription: 'Elegant world clock and timezone converter for global teams',
    type: 'owned',
    category: 'web-app',
    liveUrl: 'https://worldtime.es',
    customData: {
      fullDescription: 'A beautiful and intuitive world clock application designed for remote teams and international collaboration. Features real-time timezone conversion, meeting scheduler, and visual time comparison to help coordinate across different time zones effortlessly.',
      techStack: ['Vue 3', 'TypeScript', 'Moment-Timezone', 'Vite', 'Tailwind CSS'],
      features: [
        'Real-time world clock with multiple timezones',
        'Smart timezone converter with DST support',
        'Meeting time finder for multiple locations',
        'Visual timeline comparison',
        'Favorite locations quick access',
        'UTC offset display',
        'Search cities and timezones',
        'Clean, minimalist interface',
        'Offline support with PWA',
        'Responsive mobile-first design'
      ]
    }
  },
  {
    id: 'datosabiertos',
    name: 'Datos Abiertos',
    shortDescription: 'Spanish government open data visualization platform',
    type: 'owned',
    category: 'data-viz',
    github: 'datosenabierto.es',
    liveUrl: 'https://datosenabiertos.es',
  },
  {
    id: 'lab',
    name: 'Experimental Lab',
    shortDescription: 'Interactive playground for experimenting with cutting-edge web technologies',
    type: 'owned',
    category: 'web-app',
    liveUrl: 'https://lab.iruhernandez.com',
    customData: {
      fullDescription: 'A living showcase of experimental web projects and proof-of-concepts. This lab serves as a sandbox environment for testing emerging web technologies, design patterns, and innovative UI/UX concepts before integrating them into production applications.',
      techStack: ['Vue 3', 'React', 'TypeScript', 'Three.js', 'WebGL', 'Canvas API', 'Web Animations API', 'Vite'],
      features: [
        'Interactive demos of web technologies',
        'WebGL and Three.js experiments',
        'CSS animations and transitions showcase',
        'Component library prototypes',
        'API integration examples',
        'Performance optimization tests',
        'Accessibility experiments',
        'Responsive design patterns',
        'Dark mode implementations',
        'Micro-interactions gallery'
      ]
    }
  },
  {
    id: 'portfolio',
    name: 'iruhernandez.com',
    shortDescription: 'Modern Vue 3 portfolio with custom features',
    type: 'owned',
    category: 'web-app',
    github: 'iruhernandez.com',
    liveUrl: 'https://iruhernandez.com',
  },

  // Owned - Not Deployed
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    shortDescription: 'React Native AI-powered mobile assistant',
    type: 'owned',
    category: 'mobile',
    github: 'ai-assistant',
  },
  {
    id: 'nuxtpokeapp',
    name: 'Nuxt Pokemon App',
    shortDescription: 'Pokemon application built with Nuxt 3',
    type: 'owned',
    category: 'web-app',
    github: 'nuxtpokeapp',
  },
  {
    id: 'three-portfolio',
    name: 'Three.js Portfolio',
    shortDescription: '3D portfolio showcase with WebGL',
    type: 'owned',
    category: '3d-graphics',
    github: 'three-portfolio',
    liveUrl: 'https://iru97.github.io/three-portfolio/',
  },

  // Collaborative/Contributed Projects
  {
    id: 'metricool',
    name: 'Metricool',
    shortDescription: 'All-in-one social media analytics and management platform trusted by 2M+ users',
    type: 'collaborative',
    category: 'saas',
    liveUrl: 'https://app.metricool.com',
    role: 'Senior Frontend Developer',
    contribution: 'Led development of analytics dashboards, real-time data visualization, content scheduling system, and cross-platform mobile app. Optimized performance for handling millions of social media metrics daily.',
    customData: {
      fullDescription: 'Metricool is the definitive all-in-one tool for managing and analyzing social media presence across all major platforms. Trusted by over 2 million users worldwide, it provides comprehensive analytics, scheduling, and ad management capabilities for businesses, agencies, and content creators.',
      features: [
        'Unified analytics across 10+ social networks (Instagram, Facebook, TikTok, LinkedIn, Twitter, YouTube, Pinterest)',
        'Advanced content scheduling with best time to post recommendations',
        'AI-powered content assistant for caption generation',
        'Unified inbox managing all social interactions in one place',
        'Ad campaign management for Facebook, Instagram, Google, and TikTok',
        'Custom white-label reports with automated generation',
        'Competitor analysis and hashtag tracking',
        'SmartLinks for bio link optimization',
        'Team collaboration tools with role-based permissions',
        'Real-time notifications and alerts'
      ],
      techStack: ['Vue.js', 'TypeScript', 'Chart.js', 'Ionic', 'Capacitor', 'Java', 'Spring Boot', 'MySQL', 'Redis', 'WebSockets'],
      teamSize: 12,
      duration: '2+ years',
      achievements: [
        'Part of frontend team that started with 3 developers and scaled to 12',
        'Implemented real-time analytics processing 10M+ metrics daily',
        'Reduced dashboard load time by 60% through optimization',
        'Built responsive charts handling datasets with 100k+ data points'
      ]
    }
  },
  {
    id: 'metricool-mobile',
    name: 'Metricool Mobile App',
    shortDescription: 'Cross-platform mobile app for social media analytics with 500k+ downloads',
    type: 'collaborative',
    category: 'mobile',
    liveUrl: 'https://metricool.com',
    role: 'Lead Mobile Developer',
    contribution: 'Architected and developed cross-platform mobile application from scratch using Ionic and Capacitor. Implemented offline-first architecture, real-time sync, push notifications system, and native device integrations for both iOS and Android platforms.',
    customData: {
      fullDescription: 'Official Metricool mobile application providing full-featured social media analytics and management on iOS and Android. Built with cross-platform technologies to deliver native performance while maintaining a single codebase, serving over 500,000 active users.',
      features: [
        'Complete analytics dashboard optimized for mobile',
        'Post scheduling with image editor and preview',
        'Push notifications for metric alerts and milestones',
        'Offline mode with background synchronization',
        'Native camera integration for content creation',
        'Biometric authentication (Face ID, Touch ID)',
        'Quick actions and widgets',
        'Deep linking for seamless navigation',
        'Share extension for instant posting',
        'Dark mode support',
        'Multi-account management'
      ],
      techStack: ['Ionic 7', 'Capacitor', 'Vue.js 3', 'TypeScript', 'Chart.js', 'Native APIs', 'SQLite'],
      duration: '2+ years',
      achievements: [
        '500k+ combined downloads on iOS and Android',
        '4.5+ star rating on both app stores',
        'Reduced app size by 40% through optimization',
        'Implemented offline-first with IndexedDB sync'
      ],
      additionalLinks: [
        { label: 'iOS App', url: 'https://apps.apple.com/us/app/metricool/id1072510529', icon: 'fab fa-apple' },
        { label: 'Android App', url: 'https://play.google.com/store/apps/details?id=com.ionicframework.metricool185346', icon: 'fab fa-google-play' }
      ]
    }
  },
  {
    id: 'myolab-self',
    name: 'MyoLab Self',
    shortDescription: 'Cutting-edge embodied AI platform creating personalized human digital twins',
    type: 'collaborative',
    category: 'ai-platform',
    liveUrl: 'https://self.myolab.ai',
    role: 'Senior Frontend Engineer (Contractor)',
    contribution: 'Architected and built the entire frontend application for MyoLab\'s embodied AI platform. Implemented real-time 3D avatar rendering, emotional expression systems, and complex WebGL visualizations. Collaborated directly with AI/ML team to integrate embodied intelligence models into interactive user experiences.',
    customData: {
      fullDescription: 'MyoLab Self is a revolutionary embodied AI platform that creates personalized human digital twins with embodied intelligence. The platform accurately predicts an individual\'s physiology, cognition, and behavior to enable hyper-personalized experiences in health, search, and e-commerce. Building human-embodied intelligence to empower humans.',
      features: [
        'Real-time 3D embodied avatars with musculoskeletal models',
        'Interactive emotional and physical expression systems',
        'Personalized digital twin creation and customization',
        'Human-like AI interactions with natural language processing',
        'Predictive health and behavior modeling',
        'WebGL-powered real-time rendering',
        'Responsive avatar controls and manipulation',
        'Cross-device compatibility',
        'Privacy-first data handling',
        'Integration with AI/ML prediction models'
      ],
      techStack: ['Vue 3', 'TypeScript', 'Three.js', 'TresJS', 'MediaPipe Pose', 'FFmpeg', 'Chart.js', 'Firebase', 'Ant Design Icons', 'FontAwesome', 'Sentry', 'Tailwind CSS', 'Markdown-it', 'Pinia'],
      duration: '1 year',
      achievements: [
        'Built 3D rendering engine handling complex skeletal animations',
        'Implemented real-time expression system with 60fps performance',
        'Optimized WebGL shaders reducing GPU load by 45%',
        'Created reusable 3D component library'
      ]
    }
  },
  {
    id: 'myolab-demo',
    name: 'MyoLab Demo',
    shortDescription: 'Interactive showcase demonstrating embodied AI capabilities and use cases',
    type: 'collaborative',
    category: 'ai-platform',
    liveUrl: 'https://demo.myolab.ai',
    role: 'Frontend Engineer (Contractor)',
    contribution: 'Developed interactive demo experiences showcasing MyoLab\'s embodied AI technology. Created engaging visualizations and interactive scenarios demonstrating real-world applications of human digital twins in healthcare, fitness, and personalized recommendations.',
    customData: {
      fullDescription: 'Interactive demonstration platform showcasing MyoLab\'s embodied AI technology and its practical applications. Features live demos of digital twin creation, predictive modeling, and personalized AI interactions across various use cases including health optimization, movement analysis, and cognitive behavioral predictions.',
      features: [
        'Interactive embodied AI demonstrations',
        'Live digital twin creation showcase',
        'Real-time prediction visualizations',
        'Use case scenario walkthroughs',
        'Interactive 3D model exploration',
        'Performance metrics visualization',
        'Side-by-side comparison tools',
        'Educational content and explanations'
      ],
      techStack: ['Vue 3', 'TypeScript', 'Three.js', 'TresJS', 'MediaPipe Pose', 'FFmpeg', 'Chart.js', 'Firebase', 'Tailwind CSS', 'Pinia'],
      duration: '6 months'
    }
  },
  {
    id: 'kinephy-canvas',
    name: 'Kinephy Canvas',
    shortDescription: 'AI-powered animation creation platform with intelligent motion generation',
    type: 'collaborative',
    category: 'ai-platform',
    liveUrl: 'https://canvas.kinephy.ai',
    role: 'Frontend Developer',
    contribution: 'Developed the canvas-based animation editor and AI tooling interface. Implemented real-time rendering system, timeline editor, and integration with AI motion generation models. Built intuitive controls for AI-assisted animation creation.',
    customData: {
      fullDescription: 'Kinephy Canvas is an innovative AI-powered animation platform that combines traditional animation tools with cutting-edge AI motion generation. The platform enables creators to generate, edit, and refine animations using intelligent assistance, making professional-quality animation accessible to both experts and beginners.',
      features: [
        'AI-powered motion generation and retargeting',
        'Real-time canvas-based animation editor',
        'Timeline editing with frame-level control',
        'Intelligent keyframe suggestions',
        'Motion library with AI categorization',
        'Character rigging tools',
        'Export to multiple animation formats',
        'Collaborative editing support',
        'Preset animation templates',
        'Physics-based motion simulation'
      ],
      techStack: ['Vue 3', 'TypeScript', 'Three.js', 'TresJS', 'Stripe', 'Firebase', 'FFmpeg', 'Tailwind CSS 4', 'Axios', 'Pinia', 'Vite'],
      duration: '8 months',
      achievements: [
        'Built high-performance canvas rendering at 60fps',
        'Implemented undo/redo system with efficient state management',
        'Integrated AI models for real-time motion prediction'
      ]
    }
  },
];

/**
 * Fetches GitHub repository data
 */
async function fetchGitHubData(repoName: string): Promise<GitHubMetadata | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`);
    if (!response.ok) return null;

    const data = await response.json();

    return {
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      lastUpdate: data.updated_at,
      topics: data.topics || [],
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${repoName}:`, error);
    return null;
  }
}

/**
 * Fetches README content from GitHub
 */
async function fetchReadme(repoName: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
      headers: { Accept: 'application/vnd.github.raw' }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return null;
  }
}

/**
 * Extracts image URLs from markdown
 */
function extractImagesFromMarkdown(markdown: string): string[] {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const images: string[] = [];
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push(match[1]);
  }

  return images;
}

/**
 * Generates screenshot URL for a live website
 */
function getScreenshotUrl(url: string): string {
  // Using screenshotone demo API (limited requests)
  // For production, get a free API key at https://screenshotone.com
  // Or use placeholder and add screenshots manually to /public/projects/
  return `${SCREENSHOT_API_URL}${encodeURIComponent(url)}&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=jpg&image_quality=80&block_ads=true&block_cookie_banners=true&block_trackers=true&cache=true&cache_ttl=2592000`;
}

/**
 * Gets local screenshots and logo for a project
 */
function getLocalProjectAssets(projectId: string): {
  thumbnail: string | null;
  logo: string | null;
  logoFull: string | null;
  images: ProjectImage[];
} {
  // Map project IDs to screenshot folder names
  const folderMap: Record<string, string> = {
    'kinephy-canvas': 'kinephy',
    'myolab-self': 'myolab',
    'myolab-demo': 'myolab',
    'portfolio': 'iruhernandez',
  };

  const folderName = folderMap[projectId] || projectId;
  const screenshotsDir = join(process.cwd(), 'public', 'screenshots', folderName);

  if (!existsSync(screenshotsDir)) {
    return { thumbnail: null, logo: null, logoFull: null, images: [] };
  }

  const files = readdirSync(screenshotsDir);
  const images: ProjectImage[] = [];
  let thumbnail: string | null = null;
  let logo: string | null = null;
  let logoFull: string | null = null;

  // Look for main screenshot
  const mainFile = files.find(f => f.toLowerCase() === 'main.png');
  if (mainFile) {
    thumbnail = `/screenshots/${folderName}/${mainFile}`;
    images.push({
      url: thumbnail,
      alt: `${projectId} main screenshot`,
      type: 'screenshot'
    });
  }

  // Look for logo files
  // Simple logo: logo-icon, logo-simple, favico (cuadrado para cards)
  const logoSimpleFile = files.find(f =>
    (f.toLowerCase().includes('logo-icon') ||
    f.toLowerCase().includes('logo-simple') ||
    f.toLowerCase().includes('favico')) &&
    !f.toLowerCase().includes('full') &&
    !f.toLowerCase().includes('main')
  );
  if (logoSimpleFile) {
    logo = `/screenshots/${folderName}/${logoSimpleFile}`;
  }

  // Full logo: logo-full (rectangular con texto para modal)
  const logoFullFile = files.find(f => f.toLowerCase().includes('logo-full'));
  if (logoFullFile) {
    logoFull = `/screenshots/${folderName}/${logoFullFile}`;
  }

  // If no simple logo but has full logo, use a generic logo file
  if (!logo) {
    const genericLogoFile = files.find(f =>
      f.toLowerCase().includes('logo') &&
      !f.toLowerCase().includes('full') &&
      !f.toLowerCase().includes('main')
    );
    if (genericLogoFile) {
      logo = `/screenshots/${folderName}/${genericLogoFile}`;
    }
  }

  // Add additional screenshots (excluding main and logo files)
  const additionalFiles = files.filter(f =>
    f.toLowerCase().endsWith('.png') &&
    f.toLowerCase() !== 'main.png' &&
    !f.toLowerCase().includes('logo') &&
    !f.toLowerCase().includes('icon') &&
    !f.toLowerCase().includes('favico')
  );

  for (const file of additionalFiles) {
    images.push({
      url: `/screenshots/${folderName}/${file}`,
      alt: `${projectId} screenshot`,
      type: 'screenshot'
    });
  }

  return { thumbnail, logo, logoFull, images };
}

/**
 * Processes a single project configuration
 */
async function processProject(config: ProjectConfig, githubDatabase: any): Promise<Project> {
  console.log(`Processing project: ${config.name}`);

  // Find GitHub data from pre-fetched database
  let githubData: GitHubMetadata | null = null;
  let readme: string | null = null;
  let features: string[] = [];
  let fullDescription = config.shortDescription;
  let techStack: string[] = [];

  if (config.github) {
    const repoName = config.github.includes('/') ? config.github.split('/').pop()! : config.github;
    const repoData = githubDatabase.repositories.find((r: any) => r.name === repoName);

    if (repoData) {
      githubData = {
        url: repoData.url,
        stars: repoData.stars,
        forks: repoData.forks,
        language: repoData.language,
        lastUpdate: repoData.updated_at,
        topics: repoData.topics || [],
      };

      fullDescription = repoData.readme_summary || config.shortDescription;
      features = repoData.key_features || [];
      techStack = repoData.tech_stack || [];
    }
  }

  // Get local assets (screenshots and logo)
  const localAssets = getLocalProjectAssets(config.id);

  // Use local images if available, otherwise fallback to screenshot API
  let images: ProjectImage[] = [];
  let thumbnail: string;
  let logo: string | undefined;
  let logoFull: string | undefined;

  if (localAssets.thumbnail) {
    // Use local screenshots
    thumbnail = localAssets.thumbnail;
    images = localAssets.images;
    logo = localAssets.logo || undefined;
    logoFull = localAssets.logoFull || undefined;
  } else {
    // No local images available - use placeholder
    thumbnail = '/projects/placeholder.jpg';
    images = [];
  }

  // Merge custom data
  const customData = config.customData || {};

  const project: Project = {
    id: config.id,
    name: config.name,
    shortDescription: config.shortDescription,
    fullDescription,

    thumbnail,
    logo: customData.logo || logo,
    logoFull: customData.logoFull || logoFull,
    images,

    type: config.type,
    category: config.category,
    featured: config.type === 'owned' && !!config.liveUrl,
    tags: githubData?.topics || [],
    techStack: customData.techStack || techStack,

    github: githubData || undefined,
    liveUrl: config.liveUrl,

    features: customData.features || features,

    role: config.role,
    contribution: config.contribution,
    teamSize: customData.teamSize,
    duration: customData.duration,

    additionalLinks: customData.additionalLinks,

    lastUpdated: githubData?.lastUpdate || new Date().toISOString(),
    ...customData,
  };

  return project;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting automated project data collection...\n');

  // Load pre-fetched GitHub database
  const githubDatabasePath = join(process.cwd(), 'github-projects-database.json');
  let githubDatabase: any = { repositories: [] };

  try {
    const { readFileSync } = await import('fs');
    githubDatabase = JSON.parse(readFileSync(githubDatabasePath, 'utf-8'));
    console.log(`✅ Loaded GitHub database with ${githubDatabase.repositories.length} repositories\n`);
  } catch (error) {
    console.warn('⚠️  Could not load GitHub database, continuing without it...\n');
  }

  // Process all projects
  const projects: Project[] = [];

  for (const config of PROJECT_CONFIGS) {
    const project = await processProject(config, githubDatabase);
    projects.push(project);
  }

  // Create final database
  const database: ProjectsDatabase = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    projects: projects.sort((a, b) => {
      // Sort: featured first, then by type (owned, collaborative, contributed)
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.type.localeCompare(b.type);
    }),
  };

  // Write to file
  const outputPath = join(process.cwd(), 'src', 'data', 'projects.json');
  writeFileSync(outputPath, JSON.stringify(database, null, 2));

  console.log(`\n✅ Successfully generated projects database!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Total projects: ${projects.length}`);
  console.log(`⭐ Featured: ${projects.filter(p => p.featured).length}`);
  console.log(`👤 Owned: ${projects.filter(p => p.type === 'owned').length}`);
  console.log(`🤝 Collaborative: ${projects.filter(p => p.type === 'collaborative').length}\n`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as generateProjectsDatabase };

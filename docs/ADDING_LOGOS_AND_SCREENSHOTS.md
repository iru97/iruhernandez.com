# Adding Logos and Screenshots to Projects

## Project Logos

Para añadir logos a tus proyectos:

### 1. Preparar el Logo

- **Tamaño recomendado**: 200x200px (mínimo) o formatos cuadrados
- **Formato**: PNG con fondo transparente (preferido) o SVG
- **Ubicación**: Guarda el logo en `/public/projects/logos/`

### 2. Nombrar el Archivo

Usa el ID del proyecto como nombre del archivo:
```
/public/projects/logos/meshmotion.png
/public/projects/logos/metricool.png
/public/projects/logos/analyticsmind.svg
```

### 3. Añadir al Script

Edita `scripts/fetch-project-data.ts` y añade el logo en la configuración del proyecto:

```typescript
{
  id: 'meshmotion',
  name: 'MeshMotion',
  // ... otros campos
  customData: {
    logo: '/projects/logos/meshmotion.png'
  }
}
```

### 4. Regenerar Datos

```bash
npm run fetch-projects
```

## Screenshots

### Opción 1: Screenshots Automáticos (Recomendado para sitios públicos)

El script genera automáticamente screenshots para todos los proyectos con `liveUrl` usando screenshotone.com.

**Limitación**: La API demo tiene límite de requests. Para producción, obtén una API key gratuita:
1. Regístrate en https://screenshotone.com (free tier: 100 screenshots/mes)
2. Obtén tu API key
3. Reemplaza en `scripts/fetch-project-data.ts`:
```typescript
const SCREENSHOT_API_URL = 'https://api.screenshotone.com/take?access_key=TU_API_KEY&url=';
```

### Opción 2: Screenshots Manuales (Recomendado para mejor calidad)

1. Toma screenshots de tus proyectos (1200x800px recomendado)
2. Guárdalos en `/public/projects/screenshots/`
3. Nombra según el ID del proyecto:
   ```
   /public/projects/screenshots/meshmotion.jpg
   /public/projects/screenshots/metricool.jpg
   ```
4. Edita el proyecto en `scripts/fetch-project-data.ts`:
   ```typescript
   customData: {
     thumbnail: '/projects/screenshots/meshmotion.jpg',
     images: [
       { url: '/projects/screenshots/meshmotion.jpg', alt: 'MeshMotion screenshot', type: 'screenshot' },
       { url: '/projects/screenshots/meshmotion-2.jpg', alt: 'MeshMotion interface', type: 'screenshot' }
     ]
   }
   ```

### Opción 3: Múltiples Imágenes por Proyecto

Para proyectos con galería de imágenes:

```typescript
customData: {
  images: [
    { url: '/projects/screenshots/meshmotion-1.jpg', alt: 'Home screen', type: 'screenshot' },
    { url: '/projects/screenshots/meshmotion-2.jpg', alt: 'Editor view', type: 'screenshot' },
    { url: '/projects/screenshots/meshmotion-3.jpg', alt: 'Animation timeline', type: 'screenshot' },
    { url: '/projects/diagrams/architecture.png', alt: 'System architecture', type: 'diagram' }
  ]
}
```

## Ejemplo Completo

```typescript
{
  id: 'meshmotion',
  name: 'MeshMotion',
  shortDescription: 'Advanced 3D GLB animation viewer',
  type: 'owned',
  category: '3d-graphics',
  github: 'meshmotion.es',
  liveUrl: 'https://meshmotion.es',
  customData: {
    logo: '/projects/logos/meshmotion.png',
    thumbnail: '/projects/screenshots/meshmotion-hero.jpg',
    images: [
      { url: '/projects/screenshots/meshmotion-hero.jpg', alt: 'MeshMotion home', type: 'screenshot' },
      { url: '/projects/screenshots/meshmotion-editor.jpg', alt: 'Animation editor', type: 'screenshot' },
      { url: '/projects/screenshots/meshmotion-timeline.jpg', alt: 'Timeline controls', type: 'screenshot' }
    ],
    techStack: ['Next.js 15', 'React Three Fiber', 'TypeScript'],
    features: [
      'GLB animation playback',
      'Professional lighting controls',
      'Timeline editing'
    ]
  }
}
```

## Tips

### Optimización de Imágenes

Antes de subirlas, optimiza tus imágenes:
- Usa herramientas como TinyPNG, Squoosh, o ImageOptim
- Formato JPEG para screenshots (80-85% calidad)
- Formato PNG para logos con transparencia
- Formato WebP para mejor compresión (soporte moderno)

### Dimensiones Recomendadas

- **Logos**: 200x200px (cuadrados)
- **Thumbnails de cards**: 1200x800px o 16:9
- **Screenshots del modal**: 1200x800px mínimo
- **Diagramas**: Variable, pero mantén legibilidad

### Donde Guardar los Archivos

```
public/
└── projects/
    ├── logos/
    │   ├── meshmotion.png
    │   ├── metricool.png
    │   └── myolab.svg
    ├── screenshots/
    │   ├── meshmotion-1.jpg
    │   ├── meshmotion-2.jpg
    │   └── metricool-dashboard.jpg
    └── placeholder.jpg  (fallback automático)
```

## Regenerar Proyectos

Después de añadir logos o editar configuraciones:

```bash
npm run fetch-projects
npm run dev  # para ver cambios
# o
npm run build  # para producción
```

## Troubleshooting

**Las imágenes no se ven:**
- Verifica que las rutas sean correctas
- Asegúrate de que los archivos estén en `/public/`
- Usa rutas absolutas: `/projects/logos/logo.png` (NO `../logos/logo.png`)
- Regenera el JSON: `npm run fetch-projects`

**Los logos se ven distorsionados:**
- Usa imágenes cuadradas (mismo width y height)
- Formato PNG con fondo transparente funciona mejor
- El CSS aplica `object-fit: contain` automáticamente

**Screenshots automáticos fallan:**
- La API demo tiene límites de rate
- Usa screenshots manuales (opción 2) para producción
- O consigue una API key gratuita de screenshotone.com

/**
 * Gradient - Clase principal para Stripe-style WebGL Mesh Gradient
 *
 * Orquesta MiniGl, shaders y animación para crear
 * el efecto de gradiente mesh animado.
 *
 * Uso:
 * ```ts
 * const gradient = new Gradient(canvasElement, isDark);
 * gradient.play();
 * ```
 */

import { MiniGl, Material, PlaneGeometry, Mesh } from './MiniGl';
import { vertexShader, fragmentShader } from './shaders';
import { gradientConfig, colorUtils, performanceConfig } from '@/config/gradientConfig';

export interface GradientOptions {
  isDark?: boolean;
  enableScroll?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export class Gradient {
  private minigl: MiniGl;
  private canvas: HTMLCanvasElement;
  private material: Material | null = null;
  private mesh: Mesh | null = null;
  private animationId: number | null = null;
  private time: number = 0;
  private scrollY: number = 0;
  private isDark: boolean = false;
  private isPlaying: boolean = false;
  private enableScroll: boolean = true;
  private resizeObserver: ResizeObserver | null = null;
  private isMobile: boolean = false;

  constructor(canvas: HTMLCanvasElement, options: GradientOptions = {}) {
    this.canvas = canvas;
    this.isDark = options.isDark || false;
    this.enableScroll = options.enableScroll !== false;

    try {
      // Detectar si es móvil
      this.isMobile = window.innerWidth <= 1024;

      // Inicializar MiniGl
      this.minigl = new MiniGl(canvas);

      // Setup gradient
      this.setupGradient();

      // Setup resize observer
      this.setupResizeObserver();

      // Callback de ready
      if (options.onReady) {
        options.onReady();
      }
    } catch (error) {
      console.error('Gradient initialization error:', error);
      if (options.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Configura el gradiente con geometría, material y mesh
   */
  private setupGradient(): void {
    const colors = this.isDark ? gradientConfig.dark : gradientConfig.light;
    const config = this.isMobile ? performanceConfig.mobile : performanceConfig.desktop;

    // Convertir colores hex a RGB
    const color1 = colorUtils.hexToRgb(colors.color1);
    const color2 = colorUtils.hexToRgb(colors.color2);
    const color3 = colorUtils.hexToRgb(colors.color3);
    const color4 = colorUtils.hexToRgb(colors.color4);

    // Crear material con shaders y uniforms
    this.material = new Material({
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: color1 },
        u_color2: { value: color2 },
        u_color3: { value: color3 },
        u_color4: { value: color4 },
        u_amplitude: { value: config.amplitude },
        u_scroll: { value: 0 },
        u_projection: { value: this.minigl.createOrthoMatrix() },
        u_alpha: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    });

    // Compilar shaders
    this.material.compile(this.minigl.gl);

    // Crear geometría plana segmentada
    const geometry = new PlaneGeometry(2, 2, config.meshSegments, config.meshSegments);
    geometry.createBuffers(this.minigl.gl);

    // Crear mesh
    this.mesh = new Mesh(geometry, this.material);
    this.minigl.meshes.push(this.mesh);
  }

  /**
   * Actualiza los colores del gradiente (cambio de tema)
   */
  updateTheme(isDark: boolean): void {
    if (this.isDark === isDark || !this.material) return;

    this.isDark = isDark;
    const colors = isDark ? gradientConfig.dark : gradientConfig.light;

    // Actualizar uniforms de colores
    this.material.uniforms.u_color1.value = colorUtils.hexToRgb(colors.color1);
    this.material.uniforms.u_color2.value = colorUtils.hexToRgb(colors.color2);
    this.material.uniforms.u_color3.value = colorUtils.hexToRgb(colors.color3);
    this.material.uniforms.u_color4.value = colorUtils.hexToRgb(colors.color4);
  }

  /**
   * Actualiza el offset de scroll para efecto parallax
   */
  updateScroll(scrollY: number): void {
    if (!this.enableScroll || !this.material) return;

    this.scrollY = scrollY * gradientConfig.scroll.parallaxFactor;
    this.material.uniforms.u_scroll.value = this.scrollY * 0.001;
  }

  /**
   * Loop de animación principal
   */
  private animate = (): void => {
    if (!this.isPlaying || !this.material) return;

    // Incrementar tiempo
    this.time += gradientConfig.animation.speed;
    this.material.uniforms.u_time.value = this.time;

    // Renderizar
    this.minigl.render();

    // Siguiente frame
    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Inicia la animación
   */
  play(): void {
    if (this.isPlaying) return;

    // Verificar prefers-reduced-motion
    if (performanceConfig.accessibility.respectReducedMotion) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        console.log('Gradient animation disabled due to prefers-reduced-motion');
        return;
      }
    }

    this.isPlaying = true;
    this.animate();
  }

  /**
   * Pausa la animación
   */
  pause(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Configura observer para resize automático
   */
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    this.resizeObserver.observe(this.canvas);
  }

  /**
   * Maneja resize del canvas
   */
  private handleResize(): void {
    this.minigl.resize();

    // Actualizar matriz de proyección
    if (this.material) {
      this.material.uniforms.u_projection.value = this.minigl.createOrthoMatrix();
    }

    // Re-detectar si es móvil y ajustar calidad
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 1024;

    if (wasMobile !== this.isMobile) {
      // Cambió de móvil a desktop o viceversa
      // Recrear geometría con diferente densidad
      this.recreateGradient();
    }
  }

  /**
   * Recrea el gradiente (útil para cambios de calidad)
   */
  private recreateGradient(): void {
    // Limpiar mesh actual
    if (this.mesh) {
      const index = this.minigl.meshes.indexOf(this.mesh);
      if (index > -1) {
        this.minigl.meshes.splice(index, 1);
      }
    }

    // Crear nuevo gradient
    this.setupGradient();
  }

  /**
   * Limpia recursos y detiene animación
   */
  destroy(): void {
    this.pause();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.minigl.dispose();
  }

  /**
   * Getters para estado
   */
  get playing(): boolean {
    return this.isPlaying;
  }

  get currentTime(): number {
    return this.time;
  }

  get currentScroll(): number {
    return this.scrollY;
  }
}

/**
 * Factory function para crear gradient con manejo de errores
 */
export function createGradient(
  canvas: HTMLCanvasElement,
  options: GradientOptions = {}
): Gradient | null {
  try {
    return new Gradient(canvas, options);
  } catch (error) {
    console.error('Failed to create gradient:', error);

    // Fallback: mostrar color sólido
    if (performanceConfig.accessibility.fallbackToStatic) {
      const isDark = options.isDark || false;
      const colors = isDark ? gradientConfig.dark : gradientConfig.light;
      canvas.style.backgroundColor = colors.color1;
    }

    if (options.onError) {
      options.onError(error as Error);
    }

    return null;
  }
}

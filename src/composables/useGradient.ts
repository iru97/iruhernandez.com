/**
 * useGradient Composable
 *
 * Composable de Vue 3 para gestionar el gradiente WebGL mesh.
 * Proporciona una interfaz reactiva para controlar el gradiente.
 *
 * Uso:
 * ```vue
 * <script setup>
 * const { canvasRef, initGradient, updateTheme } = useGradient();
 *
 * onMounted(() => {
 *   if (canvasRef.value) {
 *     initGradient(canvasRef.value, isDark.value);
 *   }
 * });
 * </script>
 * ```
 */

import { ref, onUnmounted, Ref } from 'vue';
import { Gradient, createGradient, type GradientOptions } from '@/lib/gradient/Gradient';

export interface UseGradientReturn {
  canvasRef: Ref<HTMLCanvasElement | null>;
  gradientInstance: Ref<Gradient | null>;
  isInitialized: Ref<boolean>;
  isPlaying: Ref<boolean>;
  error: Ref<Error | null>;
  initGradient: (canvas: HTMLCanvasElement, isDark: boolean, options?: GradientOptions) => void;
  updateTheme: (isDark: boolean) => void;
  updateScroll: (scrollY: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  destroy: () => void;
}

export function useGradient(): UseGradientReturn {
  // Refs
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const gradientInstance = ref<Gradient | null>(null);
  const isInitialized = ref(false);
  const isPlaying = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Inicializa el gradiente en el canvas
   */
  const initGradient = (
    canvas: HTMLCanvasElement,
    isDark: boolean = false,
    options: GradientOptions = {}
  ): void => {
    // Si ya hay una instancia, destruirla primero
    if (gradientInstance.value) {
      gradientInstance.value.destroy();
      gradientInstance.value = null;
    }

    // Reset error
    error.value = null;

    try {
      // Crear gradiente
      const gradient = createGradient(canvas, {
        isDark,
        enableScroll: options.enableScroll !== false,
        onReady: () => {
          isInitialized.value = true;
          if (options.onReady) {
            options.onReady();
          }
        },
        onError: (err) => {
          error.value = err;
          isInitialized.value = false;
          if (options.onError) {
            options.onError(err);
          }
        },
      });

      if (gradient) {
        gradientInstance.value = gradient;
        canvasRef.value = canvas;

        // Auto-play por defecto
        gradient.play();
        isPlaying.value = true;
      } else {
        throw new Error('Failed to create gradient instance');
      }
    } catch (err) {
      error.value = err as Error;
      isInitialized.value = false;
      console.error('Error initializing gradient:', err);
    }
  };

  /**
   * Actualiza el tema (light/dark)
   */
  const updateTheme = (isDark: boolean): void => {
    if (!gradientInstance.value) {
      console.warn('Cannot update theme: gradient not initialized');
      return;
    }

    gradientInstance.value.updateTheme(isDark);
  };

  /**
   * Actualiza el scroll position (parallax)
   */
  const updateScroll = (scrollY: number): void => {
    if (!gradientInstance.value) return;

    gradientInstance.value.updateScroll(scrollY);
  };

  /**
   * Inicia la animación
   */
  const play = (): void => {
    if (!gradientInstance.value) {
      console.warn('Cannot play: gradient not initialized');
      return;
    }

    gradientInstance.value.play();
    isPlaying.value = true;
  };

  /**
   * Pausa la animación
   */
  const pause = (): void => {
    if (!gradientInstance.value) {
      console.warn('Cannot pause: gradient not initialized');
      return;
    }

    gradientInstance.value.pause();
    isPlaying.value = false;
  };

  /**
   * Toggle play/pause
   */
  const toggle = (): void => {
    if (!gradientInstance.value) {
      console.warn('Cannot toggle: gradient not initialized');
      return;
    }

    gradientInstance.value.toggle();
    isPlaying.value = gradientInstance.value.playing;
  };

  /**
   * Destruye el gradiente y libera recursos
   */
  const destroy = (): void => {
    if (gradientInstance.value) {
      gradientInstance.value.destroy();
      gradientInstance.value = null;
      isInitialized.value = false;
      isPlaying.value = false;
    }
  };

  // Cleanup automático cuando el componente se desmonta
  onUnmounted(() => {
    destroy();
  });

  return {
    canvasRef,
    gradientInstance,
    isInitialized,
    isPlaying,
    error,
    initGradient,
    updateTheme,
    updateScroll,
    play,
    pause,
    toggle,
    destroy,
  };
}

/**
 * Composable simplificado para casos de uso básicos
 */
export function useSimpleGradient(isDark: Ref<boolean>) {
  const gradient = useGradient();

  const init = (canvas: HTMLCanvasElement) => {
    gradient.initGradient(canvas, isDark.value);
  };

  // Watch para cambios de tema
  // (Se puede implementar con watch si es necesario)

  return {
    ...gradient,
    init,
  };
}

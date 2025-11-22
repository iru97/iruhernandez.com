<template>
  <canvas
    ref="canvasElement"
    class="mesh-gradient-canvas"
    :class="{
      'is-dark': isDark,
      'is-initialized': isInitialized,
      'has-error': hasError
    }"
    :style="canvasStyle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useGradient } from '@/composables/useGradient';

/**
 * Props
 */
interface Props {
  isDark?: boolean;
  enableScroll?: boolean;
  autoPlay?: boolean;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false,
  enableScroll: true,
  autoPlay: true,
  zIndex: -1,
});

/**
 * Emits
 */
interface Emits {
  (e: 'ready'): void;
  (e: 'error', error: Error): void;
  (e: 'playing', isPlaying: boolean): void;
}

const emit = defineEmits<Emits>();

/**
 * Gradient composable
 */
const {
  canvasRef,
  isInitialized,
  isPlaying,
  error,
  initGradient,
  updateTheme,
  updateScroll: updateGradientScroll,
  play,
  pause,
} = useGradient();

/**
 * Local refs
 */
const canvasElement = ref<HTMLCanvasElement | null>(null);
const hasError = computed(() => error.value !== null);

/**
 * Computed style para z-index dinámico
 */
const canvasStyle = computed(() => ({
  zIndex: props.zIndex,
}));

/**
 * Lifecycle: Mounted
 */
onMounted(() => {
  if (!canvasElement.value) {
    console.error('Canvas element not found');
    return;
  }

  // Inicializar gradiente
  initGradient(canvasElement.value, props.isDark, {
    enableScroll: props.enableScroll,
    onReady: () => {
      emit('ready');

      // Auto-play si está habilitado
      if (!props.autoPlay) {
        pause();
      }
    },
    onError: (err) => {
      emit('error', err);
    },
  });
});

/**
 * Lifecycle: Unmounted
 * (cleanup se maneja en el composable)
 */

/**
 * Watch: Cambios de tema
 */
watch(() => props.isDark, (newIsDark) => {
  if (isInitialized.value) {
    updateTheme(newIsDark);
  }
});

/**
 * Watch: Estado de reproducción
 */
watch(isPlaying, (newIsPlaying) => {
  emit('playing', newIsPlaying);
});

/**
 * Métodos públicos expuestos
 */
const updateScroll = (scrollY: number) => {
  if (props.enableScroll) {
    updateGradientScroll(scrollY);
  }
};

const playAnimation = () => {
  play();
};

const pauseAnimation = () => {
  pause();
};

// Exponer métodos al componente padre
defineExpose({
  updateScroll,
  play: playAnimation,
  pause: pauseAnimation,
  isPlaying,
  isInitialized,
  hasError,
});
</script>

<style scoped>
.mesh-gradient-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.mesh-gradient-canvas.is-initialized {
  opacity: 1;
}

.mesh-gradient-canvas.has-error {
  display: none;
}

/* Asegurar que canvas esté detrás de todo por defecto */
.mesh-gradient-canvas {
  z-index: -1;
}

/*
  Nota: El z-index puede ser sobrescrito por la prop,
  pero por defecto siempre estará detrás del contenido
*/
</style>

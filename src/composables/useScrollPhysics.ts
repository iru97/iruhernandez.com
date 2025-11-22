/**
 * Composable para conectar scroll con física
 *
 * Gestiona el comportamiento de las geometrías 3D basado en el scroll
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { getScrollBehavior, type ScrollBehavior } from '@/config/threeConfig'

export interface ScrollPhysicsState {
  scrollY: number
  scrollPercent: number
  currentBehavior: ScrollBehavior
  isScrolling: boolean
}

export function useScrollPhysics() {
  const scrollY = ref(0)
  const scrollPercent = ref(0)
  const currentBehavior = ref<ScrollBehavior>(getScrollBehavior(0))
  const isScrolling = ref(false)

  let scrollTimeout: number | null = null

  /**
   * Calcular porcentaje de scroll
   */
  function calculateScrollPercent(): number {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY

    // Calcular porcentaje (0-100)
    const maxScroll = documentHeight - windowHeight
    const percent = (scrollTop / maxScroll) * 100

    return Math.min(Math.max(percent, 0), 100)
  }

  /**
   * Handler de scroll
   */
  function handleScroll() {
    scrollY.value = window.scrollY
    scrollPercent.value = calculateScrollPercent()

    // Obtener comportamiento actual según scroll
    const newBehavior = getScrollBehavior(scrollPercent.value)

    // Solo actualizar si cambió el comportamiento
    if (
      newBehavior.scrollRange[0] !== currentBehavior.value.scrollRange[0] ||
      newBehavior.scrollRange[1] !== currentBehavior.value.scrollRange[1]
    ) {
      currentBehavior.value = newBehavior
      console.log(
        `📜 Scroll behavior changed: ${newBehavior.scrollRange[0]}%-${newBehavior.scrollRange[1]}%`
      )
    }

    // Detectar si está scrolleando
    isScrolling.value = true

    if (scrollTimeout !== null) {
      window.clearTimeout(scrollTimeout)
    }

    scrollTimeout = window.setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  /**
   * Inicializar listener de scroll
   */
  function init() {
    // Calcular scroll inicial
    handleScroll()

    // Agregar listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    console.log('📜 Scroll physics listener initialized')
  }

  /**
   * Limpiar listener
   */
  function cleanup() {
    window.removeEventListener('scroll', handleScroll)

    if (scrollTimeout !== null) {
      window.clearTimeout(scrollTimeout)
    }

    console.log('🧹 Scroll physics listener cleaned up')
  }

  // Inicializar al montar
  onMounted(() => {
    init()
  })

  // Limpiar al desmontar
  onUnmounted(() => {
    cleanup()
  })

  /**
   * Obtener estado actual
   */
  function getState(): ScrollPhysicsState {
    return {
      scrollY: scrollY.value,
      scrollPercent: scrollPercent.value,
      currentBehavior: currentBehavior.value,
      isScrolling: isScrolling.value,
    }
  }

  /**
   * Interpolar suavemente entre dos valores
   */
  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  /**
   * Calcular factor de transición entre comportamientos
   * Devuelve 0-1 indicando qué tan avanzado está en el rango actual
   */
  function getTransitionFactor(): number {
    const [start, end] = currentBehavior.value.scrollRange
    const range = end - start
    const progress = scrollPercent.value - start

    return Math.min(Math.max(progress / range, 0), 1)
  }

  return {
    // State
    scrollY,
    scrollPercent,
    currentBehavior,
    isScrolling,

    // Methods
    getState,
    lerp,
    getTransitionFactor,
    init,
    cleanup,
  }
}

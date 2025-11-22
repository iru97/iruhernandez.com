<template>
  <div class="three-background">
    <canvas ref="canvasRef" class="three-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useThreePhysics } from '@/composables/useThreePhysics'
import { useScrollPhysics } from '@/composables/useScrollPhysics'
import {
  threeSceneConfig,
  getPerformanceConfig,
  type GeometryConfig,
} from '@/config/threeConfig'

/**
 * Props
 */
interface Props {
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false,
})

/**
 * Referencias
 */
const canvasRef = ref<HTMLCanvasElement | null>(null)

/**
 * Three.js core
 */
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animationFrameId: number | null = null

/**
 * Geometrías y meshes
 */
const meshes: THREE.Mesh[] = []

/**
 * Luces
 */
let ambientLight: THREE.AmbientLight | null = null
let directionalLight: THREE.DirectionalLight | null = null
let pointLight: THREE.PointLight | null = null

/**
 * Performance config
 */
const performanceConfig = getPerformanceConfig()

/**
 * Composables
 */
const {
  initPhysics,
  createRigidBody,
  updatePhysics,
  setGravity,
  setPhysicsEnabled,
  isInitialized: physicsInitialized,
} = useThreePhysics()

const {
  currentBehavior,
  scrollPercent,
} = useScrollPhysics()

/**
 * Clock para delta time
 */
const clock = new THREE.Clock()

/**
 * Crear geometría según tipo
 */
function createGeometry(type: string): THREE.BufferGeometry {
  switch (type) {
    case 'box':
      return new THREE.BoxGeometry(1, 1, 1)
    case 'sphere':
      return new THREE.SphereGeometry(1, 32, 32)
    case 'torus':
      return new THREE.TorusGeometry(1, 0.4, 16, 100)
    case 'cone':
      return new THREE.ConeGeometry(1, 2, 32)
    case 'octahedron':
      return new THREE.OctahedronGeometry(1, 0)
    default:
      return new THREE.BoxGeometry(1, 1, 1)
  }
}

/**
 * Crear mesh desde configuración
 */
function createMesh(config: GeometryConfig): THREE.Mesh {
  const geometry = createGeometry(config.type)

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color),
    metalness: config.metalness || 0.5,
    roughness: config.roughness || 0.5,
  })

  const mesh = new THREE.Mesh(geometry, material)

  // Posición
  mesh.position.set(...config.position)

  // Escala
  mesh.scale.setScalar(config.scale)

  // Rotación inicial
  if (config.rotation) {
    mesh.rotation.set(...config.rotation)
  }

  return mesh
}

/**
 * Inicializar escena Three.js
 */
function initThreeScene() {
  if (!canvasRef.value) return

  // Crear escena
  scene = new THREE.Scene()
  scene.background = null // Transparente

  // Crear cámara
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(
    threeSceneConfig.camera.fov,
    aspect,
    0.1,
    1000
  )
  camera.position.copy(threeSceneConfig.camera.position)
  camera.lookAt(0, 0, 0)

  // Crear renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Crear luces
  const lightsConfig = threeSceneConfig.lights

  ambientLight = new THREE.AmbientLight(
    lightsConfig.ambient.color,
    lightsConfig.ambient.intensity
  )
  scene.add(ambientLight)

  directionalLight = new THREE.DirectionalLight(
    lightsConfig.directional.color,
    lightsConfig.directional.intensity
  )
  directionalLight.position.copy(lightsConfig.directional.position)
  scene.add(directionalLight)

  pointLight = new THREE.PointLight(
    lightsConfig.point.color,
    lightsConfig.point.intensity
  )
  pointLight.position.copy(lightsConfig.point.position)
  scene.add(pointLight)

  // Crear geometrías
  const activeGeometries = threeSceneConfig.geometries.slice(
    0,
    performanceConfig.geometryCount
  )

  activeGeometries.forEach((config) => {
    const mesh = createMesh(config)
    scene!.add(mesh)
    meshes.push(mesh)
  })

  console.log('✅ Three.js scene initialized')
}

/**
 * Inicializar física
 */
async function setupPhysics() {
  if (!performanceConfig.physicsEnabled) {
    console.log('⚠️ Physics disabled for performance')
    return
  }

  await initPhysics(threeSceneConfig.physics)

  // Crear rigid bodies para cada mesh
  meshes.forEach((mesh) => {
    createRigidBody(mesh, threeSceneConfig.physics)
  })

  console.log('✅ Physics initialized')
}

/**
 * Rotación manual (cuando no hay física)
 */
function rotateGeometries(delta: number) {
  const speed = currentBehavior.value.geometries.rotationSpeed

  meshes.forEach((mesh) => {
    if (!physicsInitialized.value) {
      mesh.rotation.x += speed * delta * 60
      mesh.rotation.y += speed * delta * 60 * 1.5
    }
  })
}

/**
 * Loop de animación
 */
function animate() {
  if (!scene || !camera || !renderer) return

  const delta = clock.getDelta()

  // Actualizar física o rotación manual
  if (physicsInitialized.value && performanceConfig.physicsEnabled) {
    updatePhysics(delta)
  } else {
    rotateGeometries(delta)
  }

  // Renderizar
  renderer.render(scene, camera)

  // Continuar loop
  animationFrameId = requestAnimationFrame(animate)
}

/**
 * Handle resize
 */
function handleResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

/**
 * Actualizar tema
 */
function updateTheme(isDark: boolean) {
  if (!renderer) return

  // Cambiar colores de luces según tema si es necesario
  // Por ahora mantenemos los colores constantes
}

/**
 * Watch scroll behavior changes
 */
watch(currentBehavior, (newBehavior) => {
  if (!performanceConfig.physicsEnabled) return

  // Actualizar gravedad según comportamiento
  const baseGravity = threeSceneConfig.physics.gravity
  setGravity(
    baseGravity.x,
    baseGravity.y,
    baseGravity.z,
    newBehavior.physics.gravityMultiplier
  )

  // Activar/desactivar física
  setPhysicsEnabled(newBehavior.physics.enabled)

  console.log(
    `🔄 Physics updated - Gravity: ${newBehavior.physics.gravityMultiplier}x, Enabled: ${newBehavior.physics.enabled}`
  )
})

/**
 * Watch theme changes
 */
watch(() => props.isDark, (newIsDark) => {
  updateTheme(newIsDark)
})

/**
 * Lifecycle - Mount
 */
onMounted(async () => {
  // Inicializar Three.js
  initThreeScene()

  // Inicializar física
  if (performanceConfig.physicsEnabled) {
    await setupPhysics()
  }

  // Iniciar loop de animación
  animate()

  // Agregar listener de resize
  window.addEventListener('resize', handleResize)

  console.log('🎨 ThreeBackground mounted (Three.js vanilla)')
})

/**
 * Lifecycle - Unmount
 */
onUnmounted(() => {
  // Cancelar animación
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  // Limpiar listeners
  window.removeEventListener('resize', handleResize)

  // Limpiar Three.js
  meshes.forEach((mesh) => {
    mesh.geometry.dispose()
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose()
    }
  })

  if (renderer) {
    renderer.dispose()
  }

  // Limpiar referencias
  scene = null
  camera = null
  renderer = null
  meshes.length = 0

  console.log('🧹 ThreeBackground cleaned up')
})
</script>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}

.three-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Efecto de fade en bordes para integración suave */
.three-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
}
</style>

<template>
  <div class="three-background">
    <TresCanvas
      v-bind="canvasProps"
      :clear-color="clearColor"
      window-size
    >
      <!-- Cámara -->
      <TresPerspectiveCamera
        :position="cameraPosition"
        :fov="cameraFov"
        :look-at="[0, 0, 0]"
      />

      <!-- Luces -->
      <TresAmbientLight
        :color="lights.ambient.color"
        :intensity="lights.ambient.intensity"
      />

      <TresDirectionalLight
        :color="lights.directional.color"
        :intensity="lights.directional.intensity"
        :position="lights.directional.position"
      />

      <TresPointLight
        :color="lights.point.color"
        :intensity="lights.point.intensity"
        :position="lights.point.position"
      />

      <!-- Geometrías -->
      <TresGroup ref="geometriesGroupRef">
        <TresMesh
          v-for="(geo, index) in activeGeometries"
          :key="`geometry-${index}`"
          :ref="(el) => setMeshRef(el, index)"
          :position="geo.position"
          :scale="geo.scale"
          :rotation="geo.rotation || [0, 0, 0]"
        >
          <!-- Geometría según tipo -->
          <component
            :is="getGeometryComponent(geo.type)"
            v-bind="getGeometryProps(geo.type)"
          />

          <!-- Material -->
          <TresMeshStandardMaterial
            :color="geo.color"
            :metalness="geo.metalness || 0.5"
            :roughness="geo.roughness || 0.5"
          />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { useLoop } from '@tresjs/core'
import { useThreePhysics } from '@/composables/useThreePhysics'
import { useScrollPhysics } from '@/composables/useScrollPhysics'
import {
  threeSceneConfig,
  getPerformanceConfig,
  type GeometryType,
} from '@/config/threeConfig'
import type { Mesh } from 'three'

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
 * Canvas props
 */
const canvasProps = {
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance' as const,
}

/**
 * Color de fondo (transparente)
 */
const clearColor = computed(() =>
  props.isDark ? '#0a0a0a' : '#ffffff'
)

/**
 * Configuración de cámara
 */
const cameraPosition = computed(() => threeSceneConfig.camera.position.toArray())
const cameraFov = computed(() => threeSceneConfig.camera.fov)

/**
 * Configuración de luces
 */
const lights = computed(() => threeSceneConfig.lights)

/**
 * Geometrías activas según performance
 */
const performanceConfig = getPerformanceConfig()
const activeGeometries = computed(() => {
  return threeSceneConfig.geometries.slice(0, performanceConfig.geometryCount)
})

/**
 * Referencias a meshes
 */
const meshes = ref<Mesh[]>([])
const geometriesGroupRef = ref()

function setMeshRef(el: any, index: number) {
  if (el && el.value) {
    meshes.value[index] = el.value as Mesh
  }
}

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
  getTransitionFactor,
} = useScrollPhysics()

/**
 * Obtener componente de geometría según tipo
 */
function getGeometryComponent(type: GeometryType) {
  const components = {
    box: 'TresBoxGeometry',
    sphere: 'TresSphereGeometry',
    torus: 'TresTorusGeometry',
    cone: 'TresConeGeometry',
    octahedron: 'TresOctahedronGeometry',
  }

  return components[type] || 'TresBoxGeometry'
}

/**
 * Obtener props de geometría según tipo
 */
function getGeometryProps(type: GeometryType) {
  const props: Record<string, any> = {}

  switch (type) {
    case 'box':
      props.args = [1, 1, 1]
      break
    case 'sphere':
      props.args = [1, 32, 32]
      break
    case 'torus':
      props.args = [1, 0.4, 16, 100]
      break
    case 'cone':
      props.args = [1, 2, 32]
      break
    case 'octahedron':
      props.args = [1, 0]
      break
  }

  return props
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
  meshes.value.forEach((mesh) => {
    if (mesh) {
      createRigidBody(mesh, threeSceneConfig.physics)
    }
  })

  console.log('✅ Physics setup complete')
}

/**
 * Rotación manual para meshes sin física
 */
const rotationSpeed = ref(0.001)

function rotateGeometries(delta: number) {
  const speed = currentBehavior.value.geometries.rotationSpeed

  meshes.value.forEach((mesh, index) => {
    if (mesh && !physicsInitialized.value) {
      // Rotación manual cuando física está desactivada
      mesh.rotation.x += speed * delta * 60
      mesh.rotation.y += speed * delta * 60 * 1.5
    }
  })
}

/**
 * Loop de renderizado
 */
const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  // Actualizar física si está habilitada
  if (physicsInitialized.value && performanceConfig.physicsEnabled) {
    updatePhysics(delta)
  } else {
    // Si no hay física, rotar manualmente
    rotateGeometries(delta)
  }
})

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
 * Lifecycle
 */
onMounted(async () => {
  // Esperar a que las meshes estén listas
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Setup physics si está habilitado
  if (performanceConfig.physicsEnabled) {
    await setupPhysics()
  }

  console.log('🎨 ThreeBackground mounted')
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

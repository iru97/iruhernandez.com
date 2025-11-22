/**
 * Composable para manejar física con Rapier en Three.js
 *
 * Gestiona el mundo de física, rigid bodies, colisiones y gravedad
 */

import { ref, onUnmounted } from 'vue'
import type { Mesh, Object3D } from 'three'
import type { PhysicsConfig } from '@/config/threeConfig'
import RAPIER from '@dimforge/rapier3d'

/**
 * Tipo para un cuerpo físico
 */
interface PhysicsBody {
  rigidBody: RAPIER.RigidBody
  collider: RAPIER.Collider
  mesh: Mesh
}

/**
 * Composable de física
 */
export function useThreePhysics() {
  const world = ref<RAPIER.World | null>(null)
  const bodies = ref<PhysicsBody[]>([])
  const isInitialized = ref(false)
  const gravityMultiplier = ref(1)

  /**
   * Inicializar el mundo de física
   */
  async function initPhysics(config: PhysicsConfig) {
    try {
      await RAPIER.init()

      const gravity = {
        x: config.gravity.x,
        y: config.gravity.y,
        z: config.gravity.z,
      }

      world.value = new RAPIER.World(gravity)
      isInitialized.value = true

      console.log('✅ Rapier physics initialized')
    } catch (error) {
      console.error('❌ Error initializing Rapier:', error)
    }
  }

  /**
   * Crear un rigid body para una mesh
   */
  function createRigidBody(
    mesh: Mesh,
    config: PhysicsConfig
  ): PhysicsBody | null {
    if (!world.value) {
      console.warn('Physics world not initialized')
      return null
    }

    // Crear rigid body descriptor (dinámico = afectado por gravedad)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
      .setRotation({
        x: mesh.quaternion.x,
        y: mesh.quaternion.y,
        z: mesh.quaternion.z,
        w: mesh.quaternion.w,
      })

    const rigidBody = world.value.createRigidBody(rigidBodyDesc)

    // Determinar tipo de collider según geometría
    let colliderDesc: RAPIER.ColliderDesc

    const geometry = mesh.geometry
    const geometryType = geometry.type

    if (geometryType === 'BoxGeometry') {
      // Para cubos, usar box collider
      const scale = mesh.scale.x
      colliderDesc = RAPIER.ColliderDesc.cuboid(scale / 2, scale / 2, scale / 2)
    } else if (geometryType === 'SphereGeometry') {
      // Para esferas, usar ball collider
      const scale = mesh.scale.x
      colliderDesc = RAPIER.ColliderDesc.ball(scale)
    } else if (geometryType === 'ConeGeometry') {
      // Para conos, aproximar con cilindro
      const scale = mesh.scale.x
      colliderDesc = RAPIER.ColliderDesc.cylinder(scale, scale / 2)
    } else {
      // Default: usar bola
      const scale = mesh.scale.x
      colliderDesc = RAPIER.ColliderDesc.ball(scale)
    }

    // Configurar propiedades físicas
    colliderDesc
      .setRestitution(config.restitution)
      .setFriction(config.friction)
      .setMass(config.mass)

    const collider = world.value.createCollider(colliderDesc, rigidBody)

    const body: PhysicsBody = {
      rigidBody,
      collider,
      mesh,
    }

    bodies.value.push(body)

    return body
  }

  /**
   * Actualizar física (llamar en cada frame)
   */
  function updatePhysics(delta: number) {
    if (!world.value || !isInitialized.value) return

    // Actualizar simulación de física
    world.value.step()

    // Sincronizar posiciones y rotaciones de meshes con rigid bodies
    bodies.value.forEach((body) => {
      const position = body.rigidBody.translation()
      const rotation = body.rigidBody.rotation()

      body.mesh.position.set(position.x, position.y, position.z)
      body.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
    })
  }

  /**
   * Cambiar gravedad dinámicamente
   */
  function setGravity(x: number, y: number, z: number, multiplier: number = 1) {
    if (!world.value) return

    gravityMultiplier.value = multiplier

    const newGravity = {
      x: x * multiplier,
      y: y * multiplier,
      z: z * multiplier,
    }

    world.value.gravity = newGravity
  }

  /**
   * Activar/desactivar física para todos los cuerpos
   */
  function setPhysicsEnabled(enabled: boolean) {
    bodies.value.forEach((body) => {
      if (enabled) {
        body.rigidBody.setBodyType(RAPIER.RigidBodyType.Dynamic, true)
      } else {
        body.rigidBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true)
        // Resetear velocidades
        body.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    })
  }

  /**
   * Aplicar impulso a un cuerpo (para efectos especiales)
   */
  function applyImpulse(bodyIndex: number, x: number, y: number, z: number) {
    if (bodyIndex < 0 || bodyIndex >= bodies.value.length) return

    const body = bodies.value[bodyIndex].rigidBody
    body.applyImpulse({ x, y, z }, true)
  }

  /**
   * Resetear posiciones de todos los cuerpos
   */
  function resetBodies(positions: Array<[number, number, number]>) {
    bodies.value.forEach((body, index) => {
      if (index < positions.length) {
        const [x, y, z] = positions[index]
        body.rigidBody.setTranslation({ x, y, z }, true)
        body.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
    })
  }

  /**
   * Limpiar recursos de física
   */
  function cleanup() {
    if (world.value) {
      bodies.value.forEach((body) => {
        if (world.value) {
          world.value.removeRigidBody(body.rigidBody)
        }
      })

      bodies.value = []
      world.value.free()
      world.value = null
      isInitialized.value = false

      console.log('🧹 Physics cleaned up')
    }
  }

  // Limpiar al desmontar
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    world,
    bodies,
    isInitialized,
    gravityMultiplier,

    // Methods
    initPhysics,
    createRigidBody,
    updatePhysics,
    setGravity,
    setPhysicsEnabled,
    applyImpulse,
    resetBodies,
    cleanup,
  }
}

/**
 * WebGL Shaders para Mesh Gradient
 *
 * Vertex Shader: Deforma los vértices usando Simplex Noise
 * Fragment Shader: Mezcla colores para crear el efecto gradient mesh
 *
 * Basado en la implementación de Stripe.com
 */

/**
 * VERTEX SHADER
 *
 * Responsabilidades:
 * - Deformar vértices en el eje Z usando Simplex Noise 3D
 * - Animar la deformación basada en el tiempo (u_time)
 * - Aplicar offset de scroll para efecto parallax
 * - Calcular coordenadas de textura para fragment shader
 */
export const vertexShader = `
precision highp float;

// Atributos (datos por vértice)
attribute vec3 a_position;

// Uniforms (constantes para todo el mesh)
uniform float u_time;
uniform float u_amplitude;
uniform float u_scroll;
uniform mat4 u_projection;

// Varyings (pasados al fragment shader)
varying vec2 v_texCoord;
varying float v_noise;

//
// Simplex 3D Noise
// Implementación de Stefan Gustavson (stegu@itn.liu.se)
// Optimizado para WebGL
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = a_position;

  // Generar múltiples capas de noise para más complejidad
  float noise1 = snoise(vec3(pos.x * 1.5, pos.y * 1.5, u_time * 0.5));
  float noise2 = snoise(vec3(pos.x * 0.8, pos.y * 0.8, u_time * 0.3 + 100.0));
  float noise3 = snoise(vec3(pos.x * 2.2, pos.y * 2.2, u_time * 0.7 + 200.0));

  // Combinar capas de noise (octavas)
  float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

  // Aplicar deformación al eje Z
  pos.z = combinedNoise * u_amplitude;

  // Aplicar offset de scroll (parallax effect)
  pos.y += u_scroll * 0.1;

  // Proyectar posición
  gl_Position = u_projection * vec4(pos, 1.0);

  // Pasar datos al fragment shader
  v_texCoord = a_position.xy * 0.5 + 0.5; // Normalizar a 0-1
  v_noise = combinedNoise; // Pasar valor de noise para usar en colores
}
`;

/**
 * FRAGMENT SHADER
 *
 * Responsabilidades:
 * - Mezclar los 4 colores configurados
 * - Crear transiciones suaves basadas en posición
 * - Añadir variación temporal para animación
 * - Usar el valor de noise para agregar textura sutil
 */
export const fragmentShader = `
precision highp float;

// Uniforms (colores y tiempo)
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform float u_time;
uniform float u_alpha;

// Varyings (del vertex shader)
varying vec2 v_texCoord;
varying float v_noise;

void main() {
  vec2 uv = v_texCoord;

  // Usar smoothstep para transiciones ultra suaves
  float xGradient = smoothstep(0.0, 1.0, uv.x);
  float yGradient = smoothstep(0.0, 1.0, uv.y);

  // Mezclar color1 y color2 EXTREMADAMENTE sutil
  vec3 color = mix(u_color1, u_color2, xGradient * 0.4);

  // Mezclar con color3 muy sutilmente basado en posición vertical
  color = mix(color, u_color3, yGradient * 0.25);

  // Añadir variación temporal casi imperceptible
  float timeVariation = sin(u_time * 0.2) * 0.5 + 0.5;
  color = mix(color, u_color4, timeVariation * 0.04);

  // Usar noise para agregar textura mínima
  float noiseInfluence = v_noise * 0.015;
  color = mix(color, u_color3, noiseInfluence);

  // Agregar gradiente radial muy muy sutil
  vec2 center = vec2(0.5, 0.5);
  float distanceFromCenter = distance(uv, center);
  float radialGradient = smoothstep(0.0, 1.4, distanceFromCenter);
  color = mix(color, u_color4, radialGradient * 0.025);

  // Output final con alpha
  gl_FragColor = vec4(color, u_alpha);
}
`;

/**
 * Shader de fallback simple para browsers con soporte limitado
 */
export const fallbackVertexShader = `
precision mediump float;

attribute vec3 a_position;
uniform mat4 u_projection;

varying vec2 v_texCoord;

void main() {
  gl_Position = u_projection * vec4(a_position, 1.0);
  v_texCoord = a_position.xy * 0.5 + 0.5;
}
`;

export const fallbackFragmentShader = `
precision mediump float;

uniform vec3 u_color1;
uniform vec3 u_color2;

varying vec2 v_texCoord;

void main() {
  vec3 color = mix(u_color1, u_color2, v_texCoord.x);
  gl_FragColor = vec4(color, 1.0);
}
`;

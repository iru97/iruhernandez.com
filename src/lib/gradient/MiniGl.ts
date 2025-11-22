/**
 * MiniGl - Minimal WebGL Wrapper
 *
 * Wrapper minimalista para WebGL que maneja:
 * - Contexto WebGL
 * - Geometría (PlaneGeometry)
 * - Materiales (shaders + uniforms)
 * - Meshes (geometría + material)
 * - Rendering
 *
 * Basado en la implementación de Stripe
 */

/**
 * Tipo para valores uniform de shaders
 */
export type UniformValue =
  | number
  | number[]
  | [number, number, number]
  | Float32Array;

export interface Uniform {
  value: UniformValue;
  type?: 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat4';
}

export interface MaterialConfig {
  uniforms: Record<string, Uniform>;
  vertexShader: string;
  fragmentShader: string;
}

/**
 * Clase Material
 * Maneja shaders y uniforms
 */
export class Material {
  public uniforms: Record<string, Uniform>;
  public vertexShader: string;
  public fragmentShader: string;
  public program: WebGLProgram | null = null;
  public uniformLocations: Map<string, WebGLUniformLocation> = new Map();
  public attribLocations: Map<string, number> = new Map();

  constructor(config: MaterialConfig) {
    this.uniforms = config.uniforms;
    this.vertexShader = config.vertexShader;
    this.fragmentShader = config.fragmentShader;
  }

  /**
   * Compila los shaders y crea el programa WebGL
   */
  compile(gl: WebGLRenderingContext): void {
    const vertShader = this.compileShader(gl, this.vertexShader, gl.VERTEX_SHADER);
    const fragShader = this.compileShader(gl, this.fragmentShader, gl.FRAGMENT_SHADER);

    if (!vertShader || !fragShader) {
      throw new Error('Failed to compile shaders');
    }

    this.program = gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    gl.attachShader(this.program, vertShader);
    gl.attachShader(this.program, fragShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(this.program);
      throw new Error(`Program link failed: ${error}`);
    }

    // Obtener ubicaciones de uniforms
    for (const name in this.uniforms) {
      const location = gl.getUniformLocation(this.program, name);
      if (location) {
        this.uniformLocations.set(name, location);
      }
    }

    // Obtener ubicaciones de atributos
    this.attribLocations.set('a_position', gl.getAttribLocation(this.program, 'a_position'));
  }

  /**
   * Compila un shader individual
   */
  private compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      console.error('Shader compile error:', error);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Actualiza los uniforms en el GPU
   */
  updateUniforms(gl: WebGLRenderingContext): void {
    if (!this.program) return;

    for (const [name, uniform] of Object.entries(this.uniforms)) {
      const location = this.uniformLocations.get(name);
      if (!location) continue;

      const value = uniform.value;

      // Determinar tipo y cargar uniform
      if (typeof value === 'number') {
        gl.uniform1f(location, value);
      } else if (Array.isArray(value)) {
        if (value.length === 2) {
          gl.uniform2fv(location, value);
        } else if (value.length === 3) {
          gl.uniform3fv(location, value);
        } else if (value.length === 4) {
          gl.uniform4fv(location, value);
        } else if (value.length === 16) {
          gl.uniformMatrix4fv(location, false, value);
        }
      } else if (value instanceof Float32Array) {
        if (value.length === 16) {
          gl.uniformMatrix4fv(location, false, value);
        }
      }
    }
  }
}

/**
 * Clase PlaneGeometry
 * Genera geometría de un plano segmentado
 */
export class PlaneGeometry {
  public vertices: Float32Array;
  public indices: Uint16Array;
  public segmentsX: number;
  public segmentsY: number;
  private vertexBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;

  constructor(width: number = 2, height: number = 2, segmentsX: number = 64, segmentsY: number = 64) {
    this.segmentsX = segmentsX;
    this.segmentsY = segmentsY;

    // Generar vértices
    const vertexCount = (segmentsX + 1) * (segmentsY + 1);
    this.vertices = new Float32Array(vertexCount * 3);

    let index = 0;
    for (let y = 0; y <= segmentsY; y++) {
      for (let x = 0; x <= segmentsX; x++) {
        const u = x / segmentsX;
        const v = y / segmentsY;

        this.vertices[index++] = (u - 0.5) * width;
        this.vertices[index++] = (v - 0.5) * height;
        this.vertices[index++] = 0;
      }
    }

    // Generar índices (triángulos)
    const indexCount = segmentsX * segmentsY * 6;
    this.indices = new Uint16Array(indexCount);

    index = 0;
    for (let y = 0; y < segmentsY; y++) {
      for (let x = 0; x < segmentsX; x++) {
        const a = y * (segmentsX + 1) + x;
        const b = a + 1;
        const c = a + (segmentsX + 1);
        const d = c + 1;

        // Dos triángulos por quad
        this.indices[index++] = a;
        this.indices[index++] = b;
        this.indices[index++] = c;

        this.indices[index++] = b;
        this.indices[index++] = d;
        this.indices[index++] = c;
      }
    }
  }

  /**
   * Crea buffers en GPU
   */
  createBuffers(gl: WebGLRenderingContext): void {
    // Vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    // Index buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  }

  /**
   * Bind buffers para rendering
   */
  bind(gl: WebGLRenderingContext, positionLocation: number): void {
    if (!this.vertexBuffer || !this.indexBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  }
}

/**
 * Clase Mesh
 * Combina geometría y material
 */
export class Mesh {
  public geometry: PlaneGeometry;
  public material: Material;

  constructor(geometry: PlaneGeometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
  }

  /**
   * Renderiza el mesh
   */
  render(gl: WebGLRenderingContext): void {
    if (!this.material.program) return;

    gl.useProgram(this.material.program);

    // Actualizar uniforms
    this.material.updateUniforms(gl);

    // Bind geometry
    const positionLocation = this.material.attribLocations.get('a_position');
    if (positionLocation !== undefined) {
      this.geometry.bind(gl, positionLocation);
    }

    // Draw
    gl.drawElements(
      gl.TRIANGLES,
      this.geometry.indices.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}

/**
 * Clase principal MiniGl
 * Maneja el contexto WebGL y rendering
 */
export class MiniGl {
  public gl: WebGLRenderingContext;
  public canvas: HTMLCanvasElement;
  public meshes: Mesh[] = [];
  public width: number = 0;
  public height: number = 0;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Obtener contexto WebGL
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.gl = gl;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit to 2x for performance

    // Configurar WebGL
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Resize inicial
    this.resize();
  }

  /**
   * Ajusta el tamaño del canvas
   */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Crea matriz de proyección ortográfica
   */
  createOrthoMatrix(): Float32Array {
    const aspect = this.width / this.height;
    const matrix = new Float32Array(16);

    // Matriz de proyección ortográfica
    matrix[0] = 1 / aspect;
    matrix[5] = 1;
    matrix[10] = -1;
    matrix[15] = 1;

    return matrix;
  }

  /**
   * Renderiza todos los meshes
   */
  render(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const mesh of this.meshes) {
      mesh.render(this.gl);
    }
  }

  /**
   * Limpia recursos
   */
  dispose(): void {
    for (const mesh of this.meshes) {
      if (mesh.material.program) {
        this.gl.deleteProgram(mesh.material.program);
      }
    }
    this.meshes = [];
  }
}

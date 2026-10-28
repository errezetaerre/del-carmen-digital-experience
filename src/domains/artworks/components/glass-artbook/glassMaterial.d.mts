export declare const GLASS_MATERIAL_VERTEX: string;
export declare const GLASS_MATERIAL_FRAGMENT: string;
export interface GlassMaterial {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    buffer: WebGLBuffer;
    uniforms: Record<string, WebGLUniformLocation | null>;
    lastFrame?: string;
}
export interface GlassMaterialFrame {
    width: number; height: number; pixelRatio?: number; angle?: number; side?: -1 | 1;
    artwork?: boolean; palette?: number; strength?: number; cornerStrength?: number;
    outerRadius?: number; innerRadius?: number;
}
export declare function createGlassMaterial(canvas: HTMLCanvasElement): GlassMaterial;
export declare function paintGlassMaterial(material: GlassMaterial, canvas: HTMLCanvasElement, frame: GlassMaterialFrame): boolean;
export declare function disposeGlassMaterial(material: GlassMaterial | null): void;

import { mat4 } from 'gl-matrix';

const vertexShader = `
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
varying vec4 vColor;
void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}
`;

const fragmentShader = `
 precision mediump float;
varying vec4 vColor;
void main(void) {
    gl_FragColor = vColor;
}
`;

class VoroniRenderer{
    constructor(width, height){
        this.width = width;
        this.height = height;
        /* Init offscreen canvas */
        this.canvas = document.createElement("canvas"); 
        this.canvas.width = width;
        this.canvas.height = height;

        this.gl = this.canvas.getContext('webgl');
        this.glPointers = {attributes: {}, uniforms: {}};
        this.points = [];
    }
    _initGL(){
        /* GL state toggle*/
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(gl.DEPTH_TEST);
        this.gl.depthFunc(gl.LEQUAL);
    }
    /**
     * Binds string as a shader to the gl context.
     * @param {String} str The string to be bound as a shader.
     * @param {Number} shaderType Either gl.vertexShader or gl.fragmentShader
     * @return {WebGLShader} Newly bound shader.
    */
    _getShader(str, shaderType){
        const shader = this.gl.createShader(shaderType);
        this.gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
          return null;
        }
        return shader;
    }

    _initShaders(){
        /* Create shaders and shader program */
        const vertexShader = this._getShader(vertexShader, this.gl.fragmentShader);
        const fragmentShader = this._getShader(vertexShader, this.gl.fragmentShader);

        this.glPointers.shaderProgram = this.gl.createProgram();
        
        this.gl.attachShader(this.glPointers.shaderProgram, vertexShader);
        this.gl.attachShader(this.glPointers.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.glPointers.shaderProgram);

        if(!gl.getProgramParameter(this.glPointers.shaderProgram, gl.LINK_STATUS)){
          console.error("Could not initialize shaders.");
          return null;
        }

        this.gl.useProgram(this.glPointers.shaderProgram);
    }
    /**
     * Creates cone with the given number of edges.
     * @param {Number} x x-coordinate of the center on the current coordinate system
     * @param {Number} y x-coordinate of the center on the current coordinate system
     * @return {???} 
    */
    createCone(x, y, edges){
        const pi = Math.pi;
        const vertices = new Array(edges+1);
        vertices[0] = x;
        vertices[1] = y;
        vertices[2] = z;
        for(let i = 1 ; i <= edges; i++){
            indices[i*3] = Math.sin(2 * pi * ratio);
            indices[i*3+1] = Math.cos(2 * pi * ratio);
            indices[i*3+2] = 0;
        }
    }
    getAttributeLocations(){
        this.glPointers.attributes.aVertexPosition = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.glPointers.attributes.aVertexPosition);
        
        this.glPointers.attributes.aVertexColor = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        this.gl.enableVertexAttribArray(this.glPointers.attributes.aVertexColor);

    }
    getUniformLocations(){

    }
    setupUniforms(){
        const orthoMatrix = mat4.create();
        mat4.ortho(orthoMatrix, -1, 1, -1, 1, 0.001, 100);  
    }
    render(){
        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    getCanvasDOMNode(){
        return this.canvas;
    }
    setResolution(width, height){
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    addPoint(x, y){
        this.points.push(x, y);
    }
    clearPoints(){
        this.points = [];
    }
}

window.VoroniRenderer = VoroniRenderer;
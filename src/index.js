import { mat4 } from 'gl-matrix';

const voroniVertexShader = `
    attribute vec3 vertexPosition;
    attribute vec4 vertexColor;

    uniform mat4 orthoMatrix;

    varying vec4 vColor;
    void main(void) {
        gl_Position = orthoMatrix * vec4(vertexPosition, 1.0);
        vColor = vertexColor;   
    }
`;

const voroniFragmentShader = `
    precision mediump float;
         varying vec4 vColor;
    void main(void) { 
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

class VoroniRenderer{
    constructor(width, height, canvas){
        this.width = width;
        this.height = height;
        /* Init offscreen canvas */
        this.canvas = canvas; 
        this.canvas.width = width;
        this.canvas.height = height;

        this.gl = this.canvas.getContext('webgl');
        this.glPointers = {attributes: {}, uniforms: {}, buffers: {}};
        this.points = [];
        this._initGL();
    }
    _initGL(){
        this._initShaders();

        /* Create Uniforms/Attributes*/
        this._getUniformLocations();
        this._getAttributeLocations();
        this._getBuffers();

        /* Bind data*/
        this._bindDataToUniforms();
        this._bindDataToBuffers();


        /* GL state toggles*/
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }
    /**
     * Binds string as a shader to the gl context.
     * @param {String} str The string to be bound as a shader.
     * @param {Number} shaderType Either gl.vertexShader or gl.fragmentShader
     * @return {WebGLShader} Newly bound shader.
    */
    _getShader(str, shaderType){
        const shader = this.gl.createShader(shaderType);
        
        console.log(str);
        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.error(this.gl.getShaderInfoLog(shader));
          return null;
        }
        return shader;
    }

    /**
     * Initializes the shader program
     */
    _initShaders(){
        /* Create shaders and shader program */
        const vertexShader = this._getShader(voroniVertexShader, this.gl.VERTEX_SHADER);
        const fragmentShader = this._getShader(voroniFragmentShader, this.gl.FRAGMENT_SHADER);

        this.glPointers.shaderProgram = this.gl.createProgram();
        
        this.gl.attachShader(this.glPointers.shaderProgram, vertexShader);
        this.gl.attachShader(this.glPointers.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.glPointers.shaderProgram);

        if(!this.gl.getProgramParameter(this.glPointers.shaderProgram, this.gl.LINK_STATUS)){
          console.error("Could not initialize shaders.");
          return null;
        }

        this.gl.useProgram(this.glPointers.shaderProgram);
    }

    /**
     * Creates cone with the given number of edges parametrically.
     * @param {Number} x x-coordinate of the center on the current coordinate system
     * @param {Number} y x-coordinate of the center on the current coordinate system
     * @param {Number} edges The number of edges for the base to have (not the total)
     * @return {???} 
    */
    _createCone(x, y, edges){
        const pi = Math.PI;
        const vertices = new Array(edges*3+1);
        vertices[0] = x;
        vertices[1] = y;
        vertices[2] = -3;
        for(let i = 1 ; i <= edges+1; i++){
            const ratio = i/edges;
            vertices[i*3] = Math.sin(2 * pi * ratio);
            vertices[i*3+1] = Math.cos(2 * pi * ratio);
            vertices[i*3+2] = -5;
        }
        return vertices;
    }

    /**
     * Inserts attribute locations into this.glPointers.attributes
     */
    _getAttributeLocations(){
        this.glPointers.attributes.vertexPosition = this.gl.getAttribLocation(this.glPointers.shaderProgram, "vertexPosition");
        this.gl.enableVertexAttribArray(this.glPointers.attributes.vertexPosition);
        
        this.glPointers.attributes.vertexColor = this.gl.getAttribLocation(this.glPointers.shaderProgram, "vertexColor");
        this.gl.enableVertexAttribArray(this.glPointers.attributes.vertexColor);

    }

    /**
     * Inserts uniform locations into this.glPointers.attributes
     */
    _getUniformLocations(){
         this.glPointers.uniforms.orthoMatrix = this.gl.getUniformLocation(this.glPointers.shaderProgram, "orthoMatrix");
    }

    /**
     * Gets buffers and inserts them into this.glPointers.buffers
     */
    _getBuffers(){
        this.glPointers.buffers.vertexPositionBuffer = this.gl.createBuffer();
        this.glPointers.buffers.vertexColorBuffer = this.gl.createBuffer();
    }

    /**
     * Generates geometry and color data then binds it to the appropriate buffers
     */
    _bindDataToBuffers(){

        /* Bind Vertex Data*/
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glPointers.buffers.vertexPositionBuffer);
        const coneVertices = this._createCone(0, 0, 10);
        const triangleVertices = [
            0.0, 1.0, -2,
            -1.0, -1.0, -2,
            1.0, -1.0, -2,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coneVertices), this.gl.STATIC_DRAW);
        
        /*Bind Vertex Color Data*/
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glPointers.buffers.vertexColorBuffer);
        const vertexColorData = new Array(55).fill(1.0);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexColorData), this.gl.STATIC_DRAW);
    }
    

    /**
     * Inserts needed matrices into uniforms
     */
    _bindDataToUniforms(){
        const orthoMatrix = mat4.create();
        //mat4.ortho(orthoMatrix, -1, 1, -1, 1, 0.001, 100);  
        mat4.perspective(
            orthoMatrix,
            45,
            1,
            0.1,
            100.0
        );

        this.gl.uniformMatrix4fv(
            this.glPointers.uniforms.orthoMatrix,
            false,
            orthoMatrix
        );
    }
    tick(){
        requestAnimationFrame(() => this.tick());
        this.render();
    }
    render(){
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glPointers.buffers.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.glPointers.attributes.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glPointers.buffers.vertexColorBuffer);
        this.gl.vertexAttribPointer(this.glPointers.attributes.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 12);

    }
    /**
     * Renders with instancing enabled, which should speed rendering up greatly especially for high 
     * cone resolution.  However, support is limited so it is kept as an option.
     */
    renderInstanced(){

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
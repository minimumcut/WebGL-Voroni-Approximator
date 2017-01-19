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
        /* Init offscreen canvas */
        this.canvas = document.createElement("canvas"); 
        this.gl = this.canvas.getContext('webgl');
        this.points = [];
    }
    _initGL(){
        /* GL state toggle*/
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }
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
    render(){

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

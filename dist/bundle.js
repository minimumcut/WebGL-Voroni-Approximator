/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var vertexShader = "\nattribute vec3 aVertexPosition;\nattribute vec4 aVertexColor;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec4 vColor;\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vColor = aVertexColor;\n}\n";

	var fragmentShader = "\n precision mediump float;\nvarying vec4 vColor;\nvoid main(void) {\n    gl_FragColor = vColor;\n}\n";

	var VoroniRenderer = function () {
	    function VoroniRenderer(width, height) {
	        _classCallCheck(this, VoroniRenderer);

	        this.width = width;
	        this.height = height;
	        /* Init offscreen canvas */
	        this.canvas = document.createElement("canvas");
	        this.gl = this.canvas.getContext('webgl');
	        this.glPointers = {};
	        this.points = [];
	    }

	    _createClass(VoroniRenderer, [{
	        key: "_initGL",
	        value: function _initGL() {
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

	    }, {
	        key: "_getShader",
	        value: function _getShader(str, shaderType) {
	            var shader = this.gl.createShader(shaderType);
	            this.gl.compileShader(shader);

	            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	                console.error(gl.getShaderInfoLog(shader));
	                return null;
	            }
	            return shader;
	        }
	    }, {
	        key: "_initShaders",
	        value: function _initShaders() {
	            /* Create shaders and shader program */
	            var vertexShader = this._getShader(vertexShader, this.gl.fragmentShader);
	            var fragmentShader = this._getShader(vertexShader, this.gl.fragmentShader);

	            this.glPointers.shaderProgram = this.gl.createProgram();

	            this.gl.attachShader(this.glPointers.shaderProgram, vertexShader);
	            this.gl.attachShader(this.glPointers.shaderProgram, fragmentShader);
	            this.gl.linkProgram(this.glPointers.shaderProgram);

	            if (!gl.getProgramParameter(this.glPointers.shaderProgram, gl.LINK_STATUS)) {
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

	    }, {
	        key: "createCone",
	        value: function createCone(x, y, edges) {
	            var pi = Math.pi;
	            var vertices = new Array(edges + 1);
	            vertices[0] = x;
	            vertices[1] = y;
	            vertices[2] = z;
	            for (var i = 1; i <= edges; i++) {
	                indices[i * 3] = Math.sin(2 * pi * ratio);
	                indices[i * 3 + 1] = Math.cos(2 * pi * ratio);
	                indices[i * 3 + 2] = 0;
	            }
	        }
	    }, {
	        key: "render",
	        value: function render() {}
	    }, {
	        key: "getCanvasDOMNode",
	        value: function getCanvasDOMNode() {
	            return this.canvas;
	        }
	    }, {
	        key: "setResolution",
	        value: function setResolution(width, height) {
	            this.width = width;
	            this.height = height;
	            this.canvas.width = width;
	            this.canvas.height = height;
	        }
	    }, {
	        key: "addPoint",
	        value: function addPoint(x, y) {
	            this.points.push(x, y);
	        }
	    }, {
	        key: "clearPoints",
	        value: function clearPoints() {
	            this.points = [];
	        }
	    }]);

	    return VoroniRenderer;
	}();

	window.VoroniRenderer = VoroniRenderer;

/***/ }
/******/ ]);
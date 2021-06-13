---
title: "Circular Gradients for the HTML5 Canvas"
date: 2020-10-11T18:19:32-04:00
tags: ["javascript", "canvas", "webgl"]
---

Circular gradients are commonly used in pie or doughnut charts to change the colour of segment as the angle around the center of the chart changes. In many non web platforms, the ability to generate these gradients is provided as part of the standard APIs. For example, Android provides a [SweepGradient](https://www.mit.edu/afs.new/sipb/project/android/docs//reference/android/graphics/SweepGradient.html). In the browsers, only [Linear](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) and [Radial](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) gradients are provided. Thus, if we want to a circular gradient, we'll need to create our own.

Thanksfully, all modern browsers have [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) implementations that we can combine with a [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) to create our own gradients.

All WebGL programs consist of two shaders: a vertex shader and a fragment shaders. These shaders are written in [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) which has syntax similar to C. The vertex shader is used to project the input vertex coordinates onto the scene while the fragment shader is used to determine the colour at each point inside of a fill. For our use case, we'll do the entirety of our work in the fragment shader and the vertex shader will simply pass points through without transformation.

## Vertex Shader

```glsl

attribute vec3 coordinates;
 
void main(void) {
    gl_Position = vec4(coordinates, 1.0);
}

```

## Fragment Shader

The fragment shader is where the fun begins. Before I dive into the code, we first nede to define the problem. We want the colour to change as we rotate around the center of the canvas so we need to know where the center of the canvas is. We also need to know what colours we want to move between. To read these inputs, we first define for `uniform` variables in the fragment shader. When we put the program together, these will be supplied as inputs from JavaScript.

The bulk of the work is then the calculation for `percent` which determines how far along the gradient we want to be. This number needs to be in the range `[0, 1]`. Since this value is related to the angle of the current point, relative to the center of canvas, the use of `atan` makes sense. **Note** GLSL's implementation of `atan2` is to call `atan` with two arguments. The angle computed from `atan` is then shifted into the range `[-2pi, 0]` and then normalized.

The final step is to set the special `gl_FragColor` to the colour for the pixel. `mix` is a GLSL builtin that mixes the two input vectors in a linear fashion.


```glsl
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;
  
uniform float u_width;
uniform float u_height;
uniform vec4 u_color1;
uniform vec4 u_color2;
  
void main(void) {
    vec2 xy = gl_FragCoord.xy;
    float half_width = u_width / 2.0;
    float half_height = u_height / 2.0;

    float percent = (atan(xy[0] - half_width, half_height - xy[1]) - 3.14) / -6.28;
    gl_FragColor = mix(u_color1, u_color2, percent);
}

```

## Putting it Alltogether

Now that we have both shaders written, we need to tie it together and render this on a canvas to test it out.

```javascript

const width = 500;
const height = 500;

const vertices = [
    -1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0, 1.0, 0.0
];

const indices = [0, 1, 2, 3];

const canvas = document.createElement("canvas");
canvas.height = height;
canvas.width = width;
const gl = canvas.getContext("webgl");

// Create an empty buffer object to store vertex buffer
const vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Create an empty buffer object to store Index buffer
const Index_Buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Vertex shader source code
const vertCode = `
    attribute vec3 coordinates;
 
    void main(void) {
      gl_Position = vec4(coordinates, 1.0);
    }
`;
const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

// Fragment shader
const fragCode = `
    // fragment shaders don't have a default precision so we need
    // to pick one. mediump is a good default
    precision mediump float;
  
    uniform float u_width;
    uniform float u_height;
    uniform vec4 u_color1;
    uniform vec4 u_color2;
  
    void main(void) {
      vec2 st = gl_FragCoord.xy;
      float half_width = u_width / 2.0;
      float half_height = u_height / 2.0;

      float percent = (atan(st[0] - half_width, half_height - st[1]) - 3.14) / -6.28;
      gl_FragColor = mix(u_color1, u_color2, percent);
    }
`;
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

// Colors. vec4 [r, g, b, a]
const color1Loc = gl.getUniformLocation(shaderProgram, "u_color1");
gl.uniform4fv(color1Loc, [0, 1, 0, 1]);
const color2Loc = gl.getUniformLocation(shaderProgram, "u_color2");
gl.uniform4fv(color2Loc, [1, 0, 0, 1]);

// Width & height
const heightLoc = gl.getUniformLocation(shaderProgram, "u_height");
gl.uniform1f(heightLoc, height);
const widthLoc = gl.getUniformLocation(shaderProgram, "u_width");
gl.uniform1f(widthLoc, width);

// Get the attribute location
const coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

// Draw the square
gl.drawElements(gl.TRIANGLE_FAN, indices.length, gl.UNSIGNED_SHORT, 0);

```

Now that we have the gradient rendering, if we want to use it as a fill for a 2d context call, we can create the `CanvasPattern` from the existing canvas

```javascript

const pattern = ctx.createPattern(canvas, "no-repeat");
ctx.fillStyle = pattern;

// Use the 2d APIs here

```

A live version of this code is at https://jsfiddle.net/dt4gn6v7/
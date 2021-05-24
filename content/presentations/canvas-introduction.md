---
title: "Introduction to the HTML 5 Canvas"
# date: 2021-06-02T14:00:00-04:00
date: 2021-05-24T10:00:00-04:00
draft: false
---

<section>
<h1>Canvas Rendering</h1>
<h5>Adventures in Immediate Mode Graphics on the Web</h5>
<p>Evert Timberg</p>
<p>June 2, 2021</p>
</section>

<section>
  <h2>What is the Canvas?</h2>
  <ul>
    <li>Bitmap drawing surface added in HTML5</li>
    <li>Provides view for immediate mode (2d) and WebGL rendering</li>
  </ul>
</section>

<section>
  <h2>CSS Pixels vs Device Pixels</h2>
  <ul>
    <li>
      CSS Pixels: Famously complicated definition
      <br>
      <q>The reference pixel is the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.</q>
    </li>
    <li>Device Pixels: Pixels on the actual screen being used for display</li>
    <li>
      Related via devicePixelRatio.
      <pre><code class="typescript">
const devicePixelWidth = window.devicePixelRatio * window.innerWidth;
      </code></pre>
    </li>
    <li>Canvas uses device pixels</li>
  </ul>
</section>

<section>
  <h2>Using the Canvas</h2>
  <pre><code class="html" data-noescape data-trim>
&lt;canvas id="our-canvas"&gt;&lt;/canvas&gt;
  </code></pre>
  <pre><code class="typescript">
const canvas = document.getElementById('our-canvas');
const ctx = canvas.getContext('2d');
  </code></pre>
</section>

<section>
  <h2>Drawing Simple Shapes</h2>
  <pre><code class="typescript">
const canvas = document.getElementById('our-canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
ctx.fillRect(50, 100, 200, 100);
  </code></pre>
  <canvas id="simple-shape" style="background-color: white;" width="600" height="300"></canvas>
  <script>
    const shapeCanvas = document.getElementById('simple-shape');
    const shapeCtx = shapeCanvas.getContext('2d');
    shapeCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    shapeCtx.fillRect(50, 100, 200, 100);
  </script>
</section>

<section>
  <h2>Drawing Paths</h2>
  <pre><code class="typescript">
const canvas = document.getElementById('our-canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
ctx.lineWidth = 5;

ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 100); // Horizontal Line
ctx.arcTo(250, 150, 200, 200, 50);
ctx.closePath();

ctx.fill();
ctx.stroke();
  </code></pre>
  <canvas id="simple-path" style="background-color: white;" width="600" height="300"></canvas>
  <script>
    const pathCanvas = document.getElementById('simple-path');
    const pathCtx = pathCanvas.getContext('2d');
    pathCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    pathCtx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    pathCtx.lineWidth = 5;
    pathCtx.beginPath();
    pathCtx.moveTo(100, 100);
    pathCtx.lineTo(200, 100); // Horizontal Line
    pathCtx.arcTo(250, 150, 200, 200, 50);
    pathCtx.closePath();
    pathCtx.fill();
    pathCtx.stroke();
  </script>
</section>

<section>
  <h2>State Management</h2>
  <p>Problem: Since the Canvas context has state, how do we manage that?</p>
  <p>Answer: The context state can be saved to a stack and restored</p>

  <pre><code class="typescript">
ctx.fillStyle = 'blue';
ctx.save();
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 50, 50); // red
ctx.restore();
ctx.fillRect(100, 0, 50, 50); // blue
  </code></pre>
  <canvas id="canvas-state" style="background-color: white;" width="300" height="150"></canvas>
  <script>
    const stateCanvas = document.getElementById('canvas-state');
    const stateCtx = stateCanvas.getContext('2d');
    stateCtx.fillStyle = 'blue';
    stateCtx.save();
    stateCtx.fillStyle = 'red';
    stateCtx.fillRect(0, 0, 50, 50); // red
    stateCtx.restore();
    stateCtx.fillRect(100, 0, 50, 50); // blue
  </script>
</section>

<section>
  <h2>Text Rendering</h2>
  <pre><code class="typescript">
// Vertical alignment of the text with respect to the draw point
ctx.textBaseline = 'top';
// Horizontal alignment of the text with respect to the draw point
ctx.textAlign = 'start';
ctx.fillText("Text String", 50, 100);
  </code></pre>
  <canvas id="canvas-text" style="background-color: white;" width="300" height="150"></canvas>
  <script>
    const textCanvas = document.getElementById('canvas-text');
    const textCtx = textCanvas.getContext('2d');
    textCtx.textBaseline = 'top';
    textCtx.textAlign = 'start';
    textCtx.font = 'bold 20px sans-serif';
    textCtx.fillText("Text String", 50, 100);
  </script>
</section>

<section>
  <h2>Resources</h2>
  <ul>
    <li><a href="https://drafts.csswg.org/css-values-3/#absolute-lengths">CSS Pixel Definition</a></li>
    <li><a href="https://simon.html5.org/dump/html5-canvas-cheat-sheet.html">Canvas Cheatsheet</a></li>
  </ul>
</section>
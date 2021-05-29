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
    <li>Uses pixels<sup>*</sup> as coordinates</li>
  </ul>
  <canvas id="coordinates" style="background-color: white;"></canvas>
  <script >
    function retinaScale(ctx, width, height) {
      const dpr = window.devicePixelRatio || 1;
      ctx.canvas.style.width = `${width}px`;
      ctx.canvas.style.height = `${height}px`;
      if (dpr !== 1) {
        ctx.canvas.width = width * dpr;
        ctx.canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }
  </script>
  <script>
    (function() {
      const canvas = document.getElementById('coordinates');
      const ctx = canvas.getContext('2d');
      retinaScale(ctx, 600, 300);

      ctx.fillStyle = 'red';
      [
        { x: 0, y: 0, sa: 0, ea: Math.PI / 2},
        { x: 0, y: 300, sa: 0, ea: -Math.PI / 2, ccw: true},
        { x: 600, y: 0, sa: Math.PI / 2, ea: Math.PI },
        { x: 600, y: 300, sa: Math.PI, ea: 3 * Math.PI / 2}
      ].forEach(({ x, y, sa, ea, ccw }) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 25, sa, ea, ccw);
        ctx.closePath()
        ctx.fill();
      });
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'start';
      ctx.font = '20px solid sans-serif';
      ctx.fillText("(0, 0)", 25, 25);
      ctx.fillText("0, 300)", 25, 275);

      ctx.textAlign = 'end';
      ctx.fillText("(600, 0)", 575, 25);
      ctx.fillText("(600, 300)", 575, 275);
    })();
  </script>
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
    <li>Future topic: Handling retina displays</li>
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
  <canvas id="simple-shape" style="background-color: white;"></canvas>
  <script>
    (function() {
      const canvas = document.getElementById('simple-shape');
      const ctx = canvas.getContext('2d');
      retinaScale(ctx, 600, 300);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(50, 100, 200, 100);
    })();
  </script>
</section>

<section>
  <h2>Drawing Paths</h2>
  <pre><code class="typescript" style="line-height: 20px;">
const ctx = document.getElementById('our-canvas').getContext('2d');
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
  <canvas id="simple-path" style="background-color: white;"></canvas>
  <script>
    (function() {
      const canvas = document.getElementById('simple-path');
      const ctx = canvas.getContext('2d');
      retinaScale(ctx, 600, 300);
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
    })();
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
  <canvas id="canvas-state" style="background-color: white;"></canvas>
  <script>
    (function() {
      const canvas = document.getElementById('canvas-state');
      const ctx = canvas.getContext('2d');
      retinaScale(ctx, 300, 150);
      ctx.fillStyle = 'blue';
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 50, 50); // red
      ctx.restore();
      ctx.fillRect(100, 0, 50, 50); // blue
    })();
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
  <canvas id="canvas-text" style="background-color: white;"></canvas>
  <script>
    (function() {
      const canvas = document.getElementById('canvas-text');
      const ctx = canvas.getContext('2d');
      retinaScale(ctx, 300, 150);
      ctx.textBaseline = 'top';
      ctx.textAlign = 'start';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText("Text String", 50, 100);
    })();
  </script>
</section>

<section>
  <h2>Resources</h2>
  <ul>
    <li><a href="https://drafts.csswg.org/css-values-3/#absolute-lengths">CSS Pixel Definition</a></li>
    <li><a href="https://simon.html5.org/dump/html5-canvas-cheat-sheet.html">Canvas Cheatsheet</a></li>
  </ul>
</section>
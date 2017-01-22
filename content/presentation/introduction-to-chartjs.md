+++
Title = "Introduction to Chart.js"
date = "2017-01-21T12:48:35-05:00"
+++

<section>
    <h1>Introduction to Chart.js</h1>
    <h3>February 2nd, 2017</h3>
    <img class="plain" src="/images/chartjs/chartjs-logo.svg" style="background: transparent;"></img>
</section>
<section>
    <h2>What is Chart.js?</h2>
    <ul>
        <li class="fragment">Creates interactive charts</li>
        <li class="fragment">Uses the HTML5 Canvas</li>
        <li class="fragment">Responsive sizing</li>
        <li class="fragment">Built-in animations</li>
    </ul>
    <aside class="notes">
        Why canvas?
        <ul>
            <li>good performance</li>
            <li>animations</li>
            <li>easy export as an image</li>
        </ul>
    </aside>
</section>
<section>
    <section>
        <h2>Creating Your First Chart</h2>
        <ol>
            <li class="fragment">Include Chart.js</li>
            <li class="fragment">Setup the Canvas</li>
            <li class="fragment">Create the chart</li>
        </ol>
    </section>
    <section>
        <h3>Include Chart.js</h3>
        <pre><code class="html stretch">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"&gt;&lt;/script&gt;
    &lt;/head&gt;
&lt;/html&gt;
        </code></pre>
        <aside class="notes">
            Why cdn?
            <ul>
                <li>More likely to be in browser cache</li>
                <li>Faster downloads</li>
                <li>Easy versioning</li>
            </ul>
        </aside>
    </section>
    <section>
        <h3>Setup the Canvas</h3>
        <pre><code class="html stretch">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"&gt;&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;div&gt;
            &lt;canvas id="chart"&gt;&lt;/canvas&gt;
        &lt;/div&gt;
    &lt;/body&gt;
&lt;/html&gt;
        </code></pre>
        <aside class="notes">
            <ul>
                <li>Chart.js uses a single canvas</li>
                <li>Everything drawn on the canvas</li>
                <li>Fills the container by default, hence the div</li>
            </ul>
        </aside>
    </section>
    <section>
        <h3>Create the Chart</h3>
        <p>We'll insert this into a script tag</p>
        <pre><code>
let ctx = document.getElementById('chart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Data',
            data: [10, 0, 20, 30],
            borderColor: 'rgb(255, 99, 132)',
            fill: false
        }],
        labels: ['Jan', 'Feb', 'Mar', 'Apr']
    }, 
});
        </code></pre>
    </section>
    <section>
        <h3>Putting it all Together</h3>
        <pre><code class="html stretch">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"&gt;&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;div&gt;&lt;canvas id="chart"&gt;&lt;/canvas&gt;&lt;/div&gt;
        &lt;script&gt;
            let ctx = document.getElementById('chart').getContext('2d');
            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Data',
                        data: [10, 0, 20, 30],
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    }],
                    labels: ['Jan', 'Feb', 'Mar', 'Apr']
                }, 
            });         
        &lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;
        </code></pre>
    </section>
    <section>
        <h3>Result</h3>
        <div>
            <canvas id="chart" style="background: white;"></canvas>
        </div>
        <script>
        window.addEventListener('load', function() {
            var ctx = document.getElementById('chart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Data',
                        data: [10, 0, 20, 30],
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false
                    }],
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'] 
                }
            });
        });
        </script>
        <aside class="notes">
            <ul>
                <li>Should see a chart like this</li>
                <li>If not, check the console for errors</li>
            </ul>
        </aside>
    </section>
</section>
<section>
    <section>
        <h3>Initializing the Chart</h3>
        <p>Let's explore how the chart is created</p>
        <div class="fragment fade-in">
            <pre><code>
let ctx = document.getElementById('chart').getContext('2d');
            </code></pre>
        </div>
        <div class="fragment fade-in">
            <pre><code>
let chart = new Chart(ctx, config);
            </code></pre>
        </div>
        <aside class="notes">
            <ul>
                <li>First part gets the canvas DOM node</li>
                <li>The context is what we use to do actual drawing</li>
                <li>We create a new instance of the Chart class</li>
            </ul>
        </aside>
    </section>
    <section>
        <h3>Constructor Config Object</h3>
        <div class="fragment fade-in">
            <pre><code>let config = {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
            data: [10, 0, 20, 30],
            label: 'My dataset',
        }]
    },
    options: {
        tooltips: {
            mode: 'single'
        }
    }
};</code></pre>
        </div>
        <aside class="notes">
            <ul>
                <li>8 different chart types. line, bar, horizontal-bar, radar, polar area, doughnut, pie, bubble</li>
                <li>Dataset options configure options that are specifc to that dataset. Like different colours for each line</li>
                <li>Options object are used to configure the entire chart</li>
            </ul>
        </aside>
    </section>
</section>
<section>
    <h3>Updating Charts</h3>
</section>
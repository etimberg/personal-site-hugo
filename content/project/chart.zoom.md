+++
Title = "Chart.js Zoom Plug-In"
Weight = 1
+++
In early May 2016, I wrote a [Zoom and Pan plugin](https://github.com/chartjs/Chart.Zoom.js) to work with the new plugin system introduced in Chart.js v2.1.0. The plugin is touch ready and allows the use of gestures, such as pinch, to zoom the chart. Take a look at the chart below and try it out!

{{< chart id="zoom-chart" class="large-chart" >}}
{
    type: 'scatter',
    data: {
        datasets: [{
            data: [{
                x: -100,
                y: 0
            }, {
                x: 0,
                y: 50
            }, {
                x: 75,
                y: 75
            }, {
                x: 0,
                y: -50
            }],
            label: 'Dataset 1',
            borderColor: '#36A2EB',
            pointBackgroundColor: '#36A2EB',
            backgroundColor: 'rgba(54,162,235, 0.4)'
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Scatter Chart with Zoom and Pan'
        },
        scales: {
            xAxes: [{
                position: 'bottom',
                gridLines: {
                    zeroLineColor: "rgba(0,255,0,1)"
                },
                scaleLabel: {
                    display: true,
                    labelString: 'x axis'
                },
                ticks: {
                    maxRotation: 0,
                }
            }],
            yAxes: [{
                position: 'left',
                gridLines: {
                    zeroLineColor: "rgba(0,255,0,1)"
                },
                scaleLabel: {
                    display: true,
                    labelString: 'y axis'
                },
                ticks: {
                    reverse: true
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            mode: 'xy',
            limits: {
                max: 10,
                min: 0.5
            }
        }
    }
}
{{< /chart >}}
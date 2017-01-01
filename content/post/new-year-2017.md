+++
Title = "Reflecting on Chart.js in 2016"
Weight = -1
date = "2016-12-31T18:45:47-05:00"
+++
{{< script src="/js/Chart.min.js" >}}

Chart.js has had an incredibly last year. In April, we successfully launched v2.0 culminating a year and a half of hard work. We've had a number of smaller releases after that, each of which has helped build on the incredibly interactivity that comes standard in v2. We also released our first new chart type in a long time; the horizontal bar chart. This was a long sought request, that fit in well with the work we did in v2.

<br>
Coupled with this work, we saw a dramatic increase in use this year, with monthly NPM installs going from ~20k to over 200k per month. It's amazing and humbling to see so many users choosing Chart.js for their projects.

{{< chart id="chartjs-monthly-downloads" class="extra-large-chart" >}}
{
    type: 'line',
    data: {
        labels: ['Jan 2015', 'Feb 2015', 'Mar 2015', 'Apr 2015', 'May 2015', 'Jun 2015', 'Jul 2015', 'Aug 2015', 'Sep 2015', 'Oct 2015', 'Nov 2015', 'Dec 2015', 'Jan 2016', 'Feb 2016', 'Mar 2016', 'Apr 2016', 'May 2016', 'Jun 2016', 'Jul 2016', 'Aug 2016', 'Sep 2016', 'Oct 2016', 'Nov 2016', 'Dec 2016'],
        datasets: [{
            data: [826, 1240, 2156, 3231, 4050, 5802, 6817, 7029, 8251, 10870, 13887, 17470, 20498, 27370, 42472, 61385, 70688, 79499, 86129, 113562, 135716, 181799, 204399, 201846],
            label: 'Chart.js NPM Installs',
            borderColor: '#36A2EB',
            pointBackgroundColor: '#36A2EB',
            backgroundColor: 'rgba(54,162,235, 0.4)',
            fill: false
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Chart.js Monthly Installs'
        },
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var ds = data.datasets[tooltipItem.datasetIndex];
                    var datasetLabel = ds.label;
                    return datasetLabel + ": " + ds.data[tooltipItem.index].toLocaleString();
                }
            }
        }
    }
}
{{< /chart >}}
*The data in the above chart is from [NPM Stat](https://npm-stat.com/charts.html?package=Chart.js&from=2015-01-01&to=2016-12-31)*

<br>
<br>

## 2017 Roadmap
<br>
In 2017, we are committed to working on improving the ability to run Chart.js in an environment other than the browser. In version 2.5, we will have factored out the browser specific events into a removable piece known as a `platform`. With this change, it will be possible to create a build that runs in a JavaScript environment that does not have the DOM APIs.

<br>
We have also committed to improving our documentation. We are working on creating auto-generated documentation so that we can have the latest dev docs auto update when new commits are added. This will allow us to be more responsive to user feedback and ensure timely corrections when the docs have errors.

<br>
Overall, 2017 is shaping up to be a great year for Chart.js. Have a safe and happy new year!


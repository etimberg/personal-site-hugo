+++
Title = "Chart.js"
Weight = 0
+++

Since late 2014, I have been involved with [Chart.js](http://www.chartjs.org). I am currently, along with Tanner Linsley, one of the primary contributors and was responsible for a number of the big developments in version 2. 

<br>
It's been a great adventure, and my first experience with open-source development. It's scary at times to think that my code gets 50k+ downloads a month. Chart.js was also my first experience using the HTML 5 Canvas APIs, but it felt quite natural coming from C++ code that made use of Windows [GDI](https://msdn.microsoft.com/en-us/library/windows/desktop/dd145203(v=vs.85).aspx) APIs. A lot of the tricks used to improve canvas performance are similar to the tricks done in legacy GDI code. 

{{< chart id="line-chart" class="large-chart" >}}
{
    type: 'line',
    data: {
        datasets: [{
            data: [10, 20, 30],
            label: 'Dataset 1',
            borderColor: '#36A2EB',
            pointBackgroundColor: '#36A2EB',
            backgroundColor: 'rgba(54,162,235, 0.4)'
        }, {
            data: [30, 20, 15],
            label: 'Dataset 2',
            borderColor: 'rgb(255,99,132)',
            pointBackgroundColor: 'rgb(255,99,132)',
            backgroundColor: 'rgba(255,99,132, 0.4)'
        }],
        labels: ['Label 1', 'Label 2', 'Label 3']
    },
    options: {
        tooltips: {
            mode: 'label'
        },
        responsiveAnimationDuration: 0
    }
}
{{< /chart >}}

In addition to feature work, I added most of the initial tests to the project. I added the infrastructure to get tests and coverage analysis running. I enjoy adding and improving tests when writing features.
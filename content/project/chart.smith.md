+++
Title = "Smith Charts with Chart.js"
Weight = 2
+++
Back when I was in university, I used Smith Charts all the time to visualize transmission line network matching. There aren't many web ways of creating one, so I took a stab at it. 

<br>
The charts turned out surprisingly well. I found it much easier to do a lot of the scale work in a circular coordinate system with a final conversion to cartesian coordinates at the end.

<br>
Building on the theme of reusable Chart components in Chart.js v2, I was able to reuse most of the existing functionality from the line chart controller. I hope in the future I can clean up the code for the Smith Chart and make it a good reference design for what extensions can look like.

{{< chart id="smith-chart" class="extra-large-chart" >}}
{
    type: 'smith',
    data: {
        datasets: [{
            data: [{
                real: 0.1,
                imag: 0
            }, {
                real: 1,
                imag: 0
            }, {
                real: 0,
                imag: -1
            }, {
                real: 20,
                imag: 0
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
            text: 'Smith Chart Extension'
        },
        legend: {
            display: false
        }
    }
}
{{< /chart >}}
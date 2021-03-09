// app.js
// set the dimensions and margins of the graph

const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

google.charts.load('current', {'packages':['corechart']});

let global_time;
google.charts.setOnLoadCallback(() => {
    global_time = new Date().getTime();
    let data = google.visualization.arrayToDataTable([
        ['Time', 'Vibe'],
        [0, 1]
    ]);

    let chartOptions = {
        title: 'Vibe Graph',
        hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}, minValue: 0},
        vAxis: {minValue: 0, maxValue: 10},
        animation:{ duration: 100, easing: 'out' }
    }

    drawChart(data, chartOptions);
});



const pusher = new Pusher('1e684d5e7daf1972c4f7', {
    cluster: 'us2',
    encrypted: true,
});

function drawChart(data, options) {
    const chart = new google.visualization.LineChart(document.getElementById('graph'));
    chart.draw(data, options);
    const channel = pusher.subscribe('poll-channel');
    channel.bind('update-poll', ping => {
        update(ping, chart, options, data);
    });
}

function update(time, chart, options, data) {
    // Scale the range of the data in the x axis
    const entry = decodeData(time);
    data.addRow(entry);
    chart.draw(data, options);
}

function decodeData(time) {
    return [(time.time - global_time) / 1000, 1];
}



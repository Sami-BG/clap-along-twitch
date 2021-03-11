// app.js
// set the dimensions and margins of the graph

const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

google.charts.load('current', {'packages':['corechart']});

const GraphUpdateInterval = 1000;
const ViewWindow = [];
const time = new Date().getTime();
let updateCount = 0;
const totalDisplayWidth = 25;

google.charts.setOnLoadCallback(() => {
    const data = new google.visualization.DataTable();
    data.addColumn('number', 'Time');
    data.addColumn('number', 'Hype');
    data.addRows(totalDisplayWidth);
    const view = new google.visualization.DataView(data);

    const options = {
        title: 'Vibe Graph',
        hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}, minValue: 0, maxValue: 10},
        vAxis: {minValue: 0, maxValue: 10}
    }
    const firstTime = new Date().getTime();
    const chart = drawChart(data, options);
    const channel = pusher.subscribe('poll-channel');
    channel.bind('update-poll', (obj) => {
        update(obj['time'], obj['frequency'], view, data, options, chart, firstTime);
    });
});

const pusher = new Pusher('1e684d5e7daf1972c4f7', {
    cluster: 'us2',
    encrypted: true,
});

function drawChart(data, options) {
    const chart = new google.visualization.LineChart(document.getElementById('graph'));
    chart.draw(data, options);
    return chart;
}

// how do i stop having a hundred million arguments

function update(pingTime, pingValue, view, data, options, chart, firstTime) {
    // Scale the range of the data in the x axis
    updateCount++;
    options.hAxis.minValue += 1;
    if (updateCount > totalDisplayWidth) {
        options.hAxis.maxValue += 1;
    }
    const entry = decodeData(pingTime, pingValue, firstTime);
    if (data.getNumberOfRows() > totalDisplayWidth) {
        data.removeRow(0);
    }
    data.addRow(entry);
    chart.draw(data, options);
}

function decodeData(time, pingValue, firstTime) {
    return [updateCount, pingValue];
}



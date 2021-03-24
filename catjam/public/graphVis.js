// app.js
// set the dimensions and margins of the graph

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = 960 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

const time = new Date().getTime();
const totalDisplayWidth = 20;
let updateCount = totalDisplayWidth;

var trace1 = {
    x: new Array(totalDisplayWidth),
    y: new Array(totalDisplayWidth),
    type: 'scatter',
    line: {
        color: 'rgb(0,0,0)',
        width: 3,
        shape: 'hvh'
    }
};

var layout = {
    title: '',
    showlegend: false,
    modebar: false,
    xaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
    },
    yaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
    },
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
    },
    plot_bgcolor:"darkgrey",
    hovermode: false
};

var config = {displayModeBar: false};
var data = [trace1];


graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout, config);


const pusher = new Pusher('1e684d5e7daf1972c4f7', {
    cluster: 'us2',
    encrypted: true,
});

const channel = pusher.subscribe('poll-channel');
channel.bind('update-poll', (obj) => {
    update(obj['time'], obj['frequency']);
});


// how do i stop having a hundred million arguments

function update(pingTime, pingValue) {
    // Scale the range of the data in the x axis
    updateCount++;
    const entry = decodeData(pingTime, pingValue);
    const magnitude = entry[1];
    Plotly.extendTraces(graph, { y: [[magnitude]], x: [[updateCount]] }, [0], totalDisplayWidth);
}

function decodeData(time, pingValue) {
    return [updateCount, pingValue];
}

// interval = setInterval(() =>{
//    update(new Date().getTime(),
//    Math.floor(Math.random() * 10))}, 40);


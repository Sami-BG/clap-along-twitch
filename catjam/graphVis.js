// app.js
// set the dimensions and margins of the graph
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = 250;
const height = 250;
var ngrokLink = 'https://b8742e5590a2.ngrok.io';

const totalDisplayWidth = 60;
let updateCount = totalDisplayWidth;
var latency = 0;

var trace1 = {
    x: [0],
    y: [Math.random()],
    type: 'scatter',
    line: {
        color: 'rgb(0,0,0)',
        width: 3,
        shape: 'hvh'
    }
};

var graphDiv = $('#graph');

var layout = {
    title: '',
    height: graphDiv.height() * 0.5,
    width: graphDiv.width(),
    showlegend: false,
    modebar: false,
    xaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        fixedrange: true
    },
    yaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        fixedrange: true
    },
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
    },
    plot_bgcolor:"darkgrey",
    hovermode: false,
};

var config = {displayModeBar: false, responsive: true};
var data = [trace1];

const pusher = new Pusher('1e684d5e7daf1972c4f7', {
    cluster: 'us2',
    encrypted: true,
});

const channel = pusher.subscribe('poll-channel');
channel.bind('update-poll', (mapOfTimeToPing) => {
    update(mapOfTimeToPing);
});

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout, config);

function update(mapOfTimeToPing) {
    // Scale the range of the data in the x axis
    updateCount++;
    let pack = decodeData(mapOfTimeToPing);
    let streamStartTime = mapOfTimeToPing.streamStartDate;
    let sortedMagnitudes = pack[0];
    let sortedTimestamps = pack[1]
    // magnitudes are the 1th index of every element
    // Select only the timestamp that we care about given our delay:
    let currentTime = new Date().valueOf();
    let delayedDate = new Date((currentTime - (latency * 1000)));
    let normalizedDelayedTime = Math.floor((delayedDate - streamStartTime) / 1000);

    let magnitude = sortedMagnitudes[0];
    let timestamp = sortedTimestamps[0];
    Plotly.extendTraces(graph, { y: [[magnitude]], x: [[timestamp]] }, [0], totalDisplayWidth);
    console.log(graph);
}

function decodeData(mapOfTimeToPing) {
    /*
    Takes a map of pingTime to pingValue, sorts them both according to timestamps,
    and returns the two lists
     */
    let magnitudes = [];
    let timestamps = [];
    for (const timestamp in mapOfTimeToPing) {
        timestamps.push(parseInt(timestamp));
        magnitudes.push(mapOfTimeToPing[timestamp]);
    }

    var len = timestamps.length;
    var indices = new Array(len);
    for (var i = 0; i < len; ++i) indices[i] = i;
    indices.sort(function (a, b) { return timestamps[a] < timestamps[b] ? -1 : timestamps[a] > timestamps[b] ? 1 : 0; });
    console.log(indices);
    let sortedMagnitudes = indices.map(i => magnitudes[i]);
    let sortedTimestamps = indices.map(i => timestamps[i]);
    return [sortedMagnitudes, sortedTimestamps];
}

// interval = setInterval(() =>{
//    update(new Date().getTime(),
//    Math.floor(Math.random() * 10))}, 40);

window.Twitch.ext.onContext(function(contextCallback) {
    latency = contextCallback.hlsLatencyBroadcaster || 0;
});
var latency = 0;
var userId = 0;
// Open ngrok then do ngrok.exe http 3000 to create a link that forwards to localhost 3000
var ngrokLink = 'https://71d053a38d6d.ngrok.io';

$(document).on("click", sendTimeToServer);

async function sendTimeToServer() {
    var time = new Date();
    const port = 4000;
    console.log('sendTimeToServer called');
    const response = await fetch(ngrokLink + '/ping', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                time: time,
                time_diff : latency,
                client_id : userId
            })
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    console.log('Received response ' + response + ' from server');
}

window.Twitch.ext.onAuthorized(function(auth) {
        console.log('The user ID is', auth.userId);
        userId = auth.userId;
});

window.Twitch.ext.onContext(function(contextCallback) {
        console.log('The hlsLatencyBroadcast is', contextCallback.hlsLatencyBroadcaster);
        latency = contextCallback.hlsLatencyBroadcaster;
    });
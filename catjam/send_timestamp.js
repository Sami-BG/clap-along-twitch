var latency = 0;
var userId = 0;
var channelId = 0;
// Open ngrok then do ngrok.exe http 3000 to create a link that forwards to localhost 3000
var ngrokLink = 'https://b8742e5590a2.ngrok.io';

$(document).on("click", sendTimeToServer);

async function sendTimeToServer() {
    // Universal time in seconds
    var time = new Date().valueOf() / 1000;
    const port = 4000;
    console.log('sendTimeToServer called');
    const response = await fetch(ngrokLink + '/ping', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                time: time,
                delay : latency,
                user_id : userId,
                channel_id : channelId
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
        console.log('The channelId ID is', auth.channelId);
        channelId = auth.channelId;
});

window.Twitch.ext.onContext(function(contextCallback) {
        latency = contextCallback.hlsLatencyBroadcaster;
    });
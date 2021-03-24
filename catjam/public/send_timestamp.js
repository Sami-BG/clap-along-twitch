async function sendTimeToServer() {
    var time = new Date();
    //TODO : add stream time to request.

    // This is the port where we will run our web server
    const port = 4000;
    console.log('sendTimeToServer called');
    const response = await fetch('http://localhost:' + port + '/ping', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                time: time,
                time_diff : get_time_diff(),
                client_id : get_user_id()
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

function get_user_id() {
    window.Twitch.ext.onAuthorized(function(auth) {
        console.log('The channel ID is', auth.channelId);
        return auth.userId
    });
}

function get_time_diff() {
    window.Twitch.ext.onContext(function(contextCallback) {
        return contextCallback.context.hlsLatencyBroadcaster
    });

}
function sendTimeToServer() {
    var time = new Date();
    // This is the port where we will run our web server
    const port = 4000;
    console.log('sendTimeToServer called');
    fetch('http://localhost:' + port + '/ping', {
        method: 'POST',
        body: {
            'global_time_sent': JSON.stringify(time),
            'stream_time_sent': 'nothing rn'
        }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

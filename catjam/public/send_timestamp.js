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
                time: time
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

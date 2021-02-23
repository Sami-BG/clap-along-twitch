function sendTimeToServer() {
    var time = new Date()
    // We can add the modules we imported from NPM using require
    const express = require('express')

    // Calling express as a function we create a basic web server
    const app = express()

    // This is the port where we will run our web server
    const port = 3000

    app.get('/', (req, res) => res.send(time))

}

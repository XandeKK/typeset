const net = require("net");
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

module.exports = function(serveStatic) {
    const server = new WebSocket.Server({ port: 8080 });

    server.on('connection', (socket) => {
        let client = net.createConnection({ host: "localhost", port: 1234 });

        socket.on('message', (message) => {
            const msg = JSON.parse(message);
            if (msg.type === 'save') {
                const base64Data = msg.data.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(msg.filename, base64Data, 'base64', (err) => {
                    if (err) {
                        socket.send(JSON.stringify({type: 'error', message: err}))
                    } else {
                        socket.send(JSON.stringify({type: 'message', message: 'Image saved!'}))
                    }
                });
            } else {
                serveStatic(path.join(msg.path + "/cleaned"));
                client.write(message);
            }
        });

        client.on("data", (data) => {
            socket.send(data.toString());
        });

        socket.on('close', ()=> {
            if (client !== null) {
                client.end();
            }
        });
    });
}
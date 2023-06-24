const net = require("net");
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
let sockets = [];

server.on('connection', function(socket) {
    const client = net.createConnection({ host: "localhost", port: 1234 });
    let buffer = '';

    sockets.push(socket);

    socket.on('message', function(message) {
        client.write(message)
    });

    client.on("data", (data) => {
        socket.send(data.toString());
    });

    socket.on('close', ()=> {
        client.end();
    });
});

const net = require("net");
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function glob_json(msg) {
    let start = msg.start || 0;
    let end = msg.end || null;

    let files;
    if (start === -1) {
        files = glob.sync(path.join(msg['path'], '*.json'));
    } else {
        files = [];
        for (let i = start; i <= end; i++) {
            let jsonPath = path.join(msg['path'], `${i}.json`);
            if (fs.existsSync(jsonPath)) {
                files.push(jsonPath);
            }
        }
    }

    files.sort((a,b)=> a - b);

    return files;
}

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
                fs.writeFile(msg.filename.replace(/(jpg|png)$/, 'json'), msg.json, (err) => {
                    if (err) {
                        socket.send(JSON.stringify({type: 'error', message: err}))
                    } else {
                        socket.send(JSON.stringify({type: 'message', message: 'File saved!'}))
                    }
                });
            } else {
                serveStatic(path.join(msg.path + "/cleaned"));
                if (msg.load) {
                    const files = glob_json(msg);
                    files.forEach((file)=> {
                        const objects = fs.readFileSync(file, 'utf8');
                        const objects_parsed = JSON.parse(objects);
                        setTimeout(()=> {
                            socket.send(JSON.stringify({
                                type: 'load',
                                objects: objects,
                                path: path.join(msg.path, objects_parsed[0].filename),
                                type_style: msg.type_style
                            }));
                        }, 100);
                    });
                } else {
                    client.write(message);
                }
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
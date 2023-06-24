class Socket {
    constructor() {
        this.path = document.getElementById('path');
        this.fileInput = document.getElementById('fileInput');
        this.submit = document.getElementById('submit');
        this.socket = new WebSocket('ws://localhost:8080');
        this.handler = {
            boxs: this.get_boxs,
            finished: this.finish,
            error: this.get_error
        };

        this.socket_event();

        localStorage.setItem('files', '');
    }

    socket_event() {
        this.socket.onopen = () => {
            console.log('Connected to server!');
        };

        this.socket.onmessage = (event) => {
            const json = JSON.parse(event.data);
            this.handler[json.type](json);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from server');
        };

        this.submit.addEventListener('click', () => {
            window.files = fileInput.files;
            const message = {
                type: 'images',
                files: Array.from(files).map(file => path.value + "/" + file.name)
            }
            console.log(message);
            this.socket.send(JSON.stringify(message));
        });
    }

    get_boxs(msg) {
        main.add_image(msg);
    }

    finish(msg) {
        Alert.alert("finished", 'info');
    }

    get_error(msg) {
        Alert.alert(msg.message, 'danger');
    }
}

new Socket();
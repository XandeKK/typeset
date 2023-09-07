class Socket {
	constructor(listeners, callback) {
		this.path = document.getElementById('path');
		this.start = document.getElementById('start');
		this.end = document.getElementById('end');
		this.type_style = document.getElementById('type_style');
		this.load_file = document.getElementById('load_file');
		this.submit = document.getElementById('submit');
		this.callback = callback;

		this.socket = io.connect('http://' + document.domain + ':' + location.port);

		listeners.forEach((listener)=> {
			this.socket.on(listener.name, listener.callback);
		});

		this.listeners();
		this.events();
	}

	listeners() {
		this.socket.on('connect', function () {
			Alert.alert('WebSocket connected');
		});

		this.socket.on('disconnect', function () {
			Alert.alert('WebSocket disconnected');
		});
	}

	events() {
		this.submit.addEventListener('click', () => {
            const message = {
                path: this.path.value,
                start: Number(this.start.value),
                end: Number(this.end.value),
                type_style: this.type_style.value

            }
            window.type_style = this.type_style.value;
            this.socket.emit('works', message);
            this.callback(this.path.value);
        });

        this.load_file.addEventListener('click', () => {
            const message = {
                path: this.path.value,
                start: Number(this.start.value),
                end: Number(this.end.value),
                type_style: this.type_style.value

            }
            window.type_style = this.type_style.value;
            this.socket.emit('load', message);
            this.callback(this.path.value);
        });
	}
}
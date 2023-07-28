class Socket {
    constructor(options={}) {
        this.path = document.getElementById('path');
        this.start = document.getElementById('start');
        this.end = document.getElementById('end');
        this.type_style = document.getElementById('type_style');
        this.load_file = document.getElementById('load_file');
        this.submit = document.getElementById('submit');
        this.download = document.getElementById('download');
        this.canvas_handler = options.canvas_handler;
        this.socket = new WebSocket('ws://localhost:8080');
        this.handler = {
            load: options.load || this.load,
            boxs: options.get_boxs || this.get_boxs,
            finished: options.finish || this.finish,
            error: options.get_error || this.get_error,
            message: options.get_message || this.get_message
        };

        this.socket_event();

        document.getElementById('download').addEventListener('click', this.upload_image.bind(this));
    }

    upload_image() {
        const filename = this.canvas_handler.images[this.canvas_handler.current_index_image].path_with_filename;
        if (filename === undefined || filename === null) {
            Alert.alert("you can't save without image", 'warning');
            return;
        }

        const image_item = this.canvas_handler.images[this.canvas_handler.current_index_image];

        const canvas = document.createElement('canvas');
        const canvas_original = new Canvas(canvas, image_item.img.width, image_item.img.height);
        const image = new ImageCanvas(image_item, canvas_original);
        const objects = this.canvas_handler.canvas.get_objects(image_item.img.height / this.canvas_handler.canvas.height, canvas_original);

        canvas_original.add_object(image);
        canvas_original.add_objects(objects);
        canvas_original.draw();

        canvas_original.canvas_element.toBlob(blob => {
            const file = new File([blob], filename, {type: 'image/png'});
            const reader = new FileReader();
            reader.onload = () => {
                this.socket.send(JSON.stringify({
                    type: 'save',
                    filename: filename,
                    data: reader.result,
                    json: JSON.stringify(this.canvas_handler.canvas.objects)
                }));
            };
            reader.readAsDataURL(file);
        });
    }

    socket_event() {
        this.socket.onopen = () => {
            Alert.alert('Connected to server!');
        };

        this.socket.onmessage = (event) => {
            const json = JSON.parse(event.data);
            this.handler[json.type](json);
        };

        this.socket.onclose = () => {
            Alert.alert('Disconnected from server');
        };

        this.submit.addEventListener('click', () => {
            const message = {
                type: 'images',
                path: this.path.value,
                start: Number(this.start.value),
                end: Number(this.end.value),
                type_style: this.type_style.value,
                load: this.load_file.checked

            }
            this.socket.send(JSON.stringify(message));
        });
    }

    load(msg) {
        Alert.alert("load", 'info');
    }

    get_boxs(msg) {
        Alert.alert("get boxs", 'info');
    }

    finish(msg) {
        Alert.alert("finished", 'info');
    }

    get_error(msg) {
        Alert.alert(JSON.stringify(msg.message), 'danger');
    }

    get_message(msg) {
        Alert.alert(JSON.stringify(msg.message), 'info');
    }
}
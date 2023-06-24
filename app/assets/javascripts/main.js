class Main {
    constructor() {
        this.viewer = document.getElementById('viewer');
        this.canvas = new Canvas("canvas", viewer.offsetWidth / 2, viewer.offsetHeight);
        this.images = [];
        this.current_index_image = 0;
        this.current_file = null;
        this.current_image = null;
        this.back_image = document.getElementById('back_image');
        this.next_image = document.getElementById('next_image');

        this.add_event();
    }

    add_event() {
        this.back_image.addEventListener('click', this.back.bind(this));
        this.next_image.addEventListener('click', this.next.bind(this));
    }

    add_image(msg) {
        const img = new Image();
        const filename = this.get_filename(msg);
        const file = Array.from(window.files).filter(file => file.name == filename)[0]
        const current_file = Array.from(window.files).filter(file => file.name == filename)[0]
        img.src = URL.createObjectURL(file);
        msg['img'] = img;
        msg['file'] = current_file;

        this.images.push(msg);

        if (this.images.length == 1) {
            this.set_image(msg);
        }

        if (this.images.length == 2) {
            document.getElementById('next_image').classList.remove('hidden');
        }
    }

    get_filename(msg) {
        const path = msg.filename.split('/');
        const filename = path[path.length - 1];
        msg.filename = filename;
        return filename;
    }

    set_image(msg) {
        this.current_file = msg.file;
        this.current_msg = msg;

        this.current_image = new ImageCanvas(msg, this.canvas);
        this.canvas.clear_objects();
        this.canvas.add_object(this.current_image);

        this.img = msg.img;

        this.interval = setInterval(()=> {
            if (this.current_image.percent !== 0) {
                this.set_box(this.current_image);
                clearInterval(this.interval);
            }
        }, 100)
    }

    set_box(image) {
        const boxs = this.images[this.current_index_image].boxs;

        boxs.forEach((box) => {
            const bubble = new Bubble(box.x1 * image.percent, box.y1 * image.percent, (box.x2 - box.x1) * image.percent, (box.y2 - box.y1) * image.percent, this.canvas);
            const text = new TextBubble({ text: "", font: 'CCWildWords', font_size: 15, bubble: bubble });
            bubble.set_object_text(text);
            this.canvas.add_object(bubble);
            this.canvas.add_object(text);
        });
    }

    back() {
        this.current_index_image--;

        if (this.current_index_image < 0) {
            this.current_index_image++;
        } else if (this.current_index_image == 0) {
            document.getElementById('back_image').classList.add('hidden');
        }

        if (this.current_index_image < this.images.length) {
            document.getElementById('next_image').classList.remove('hidden');
        }

        this.set_image(this.images[this.current_index_image]);
    }

    next() {
        this.current_index_image++;

        if (this.current_index_image > this.images.length) {
            this.current_index_image--;
        } else if (this.current_index_image == this.images.length - 1) {
            document.getElementById('next_image').classList.add('hidden');
        }

        if (this.current_index_image > 0) {
            document.getElementById('back_image').classList.remove('hidden');
        }

        this.set_image(this.images[this.current_index_image]);
    }
}

const main = new Main();
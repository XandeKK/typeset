class CanvasHandler {
	constructor() {
        this.viewer = document.getElementById('viewer');
        this.canvas = new Canvas("canvas", viewer.offsetWidth / 2, viewer.offsetHeight);
        this.drawer_bubble = new DrawBubble(this.canvas);
        this.socket = new Socket({get_boxs: this.get_boxs.bind(this), canvas_handler: this});
        this.image_handler = new ImageHandler(this);

        this.images = [];
        this.current_index_image = 0;
        
        this.add_event();
    }

    add_event() {
        document.getElementById('back_image').addEventListener('click', this.back.bind(this));
        document.getElementById('next_image').addEventListener('click', this.next.bind(this));
    }

    get_boxs(msg) {
        const filename = msg.filename.replace(/.*raw\//, '');
        fetch(filename)
          .then(response => response.blob())
          .then(blob => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                this.images.push({
                    path_with_filename: msg.filename.replace('raw/', ''),
                    filename: filename,
                    boxs: msg.boxs,
                    img: img
                });
                this.image_added();
            }
          });
    }

    image_added() {
        if (this.images.length == 1) {
            this.set_image(this.images[0]);
        }

        if (this.images.length - 2 == this.current_index_image) {
            this.set_mode_button('next_image', true);
        }
    }

    set_image(data) {
        const image_canvas = new ImageCanvas(data, this.canvas);
        this.canvas.clear_objects();
        this.canvas.add_object(image_canvas);

        data.boxs.forEach((box) => {
            const bubble = new BubbleCanvas(box.x1 * image_canvas.percent, box.y1 * image_canvas.percent, (box.x2 - box.x1) * image_canvas.percent, (box.y2 - box.y1) * image_canvas.percent, this.canvas);
            const text = new TextCanvas({ text: "", font: 'CCWildWords-Regular', font_size: 11, bubble: bubble });
            bubble.set_object_text(text);
            this.canvas.add_object(bubble);
            this.canvas.add_object(text);
        });
    }

    set_mode_button(button, show) {
        const element = document.getElementById(button);
        if (show) {
            element.classList.remove('bg-blue-400', 'cursor-not-allowed');
            element.classList.add('bg-blue-700', 'hover:bg-blue-800', 'cursor-pointer');
            element.disabled = false;
        } else {
            element.classList.remove('bg-blue-700', 'hover:bg-blue-800', 'cursor-pointer');
            element.classList.add('bg-blue-400', 'cursor-not-allowed');
            element.disabled = true;
        }
    }

    back() {
        this.current_index_image--;

        if (this.current_index_image < 0) {
            this.current_index_image++;
        } else if (this.current_index_image == 0) {
            this.set_mode_button('back_image', false);
        }

        if (this.current_index_image < this.images.length) {
            this.set_mode_button('next_image', true);
        }

        this.set_image(this.images[this.current_index_image]);
    }

    next() {
        this.current_index_image++;

        if (this.current_index_image > this.images.length) {
            this.current_index_image--;
        } else if (this.current_index_image == this.images.length - 1) {
            this.set_mode_button('next_image', false);
        }

        if (this.current_index_image > 0) {
            this.set_mode_button('back_image', true);
        }

        this.set_image(this.images[this.current_index_image]);
    }
}

const canvas_handler = new CanvasHandler();
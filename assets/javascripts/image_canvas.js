class ImageCanvas {
    constructor(msg, canvas) {
        this.canvas = canvas;
        this.img = msg.img;
        this.percent = 0;
        this.filename = msg.filename;
        this.type_style = msg.type_style;
    }

    draw() {
        if (this.type_style == 'manga') {
            this.percent = this.canvas.height / this.img.height;
        } else if (this.type_style == 'manhwa') {
            this.percent = 1;
            this.canvas.set_height(this.img.height);
        }

        this.canvas.set_width(this.img.width * this.percent);
        this.canvas.context.drawImage(this.img, 0, 0, this.img.width * this.percent, this.canvas.height);
    }
}
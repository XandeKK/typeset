class ImageCanvas {
    constructor(msg={}, canvas=null) {
        this.canvas = canvas;
        this.img = msg.img;
        this.percent = 0;
        this.filename = msg.filename;
        this.type_style = msg.type_style;
    }

    toJSON() {
        return {
            name: this.constructor.name,
            percent: this.percent,
            filename: this.filename,
            type_style: this.type_style
        };
    }

    load(data, canvas) {
        this.canvas = canvas;
        this.img = data.img;
        this.percent = data.percent;
        this.filename = data.filename;
        this.type_style = data.type_style;
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
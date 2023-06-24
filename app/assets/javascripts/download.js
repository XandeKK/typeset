class Download {
    constructor(canvas) {
        this.canvas = canvas;

        document.getElementById('download').addEventListener('click', this.download.bind(this));
    }

    download() {
        // change this
        const canvas_original = new Canvas("canvas_original", main.img.width, main.img.height);
        const image = new ImageCanvas(main.current_msg, canvas_original);
        const objects = this.canvas.get_objects(main.img.height / this.canvas.height, canvas_original);

        canvas_original.add_object(image);
        canvas_original.add_objects(objects);
        setTimeout(() => {
            canvas_original.draw();
            let dataURL = canvas_original.canvas_element.toDataURL();
            let link = document.createElement('a');
            link.href = dataURL;
            link.download = canvas_original.objects[0].filename;
            link.click();
        }, 1000)
    }
}

new Download(main.canvas);
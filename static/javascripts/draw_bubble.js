class DrawBubble {
    constructor(canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.rect = null;

        this.canvas.on("mouse:down", this.onMouseDown.bind(this));
        this.canvas.on("mouse:move", this.onMouseMove.bind(this));
        this.canvas.on("mouse:up", this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        if (event.e.ctrlKey && !this.isDrawing) {
            this.isDrawing = true;
            const pointer = this.canvas.getPointer(event.e);
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.rect = new fabric.Rect({
                left: this.startX,
                top: this.startY,
                width: 0,
                height: 0,
                fill: "transparent",
                stroke: "black",
                strokeWidth: 2,
            });
            this.canvas.add(this.rect);
        }
    }

    onMouseMove(event) {
        if (this.isDrawing) {
            const pointer = this.canvas.getPointer(event.e);
            const left = Math.min(this.startX, pointer.x);
            const top = Math.min(this.startY, pointer.y);
            const width = Math.abs(pointer.x - this.startX);
            const height = Math.abs(pointer.y - this.startY);

            this.rect.set({
                left: left,
                top: top,
                width: width,
                height: height
            });

            this.canvas.renderAll();
        }
    }

    onMouseUp() {
        if (this.isDrawing && this.rect.width >= 70 && this.rect.height >= 70) {
            this.isDrawing = false;
            const bubble = new BubbleCanvas(this.canvas, {
                left: this.rect.left,
                top: this.rect.top,
                width: this.rect.width,
                height: this.rect.height
            });
            const text = new TextCanvas(this.canvas, {
                text: "",
                textAlign: 'center',
                fontSize: window.type_style === 'manga' ? 18 : 25,
                font: window.type_style === 'manga' ? 'CCWildWords-Regular' : 'CCMightyMouth-Regular',
                left: this.rect.left,
                top: this.rect.top,
                width: this.rect.width,
                height: this.rect.height
            })
            new Group(bubble, text, this.canvas);
            this.canvas.setActiveObject(text.text);
            this.canvas.remove(this.rect);
            this.rect = null;
        } else {
            this.isDrawing = false;
            this.canvas.remove(this.rect);
            this.rect = null;
        }
    }
}
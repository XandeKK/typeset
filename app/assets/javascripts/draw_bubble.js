class DrawBubble {
    constructor(canvas) {
        this.rect = {};
        this.drag = false;
        this.minDistance = 25;
        this.canvas = canvas;

        this.canvas.canvas_element.addEventListener('mousedown', (evt) => {
            this.rect.startX = evt.pageX - evt.target.offsetLeft;
            this.rect.startY = evt.pageY - evt.target.offsetTop;
            this.drag = true;
        });

        this.canvas.canvas_element.addEventListener('mousemove', (evt) => {
            if (this.drag) {
                this.rect.w = (evt.pageX - evt.target.offsetLeft) - this.rect.startX;
                this.rect.h = (evt.pageY - evt.target.offsetTop) - this.rect.startY;
                this.draw();
            }
        });

        this.canvas.canvas_element.addEventListener('mouseup', () => {
            this.drag = false;
            if (Math.abs(this.rect.w) > this.minDistance && Math.abs(this.rect.h) > this.minDistance) {
                const bubble = new Bubble(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, this.canvas);
                const text = new TextBubble({ text: "...", font: 'CCWildWords', font_size: 11, bubble: bubble });
                bubble.set_object_text(text);
                this.canvas.add_object(bubble);
                this.canvas.add_object(text);
                this.canvas.select_bubble(bubble);
                this.rect = {};
            }
        });
    }
    
    draw() {
        this.canvas.context.fillStyle = '#00000055';
        this.canvas.context.fillRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    }
}

new DrawBubble(main.canvas);
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

        this.canvas.canvas_element.addEventListener('mouseleave', () => {
            this.drag = false;
        });

        this.canvas.canvas_element.addEventListener('mouseup', () => {
            this.drag = false;
            if (Math.abs(this.rect.w) > this.minDistance && Math.abs(this.rect.h) > this.minDistance) {
                let text = null;
                const bubble = new BubbleCanvas(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h, this.canvas);
                if (document.getElementById('type_style').value === 'manga') {
                    text = new TextCanvas({ text: "", font: 'CCWildWords-Regular', font_size: 11, bubble: bubble });
                } else {
                    text = new TextCanvas({ text: "", font: 'CCMightyMouth-Regular', font_size: 25, bubble: bubble });
                }
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

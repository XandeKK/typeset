class Canvas {
    constructor(element, width, height) {
        if (typeof element === 'string' || element instanceof String) {
            this.canvas_element = document.getElementById(element);
        } else if (element.tagName === 'CANVAS') {
            this.canvas_element = element;
        } else {
            Alert.alert('Invalid element or not found element', 'danger');
        }

        this.canvas_element.width = width;
        this.canvas_element.height = height;

        this.context = this.canvas_element.getContext('2d');

        this.width = this.canvas_element.width;
        this.height = this.canvas_element.height;
        this.mousePos = { x: 0, y: 0 };
        this.objects = [];

        this.selected = null;
        this.hide_box = false;

        this.add_event();
    }

    add_event() {
        // get mouse and draw
        this.canvas_element.addEventListener('mousemove', (evt) => {
            const mousePos = this.getMousePos(evt);
            this.mousePos.x = mousePos.x;
            this.mousePos.y = mousePos.y;
            this.draw();
        }, false);

        // Deselect rect
        this.canvas_element.addEventListener('dblclick', () => {
            this.deselect_bubble();
        })

        // Select bubble
        this.canvas_element.addEventListener('click', (evt) => {
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].over) {
                    if (this.selected) { this.deselect_bubble(); }
                    this.select_bubble(this.objects[i]);
                }
            }
        });

        document.getElementById('hide_box').addEventListener('click', (evt)=> {
            this.hide_box = !this.hide_box;
            if (this.hide_box) {
                document.getElementById('eye').classList.add("hidden");
                document.getElementById('eye-slash').classList.remove("hidden");
            } else {
                document.getElementById('eye').classList.remove("hidden");
                document.getElementById('eye-slash').classList.add("hidden");
            }
            this.draw();
        });
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);

        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    }

    clear_objects() {
        this.objects = [];
    }

    delete_object(object) {
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.deselect_bubble();
            this.objects.splice(index, 1);
            this.draw();
        }
    }

    add_objects(objects) {
        objects.forEach(object => {
            if (object.draw === undefined) {
                return false;
            }

            this.objects.push(object);
        });
        this.draw();
    }

    add_object(object) {
        if (object.draw === undefined) {
            return false;
        }

        this.objects.push(object);
        this.draw();
    }

    getMousePos(evt) {
        var rect = this.canvas_element.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    reset() {
        this.rects = [];
    }

    set_width(width) {
        this.width = width;
        this.canvas_element.width = width;
    }

    select_bubble(bubble) {
        this.selected = bubble;
        this.selected.select();
    }

    deselect_bubble() {
        if (!this.selected) return;

        this.selected.deselect();
        this.selected = null;
    }

    get_objects(percent, canvas) {
        const objects = [];
        this.objects.forEach((object) => {
            if (!object.dup) return;
            objects.push(object.dup(percent, canvas));
        });
        return objects;
    }
}
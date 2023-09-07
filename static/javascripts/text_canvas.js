class TextCanvas {
    constructor(canvas, options, object=null) {
        this.canvas = canvas;

        if (object) {
            this.text = object;
        } else {
            this.text = new fabric.CustomTextbox(options);
        }
    }

    select() {
        const allElements = document.querySelectorAll('[data="text"]');
        allElements.forEach((input)=> {
            if (window.eventText) {
                input.removeEventListener('input', window.eventText);
            }

            if (input.type === 'checkbox') {
                input.checked = this.text[input.id];
            } else if (input.type === 'radio') {
                input.checked = this.text[input.name] === input.getAttribute('value-text');
            } else if (input.type === 'number') {
                input.value = this.text[input.id];
            } else {
                input.value = this.text[input.id];
            }
        });

        const font_el = document.getElementById('font');
        font_el.removeEventListener('set_font', window.eventText);
        font_el.value = this.text.font;

        window.eventText = this.set.bind(this);

        allElements.forEach((input)=> {
            input.addEventListener('input', window.eventText);
        });
        font_el.addEventListener('set_font', window.eventText);
    }

    deselect() {
        const allElements = document.querySelectorAll('[data="text"]');
        allElements.forEach((input)=> {
            if (window.eventText) {
                input.removeEventListener('input', window.eventText);
            }

            if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.type === 'radio') {
                input.checked = false;
            } else if (input.type === 'color'){
                input.value = '#000000';
            } else {
                input.value = '';
            }
        });

        const font_el = document.getElementById('font');
        font_el.removeEventListener('set_font', window.eventText);
        font_el.value = '';
    }

    set(evt) {
        evt.stopPropagation();
        if (evt.target.id === 'angle') {
            this.text.rotate(parseFloat(evt.target.value) || 0);
        }
        if (evt.target.type === 'checkbox') {
            this.text.set(evt.target.id, evt.target.checked);
        } else if (evt.target.type === 'radio') {
            this.text.set(evt.target.name, evt.target.getAttribute('value-text'));
        } else if (evt.target.type === 'number') {
            this.text.set(evt.target.id, parseFloat(evt.target.value) || 0);
        } else {
            this.text.set(evt.target.id, evt.target.value);
        }
        this.canvas.renderAll();
    }
}
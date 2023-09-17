class TextCanvas {
    constructor(canvas, options, object=null) {
        this.canvas = canvas;
        this.plugins = [];

        if (object) {
            this.text = object;
            this.text.textCanvas = this;
            this.text.plugins.forEach(plugin=> {
                this.text.addPlugin(window[plugin.name], plugin.id);
            });
        } else {
            this.text = new fabric.CustomTextbox({...options, textCanvas: this});
        }
    }

    addPlugin(name, plugin) {
        const object = {id: plugin.id, name: name, plugin: plugin};
        this.plugins[object.id] = object;
        this.text.dirty = true;
        this.canvas.renderAll();
        document.getElementById('plugins-installed').innerHTML = '';
        this.select();
    }

    frontendPlugin(object) {
        const parent = document.createElement('li');
        parent.id = object.id;
        parent.className = 'border border-gray-300 rounded bg-gray-100';
        document.getElementById('plugins-installed').appendChild(parent);

        const header = document.createElement('div');
        header.className = 'flex justify-between mb-1 p-1';
        parent.appendChild(header);

        const label = document.createElement('label');
        label.className = 'font-medium text-gray-900';
        label.textContent = object.name;
        header.appendChild(label);

        const elem = document.createElement('div');
        elem.className = 'p-2';
        parent.appendChild(elem);

        const button_remove = document.createElement('button');
        button_remove.textContent = 'X';
        button_remove.className = 'bg-red-500 rounded text-white hover:bg-red-700 px-2';
        button_remove.setAttribute('id-parent', object.id);
        button_remove.addEventListener('click', (evt)=> {
            const id = evt.target.getAttribute('id-parent');

            document.getElementById(id).remove();
            this.plugins[id].plugin.delete();
            delete this.plugins[id];
        });
        header.appendChild(button_remove);

        object.plugin.frontend(elem);
    }

    select() {
        for (const id in this.plugins) {
            this.frontendPlugin(this.plugins[id]);
        }

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
        document.getElementById('plugins-installed').innerHTML = '';

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

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
function mask(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-objects'] = [];
    }

    textbox.hooks.afterRender[id] = {
        id: id,
        function: function (obj, arg) {
            for (let i = 0; i < obj[arg.id + '-objects'].length; i++) {
                const shape = Shape.get_shape(obj[arg.id + '-objects'][i]);
                shape.render(arg.ctx);
            }
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {};
            json[arg.id + '-objects'] = obj[arg.id + '-objects'];
            return json;
        }
    }

    textbox.hooks.setScale[id] = {
        id: id,
        function: function (obj, arg) {
            obj[arg.id + '-objects'].forEach(object=> {
                object['top'] /= arg.scale;
                object['left'] /= arg.scale;

                if (object.type != 'circle') {
                    object['width'] /= arg.scale;
                    object['height'] /= arg.scale;
                } else {
                    object['radius'] /= arg.scale;
                }
            }) ;
        }
    }

    function frontend(parent) {
        parent.className = '';

        const div = document.createElement('div');
        div.className = 'p-2 flex gap-2';

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded text-xs font-medium";

        addButton.addEventListener('click', () => {
            const shape = shapeSelect.value;
            const data_shape = Shape.create_shape(shape, textbox, id + '-objects');
            textbox[id + '-objects'].push(data_shape.shape);
            boxList.appendChild(data_shape.frontend);

            textbox.dirty = true;
            textbox.canvas.renderAll();
        });

        const shapeDiv = HtmlElementFactory.createDiv();
        const shapeLabel = HtmlElementFactory.createLabel('Shape');

        const shapeSelect = HtmlElementFactory.createSelect(null, ["Rect", "Circle", "Triangle"]);

        shapeDiv.appendChild(shapeLabel);
        shapeDiv.appendChild(shapeSelect);
        div.appendChild(shapeDiv);

        const boxList = document.createElement("ul");
        boxList.className = "bg-white border border-gray-300 rounded p-1 flex flex-col text-xs font-medium";

        textbox[id + '-objects'].forEach(object=> {
            const element = Shape.frontend(object, textbox, id + '-objects');
            boxList.appendChild(element);
        });

        div.appendChild(addButton);
        parent.appendChild(div);
        parent.appendChild(boxList);
    }


    function _delete() {
        delete textbox.hooks.afterRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];

        textbox[id + '-objects'].forEach(object=> {
            textbox.canvas.remove(object);
            delete object;
        });

        delete textbox[id + '-objects'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('mask', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'mask', properties: [id + '-objects']};
    }
}

class Shape {
    static create_shape(shape, textbox, id) {
        return Shape[shape](textbox, id);
    }

    static get_shape(shape) {
        if (shape.type === 'rect') {
            return new fabric.Rect({
                ...shape
            });
        } else if (shape.type === 'circle') {
            return new fabric.Circle({
                ...shape
            });
        } else if (shape.type === 'triangle') {
            return new fabric.Triangle({
                ...shape
            });
        }  
    }

    static rect(textbox, id) {
        const shape = {
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            opacity: 1,
            fill: 'none',
            globalCompositeOperation: 'destination-out',
            type: 'rect'
        };

        const frontend = Shape.frontend(shape, textbox, id);

        return {shape, frontend};
    }

    static circle(textbox, id) {
        const shape = {
            left: 0,
            top: 0,
            radius: 50,
            opacity: 1,
            fill: 'none',
            globalCompositeOperation: 'destination-out',
            type: 'circle'
        };

        const frontend = Shape.frontend(shape, textbox, id);

        return {shape, frontend};
    }

    static triangle(textbox, id) {
        const shape = {
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            opacity: 1,
            fill: 'none',
            globalCompositeOperation: 'destination-out',
            type: 'triangle'
        };

        const frontend = Shape.frontend(shape, textbox, id);

        return {shape, frontend};
    }

    static frontend(shape, textbox, id) {
        const li = document.createElement('li');
        
        const header = document.createElement('div');
        header.className = 'flex justify-end';

        const button_remove = document.createElement('button');
        button_remove.textContent = 'X';
        button_remove.className = 'bg-red-500 rounded text-white hover:bg-red-700 px-1 w-10 py-1';
        button_remove.addEventListener('click', (evt)=> {
            li.remove();
            textbox.canvas.remove(shape);

            const index = textbox[id].indexOf(shape);
            textbox[id].splice(index, 1);

            textbox.dirty = true;
            textbox.canvas.renderAll();
        });
        header.appendChild(button_remove);

        const body = document.createElement('div');
        body.className = 'p-1 border-b border-gray-300 mb-1';

        const topDiv = HtmlElementFactory.createDiv();
        const topLabel = HtmlElementFactory.createLabel('Top');

        const eventTop = (evt)=> {
            shape['top'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const topInput = HtmlElementFactory.createInput('number', null, shape['top'], eventTop.bind(this));

        topDiv.appendChild(topLabel);
        topDiv.appendChild(topInput);
        body.appendChild(topDiv);

        const leftDiv = HtmlElementFactory.createDiv();
        const leftLabel = HtmlElementFactory.createLabel('Left');

        const eventLeft = (evt)=> {
            shape['left'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const leftInput = HtmlElementFactory.createInput('number', null, shape['left'], eventLeft.bind(this));

        leftDiv.appendChild(leftLabel);
        leftDiv.appendChild(leftInput);
        body.appendChild(leftDiv);

        if (shape.type == 'circle') {
            const radiusDiv = HtmlElementFactory.createDiv();
            const radiusLabel = HtmlElementFactory.createLabel('Radius');

            const eventRadius = (evt)=> {
                shape['radius'] = Number(evt.target.value);
                textbox.dirty = true;
                textbox.canvas.renderAll();
            };

            const radiusInput = HtmlElementFactory.createInput('number', null, shape['radius'], eventRadius.bind(this));

            radiusDiv.appendChild(radiusLabel);
            radiusDiv.appendChild(radiusInput);
            body.appendChild(radiusDiv);
        } else {
            const widthDiv = HtmlElementFactory.createDiv();
            const widthLabel = HtmlElementFactory.createLabel('Width');

            const eventWidth = (evt)=> {
                shape['width'] = Number(evt.target.value);
                textbox.dirty = true;
                textbox.canvas.renderAll();
            };

            const widthInput = HtmlElementFactory.createInput('number', null, shape['width'], eventWidth.bind(this));

            widthDiv.appendChild(widthLabel);
            widthDiv.appendChild(widthInput);
            body.appendChild(widthDiv);

            const heightDiv = HtmlElementFactory.createDiv();
            const heightLabel = HtmlElementFactory.createLabel('Height');

            const eventHeight = (evt)=> {
                shape['height'] = Number(evt.target.value);
                textbox.dirty = true;
                textbox.canvas.renderAll();
            };

            const heightInput = HtmlElementFactory.createInput('number', null, shape['height'], eventHeight.bind(this));

            heightDiv.appendChild(heightLabel);
            heightDiv.appendChild(heightInput);
            body.appendChild(heightDiv);
        }

        const opacityDiv = HtmlElementFactory.createDiv();
        const opacityLabel = HtmlElementFactory.createLabel('Opacity');

        const eventOpacity = (evt)=> {
            shape['opacity'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const opacityInput = HtmlElementFactory.createInput('number', null, shape['opacity'], eventOpacity.bind(this));
        opacityInput.step = '0.1';
        opacityInput.min = 0;
        opacityInput.max= 1;

        opacityDiv.appendChild(opacityLabel);
        opacityDiv.appendChild(opacityInput);
        body.appendChild(opacityDiv);

        const compositeDiv = HtmlElementFactory.createDiv();
        const compositeLabel = HtmlElementFactory.createLabel('Compo...');

        const eventComposite = (evt)=> {
            shape['globalCompositeOperation'] = evt.target.value;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const compositeSelect = HtmlElementFactory.createSelect(null, ["Destination-out", "Destination-in"], eventComposite.bind(this));

        compositeDiv.appendChild(compositeLabel);
        compositeDiv.appendChild(compositeSelect);
        body.appendChild(compositeDiv);

        li.appendChild(header);
        li.appendChild(body);

        return li;
    }
}



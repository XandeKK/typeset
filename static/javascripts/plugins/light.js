function light(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-geometry'] = 'circle';
        textbox[id + '-height'] = 0;
        textbox[id + '-direction'] = 'top';
        textbox[id + '-width'] = 0;
        textbox[id + '-x'] = 0;
        textbox[id + '-y'] = 0;
        textbox[id + '-radius'] = 200;
        textbox[id + '-fill'] = '#ffffff';
    }

    textbox.hooks.beforeLetterRender[id] = {
        id: id,
        function: function (obj, arg) {
            let gradient;
            if (obj[arg.id + '-geometry'] === 'rect') {
                const x1 = -obj.width / 2;
                const x2 = obj.width / 2;
                const y1 = -obj.height / 2;
                const y2 = obj.height / 2;

                if (obj[arg.id + '-direction'] === 'left') {
                    gradient = arg.ctx.createLinearGradient(x1, 0, x1 + obj[arg.id + '-width'], 0);
                } else if (obj[arg.id + '-direction'] === 'top') {
                    gradient = arg.ctx.createLinearGradient(x1 + obj.width / 2, y1, x1 + obj.width / 2, y1 + obj[arg.id + '-height']);
                } else if (obj[arg.id + '-direction'] === 'bottom') {
                    gradient = arg.ctx.createLinearGradient(x1 + obj.width / 2, y2, x1 + obj.width / 2, y2 - obj[arg.id + '-height']);
                } else if (obj[arg.id + '-direction'] === 'right') {
                    gradient = arg.ctx.createLinearGradient(x2, y1 + obj.height / 2, x2 - obj[arg.id + '-width'], y1 + obj.height / 2);
                }
            } else {
                gradient = arg.ctx.createRadialGradient(obj[arg.id + '-x'], obj[arg.id + '-y'], 0, obj[arg.id + '-x'], obj[arg.id + '-y'], obj[arg.id + '-radius']);
            }
            gradient.addColorStop(0, obj[id + '-fill']);
            gradient.addColorStop(1, obj.fill);

            arg.ctx.fillStyle = gradient;
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {}
            json[id + '-geometry'] = obj[id + '-geometry'];
            json[id + '-height'] = obj[id + '-height'];
            json[id + '-direction'] = obj[id + '-direction'];
            json[id + '-width'] = obj[id + '-width'];
            json[id + '-x'] = obj[id + '-x'];
            json[id + '-y'] = obj[id + '-y'];
            json[id + '-radius'] = obj[id + '-radius'];
            json[id + '-fill'] = obj[id + '-fill'];
            return json;
        }
    }

    textbox.hooks.setScale[id] = {
        id: id,
        function: function (obj, arg) {
            obj[id + '-height'] /= arg.scale;
            obj[id + '-width'] /= arg.scale;
            obj[id + '-x'] /= arg.scale;
            obj[id + '-y'] /= arg.scale;
            obj[id + '-radius'] /= arg.scale;
        }
    }

    function frontend(parent) {
        const eventgeometry = (evt)=> {
            textbox[id + '-geometry'] = evt.target.getAttribute('value-text');
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const geometryRadio = HtmlElementFactory.createRadio(null, null, ['circle', 'rect'], textbox[id + '-geometry'], eventgeometry.bind(this));

        parent.appendChild(geometryRadio);

        const dataDiv = HtmlElementFactory.createDiv('flex justify-between mb-2');

        parent.appendChild(dataDiv);

        const dataLabels = ['X', 'Y', 'Width', 'Height', 'Radius'];

        dataLabels.forEach(lbl=>{
            const div = HtmlElementFactory.createDiv('.');
            const label = HtmlElementFactory.createLabel(lbl);

            const eventTop = (evt)=> {
                textbox[id + '-' + lbl.toLowerCase()] = Number(evt.target.value);
                textbox.dirty = true;
                textbox.canvas.renderAll();
            };

            const input = HtmlElementFactory.createInput('number', null, textbox[id + '-' + lbl.toLowerCase()], eventTop.bind(this));

            div.appendChild(label);
            div.appendChild(input);

            dataDiv.appendChild(div);
        });

        const eventDirection = (evt)=> {
            textbox[id + '-direction'] = evt.target.getAttribute('value-text');
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const directionRadio = HtmlElementFactory.createRadio('grid grid-cols-2 gap-1 mb-2', null, ['Top', 'Bottom', 'Left', 'Right'], textbox[id + '-direction'], eventDirection.bind(this));

        parent.appendChild(directionRadio);

        const eventColor = (evt)=> {
            textbox[id + '-fill'] = evt.target.value;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const colorInput = HtmlElementFactory.createInput('color', 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10',textbox[id + '-fill'], eventColor.bind(this));

        parent.appendChild(colorInput);
    }

    function _delete() {
        delete textbox.hooks.beforeLetterRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];
        delete textbox[id + '-geometry'];
        delete textbox[id + '-height'];
        delete textbox[id + '-direction'];
        delete textbox[id + '-width'];
        delete textbox[id + '-x'];
        delete textbox[id + '-y'];
        delete textbox[id + '-radius'];
        delete textbox[id + '-fill'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0]?.includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('light', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'light', properties: [id + '-geometry', id + '-height', id + '-direction',
            id + '-width', id + '-x', id + '-y', id + '-radius', id + '-fill']};
    }
}
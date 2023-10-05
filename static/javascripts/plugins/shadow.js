function shadow(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-size'] = 3;
        textbox[id + '-fill'] = '#ffffff';
        textbox[id + '-x'] = 0;
        textbox[id + '-y'] = 0;
    }

    textbox.hooks.beforeRender[id] = {
        id: id,
        function: function (obj, arg) {
            const maxWidth = obj.width - obj.marginLeft - obj.marginRight;
            const lines = obj.breakTextIntoLines(maxWidth, arg.ctx);

            const textMeasured = arg.ctx.measureText('Á');
            const lineHeight = textMeasured.fontBoundingBoxAscent + textMeasured.fontBoundingBoxDescent + obj.lineHeight;
            const totalHeight = lines.length * lineHeight;

            const y1 = -obj.height / 2;
            const y2 = obj.height / 2;

            let y = y1 + obj.marginTop + (y2 - y1 - totalHeight - obj.marginTop - obj.marginBottom) / 2 + lineHeight;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineWidth = arg.ctx.measureText(line).width;

                let x;
                if (obj.textAlign == 'left') {
                    x = -obj.width / 2 + obj.marginLeft - obj.marginRight;
                } else if (obj.textAlign == 'right') {
                    x = -lineWidth + obj.width / 2 + obj.marginLeft - obj.marginRight;
                } else {
                    x = -lineWidth / 2 + obj.marginLeft - obj.marginRight;
                }
                for (let j = 0; j < line.length; j++) {
                    const letter = line[j];

                    arg.ctx.miterLimit = 2;
                    arg.ctx.lineJoin = 'circle';
                    arg.ctx.strokeStyle = obj[arg.id + '-fill'];
                    arg.ctx.lineWidth = obj[arg.id + '-size'];
                    arg.ctx.strokeText(letter, x + obj[arg.id + '-x'], y + obj[arg.id + '-y']);

                    x += arg.ctx.measureText(letter).width;
                }
                y += lineHeight;
            }
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {}
            json[id + '-size'] = obj[id + '-size'];
            json[id + '-fill'] = obj[id + '-fill'];
            json[id + '-x'] = obj[id + '-x'];
            json[id + '-y'] = obj[id + '-y'];
            return json;
        }
    }

    textbox.hooks.setScale[id] = {
        id: id,
        function: function (obj, arg) {
            obj[id + '-size'] /= arg.scale;
            obj[id + '-x'] /= arg.scale;
            obj[id + '-y'] /= arg.scale;
        }
    }

    function frontend(parent) {
        parent.className = 'grid grid-cols-2 p-2';

        const xDiv = HtmlElementFactory.createDiv();
        const xLabel = HtmlElementFactory.createLabel('x');

        const eventX = (evt)=> {
            textbox[id + '-x'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const xInput = HtmlElementFactory.createInput('number', null, textbox[id + '-x'], eventX.bind(this));

        xDiv.appendChild(xLabel);
        xDiv.appendChild(xInput);
        parent.appendChild(xDiv);

        const sizeDiv = HtmlElementFactory.createDiv();
        const sizeLabel = HtmlElementFactory.createLabel('size');

        const eventSize = (evt)=> {
            textbox[id + '-size'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const sizeInput = HtmlElementFactory.createInput('number', null, textbox[id + '-size'], eventSize.bind(this));

        sizeDiv.appendChild(sizeLabel);
        sizeDiv.appendChild(sizeInput);
        parent.appendChild(sizeDiv);

        const yDiv = HtmlElementFactory.createDiv();
        const yLabel = HtmlElementFactory.createLabel('y');

        const eventY = (evt)=> {
            textbox[id + '-y'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const yInput = HtmlElementFactory.createInput('number', null, textbox[id + '-y'], eventY.bind(this));

        yDiv.appendChild(yLabel);
        yDiv.appendChild(yInput);
        parent.appendChild(yDiv);

        const fillDiv = HtmlElementFactory.createDiv();
        const fillLabel = HtmlElementFactory.createLabel('fill');

        const eventFill = (evt)=> {
            textbox[id + '-fill'] = evt.target.value;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const fillInput = HtmlElementFactory.createInput('color', 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10', textbox[id + '-fill'], eventFill.bind(this));

        fillDiv.appendChild(fillLabel);
        fillDiv.appendChild(fillInput);
        parent.appendChild(fillDiv);
    }

    function _delete() {
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];
        delete textbox[id + '-size'];
        delete textbox[id + '-fill'];
        delete textbox[id + '-x'];
        delete textbox[id + '-y'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('shadow', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'shadow', properties: [id + '-size', id + '-fill']};
    }
}
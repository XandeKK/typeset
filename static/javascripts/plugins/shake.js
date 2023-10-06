function shake(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-two_direction'] = false;
        textbox[id + '-x'] = 0;
        textbox[id + '-y'] = 0;
        textbox[id + '-quatity'] = 1;
        textbox[id + '-intensity'] = 1;
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


                    for (var q = obj[id + '-quatity']; q > 0; q--) {
                        const alpha = q / obj[id + '-quatity'];

                        let _x = x + obj[arg.id + '-x'] * obj[arg.id + '-intensity'] / q;
                        let _y = y + obj[arg.id + '-y'] * obj[arg.id + '-intensity'] / q;
                        arg.ctx.globalAlpha = 0.2 * alpha;

                        arg.ctx.fillText(letter, _x, _y);
                        if (textbox[id + '-two_direction']) {
                            _x = x - obj[arg.id + '-x'] * obj[arg.id + '-intensity'] / q;
                            _y = y - obj[arg.id + '-y'] * obj[arg.id + '-intensity'] / q;

                            arg.ctx.fillText(letter, _x, _y);
                        }
                    }
                    x += arg.ctx.measureText(letter).width;
                }
                y += lineHeight;
            }
            arg.ctx.globalAlpha = 1;
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {}
            json[id + '-two_direction'] = obj[id + '-two_direction'];
            json[id + '-x'] = obj[id + '-x'];
            json[id + '-y'] = obj[id + '-y'];
            json[id + '-quatity'] = obj[id + '-quatity'];
            json[id + '-intensity'] = obj[id + '-quatity'];
            return json;
        }
    }

    function frontend(parent) {
        parent.className = 'p-2 grid grid-cols-2 gap-2';

        const eventTwoDirection = (evt)=> {
            textbox[id + '-two_direction'] = evt.target.checked;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const twoDirectionCheckbox = HtmlElementFactory.createCheckbox(null, null, 'twoDirection', textbox[id + '-two_direction'], eventTwoDirection.bind(this));

        parent.appendChild(twoDirectionCheckbox);

        const xDiv = HtmlElementFactory.createDiv();
        const xLabel = HtmlElementFactory.createLabel('X');

        const eventX = (evt)=> {
            textbox[id + '-x'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const xInput = HtmlElementFactory.createInput('number', null, textbox[id + '-x'], eventX.bind(this));
        xInput.step = '0.1';
        xInput.min = -1;
        xInput.max = 1;

        xDiv.appendChild(xLabel);
        xDiv.appendChild(xInput);
        parent.appendChild(xDiv);

        const quatityDiv = HtmlElementFactory.createDiv();
        const quatityLabel = HtmlElementFactory.createLabel('Quatity');

        const eventquatity = (evt)=> {
            textbox[id + '-quatity'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const quatityInput = HtmlElementFactory.createInput('number', null, textbox[id + '-quatity'], eventquatity.bind(this));

        quatityDiv.appendChild(quatityLabel);
        quatityDiv.appendChild(quatityInput);
        parent.appendChild(quatityDiv);

        const yDiv = HtmlElementFactory.createDiv();
        const yLabel = HtmlElementFactory.createLabel('Y');

        const eventY = (evt)=> {
            textbox[id + '-y'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const yInput = HtmlElementFactory.createInput('number', null, textbox[id + '-y'], eventY.bind(this));
        yInput.step = '0.1';
        yInput.min = -1;
        yInput.max = 1;

        yDiv.appendChild(yLabel);
        yDiv.appendChild(yInput);
        parent.appendChild(yDiv);

        const intensityDiv = HtmlElementFactory.createDiv();
        const intensityLabel = HtmlElementFactory.createLabel('Intensity');

        const eventIntensity = (evt)=> {
            textbox[id + '-intensity'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const intensityInput = HtmlElementFactory.createInput('number', null, textbox[id + '-intensity'], eventIntensity.bind(this));

        intensityDiv.appendChild(intensityLabel);
        intensityDiv.appendChild(intensityInput);
        parent.appendChild(intensityDiv);
    }

    function _delete() {
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];
        delete textbox[id + '-two_direction'];
        delete textbox[id + '-x'];
        delete textbox[id + '-y'];
        delete textbox[id + '-quatity'];
        delete textbox[id + '-intesity'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0]?.includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('shake', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'shake', properties: [id + '-two_direction', id + '-x', id + '-y', id + '-quatity', id + '-intensity']};
    }
}
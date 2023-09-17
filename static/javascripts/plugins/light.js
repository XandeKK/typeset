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

    textbox.cacheProperties.push(
        id + '-geometry',
        id + '-height',
        id + '-direction',
        id + '-width',
        id + '-x',
        id + '-y',
        id + '-radius',
        id + '-fill'
        );

    function frontend(parent) {
        const labelElement = document.createElement('label');
        labelElement.className = 'block mb-1 text-xs font-medium text-gray-900';
        labelElement.textContent = 'Light';

        const lightStatusDiv = document.createElement('div');
        lightStatusDiv.id = 'light_status';
        lightStatusDiv.className = 'flex gap-1 items-center select-none mb-2 justify-between';

        const inputDivs = [];
        const inputLabels = ['circle', 'rect'];

        for (let i = 0; i < inputLabels.length; i++) {
            const inputDiv = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('label');

            inputDiv.className = 'flex';
            input.type = 'radio';
            input.name = id + '-geometry';
            input.id = id + inputLabels[i];
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
            input.value = '';
            input.setAttribute('data', 'text');
            input.setAttribute('value-text', inputLabels[i]);
            input.checked = textbox[id + '-geometry'] == inputLabels[i];

            label.textContent = inputLabels[i];
            label.className = 'ml-1 text-xs font-medium text-gray-900';
            label.htmlFor = id + inputLabels[i];

            inputDiv.appendChild(input);
            inputDiv.appendChild(label);

            inputDivs.push(inputDiv);
        }

        const lightNumberDiv = document.createElement('div');
        lightNumberDiv.id = 'light_number';
        lightNumberDiv.className = 'flex justify-between mb-2';

        const numericInputLabels = ['X', 'Y', 'Width', 'Height', 'Radius'];
        const numericInputIds = [id + '-x', id + '-y', id + '-width', id + '-height', id + '-radius'];
        const numericInputDivs = [];

        for (let i = 0; i < numericInputLabels.length; i++) {
            const inputDiv = document.createElement('div');
            const label = document.createElement('label');
            const input = document.createElement('input');

            label.textContent = numericInputLabels[i];
            label.className = 'block mb-1 text-xs font-medium text-gray-900';
            input.type = 'number';
            input.id = numericInputIds[i];
            input.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10 p-1';
            input.setAttribute('data', 'text');

            inputDiv.appendChild(label);
            inputDiv.appendChild(input);

            numericInputDivs.push(inputDiv);
        }

        const lightDirectionDiv = document.createElement('div');
        lightDirectionDiv.id = 'light_direction';
        lightDirectionDiv.className = 'flex gap-1 items-center select-none mb-2 justify-between';

        const colorInputDiv = document.createElement('div');
        const colorInput = document.createElement('input');

        colorInput.type = 'color';
        colorInput.id = id + '-fill';
        colorInput.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10';
        colorInput.setAttribute('data', 'text');

        colorInputDiv.appendChild(colorInput);

        const radioInputLabels = ['T', 'B', 'L', 'R'];
        const radioInputIds = ['top', 'bottom', 'left', 'right'];
        const radioInputDivs = [];

        for (let i = 0; i < radioInputLabels.length; i++) {
            const inputDiv = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('label');

            input.type = 'radio';
            input.name = id + '-direction';
            input.id = id + radioInputIds[i];
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500';
            input.setAttribute('data', 'text');
            input.setAttribute('value-text', radioInputIds[i]);
            input.checked = textbox[id + '-direction'] == radioInputIds[i];

            label.textContent = radioInputLabels[i];
            label.className = 'ml-1 text-xs font-medium text-gray-900';
            label.htmlFor = radioInputIds[i];

            inputDiv.appendChild(input);
            inputDiv.appendChild(label);

            radioInputDivs.push(inputDiv);
        }

        parent.appendChild(labelElement);
        parent.appendChild(lightStatusDiv);

        inputDivs.forEach((inputDiv) => {
            lightStatusDiv.appendChild(inputDiv);
        });

        parent.appendChild(lightNumberDiv);

        numericInputDivs.forEach((inputDiv) => {
            lightNumberDiv.appendChild(inputDiv);
        });

        parent.appendChild(lightDirectionDiv);

        lightDirectionDiv.appendChild(colorInputDiv);

        radioInputDivs.forEach((inputDiv) => {
            lightDirectionDiv.appendChild(inputDiv);
        });
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

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        let index_cache = textbox.cacheProperties.indexOf(id + '-geometry');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-height');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-direction');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-width');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-x');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-y');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-radius');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        index_cache = textbox.cacheProperties.indexOf(id + '-fill');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('light', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'light', properties: [id + '-geometry', id + '-height', id + '-direction',
            id + '-width', id + '-x', id + '-y', id + '-radius', id + '-fill']};
    }
}
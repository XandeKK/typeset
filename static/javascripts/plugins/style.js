function style(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-styles'] = {};
    }

    textbox.hooks.beforeLetterRender[id] = {
        id: id,
        function: function (obj, arg) {
            for (const indexes in obj[id + '-styles']) {
                const splited = indexes.split('-');
                const start = parseInt(splited[0]);
                const end = parseInt(splited[1]);

                if (arg.index >= start && arg.index < end) {
                    const font = obj['font'];
                    const fontSize = obj['fontSize'];
                    const italic = obj[id + '-styles'][indexes]['italic'] ? 'italic' : '';
                    const bold = obj[id + '-styles'][indexes]['bold'] ? 'bold' : '';

                    arg.ctx.font = `${bold} ${italic} ${fontSize}px ${font}`;
                    arg.ctx.fillStyle = obj[id + '-styles'][indexes]['fill'];
                }
            }
        }
    };

    textbox.hooks.afterLetterRender[id] = {
        id: id,
        function: function (obj, arg) {
            const font = obj['font'];
            const fontSize = obj['fontSize'];
            const italic = obj['italic'] ? 'italic' : '';
            const bold = obj['bold'] ? 'bold' : '';

            arg.ctx.font = `${bold} ${italic} ${fontSize}px ${font}`;
            arg.ctx.fillStyle = obj['fill'];
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {};
            json[id + '-styles'] = obj[id + '-styles'];
            return json;
        }
    };

    function frontend(parent) {
        const styleDiv = HtmlElementFactory.createDiv('.');
        const styleLabel = HtmlElementFactory.createLabel('Text', 'text-xs font-semibold text-gray-700 mb-2');

        const styleInput = HtmlElementFactory.createTextarea(null, textbox['text']);
        styleInput.setAttribute('disabled', '');

        styleDiv.appendChild(styleLabel);
        styleDiv.appendChild(styleInput);
        parent.appendChild(styleDiv);

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded text-xs font-medium mb-1";

        addButton.addEventListener('click', () => {
            const start = styleInput.selectionStart;
            const end = styleInput.selectionEnd;
            const text = styleInput.value.slice(start, end);

            textbox[id + '-styles'][`${start}-${end}`] = {
                fill: textbox['fill'],
                font: textbox['font'],
                bold: textbox['bold'],
                italic: textbox['italic']
            }

            const element = Styles.createStyle(textbox, textbox[id + '-styles'][`${start}-${end}`], id + '-styles', `${start}-${end}`);
            boxList.appendChild(element);
        });

        parent.appendChild(addButton);

        const boxList = document.createElement("ul");
        boxList.className = "bg-white border border-gray-300 rounded p-1 flex flex-col text-xs font-medium";

        for (const index in textbox[id + '-styles']) {
            const object = textbox[id + '-styles'][index];
            const element = Styles.createStyle(textbox, object, id + '-styles', index);
            boxList.appendChild(element);
        };

        parent.appendChild(boxList);
    }

    function _delete() {
        delete textbox.hooks.beforeLetterRender[id];
        delete textbox.hooks.afterLetterRender[id];
        delete textbox.hooks.toObject[id];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0]?.includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('style', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'style', properties: [id + '-styles']};
    }
}

class Styles {
    static createStyle(textbox, object, id, index) {
        const li = document.createElement('li');

        const header = document.createElement('div');
        header.className = 'flex justify-between';
        li.appendChild(header);

        const headerLabel = HtmlElementFactory.createLabel(index);
        header.appendChild(headerLabel);

        const button_remove = document.createElement('button');
        button_remove.textContent = 'X';
        button_remove.className = 'bg-red-500 rounded text-white hover:bg-red-700 px-1 w-10 py-1';
        button_remove.addEventListener('click', (evt)=> {
            li.remove();

            delete textbox[id][index];

            textbox.dirty = true;
            textbox.canvas.renderAll();
        });
        header.appendChild(button_remove);

        const body = document.createElement('div');
        body.className = 'p-1 border-b border-gray-300 mb-1';
        li.appendChild(body);

        const fillDiv = HtmlElementFactory.createDiv();
        const fillLabel = HtmlElementFactory.createLabel('Fill');

        const eventFill = (evt)=> {
            textbox[id][index]['fill'] = evt.target.value;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const fillInput = HtmlElementFactory.createInput('color', 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10', textbox[id][index]['fill'], eventFill.bind(this));

        fillDiv.appendChild(fillLabel);
        fillDiv.appendChild(fillInput);
        body.appendChild(fillDiv);

        const eventBold = (evt)=> {
            textbox[id][index]['bold'] = evt.target.checked;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const boldCheckbox = HtmlElementFactory.createCheckbox(null, null, 'Bold', textbox[id][index]['bold'], eventBold.bind(this));

        body.appendChild(boldCheckbox);

        const eventItalic = (evt)=> {
            textbox[id][index]['italic'] = evt.target.checked;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const italicCheckbox = HtmlElementFactory.createCheckbox(null, null, 'Italic', textbox[id][index]['italic'], eventItalic.bind(this));

        body.appendChild(italicCheckbox);

        return li;
    }
}
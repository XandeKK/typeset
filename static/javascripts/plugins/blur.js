function blur(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
	    textbox[id + '-blur'] = 1;
    }

    textbox.hooks.beforeRender[id] = {
        id: id,
        function: function (obj, arg) {
    	   arg.ctx.filter = `blur(${obj[arg.id + '-blur']}px)`;
        }
    };

    textbox.hooks.afterRender[id] = {
        id: id,
        function: function (obj, arg) {
            arg.ctx.filter = 'blur(0px)';
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {}
            json[id + '-blur'] = obj[id + '-blur'];
            return json;
        }
    }

    textbox.hooks.setScale[id] = {
        id: id,
        function: function (obj, arg) {
            obj[id + '-blur'] /= arg.scale;
        }
    }

    function frontend(parent) {
        const blurDiv = HtmlElementFactory.createDiv();
        const blurLabel = HtmlElementFactory.createLabel('Blur');

        const eventBlur = (evt)=> {
            textbox[id + '-blur'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const blurInput = HtmlElementFactory.createInput('number', null, textbox[id + '-blur'], eventBlur.bind(this));
        blurInput.step = '0.2';

        blurDiv.appendChild(blurLabel);
        blurDiv.appendChild(blurInput);
        parent.appendChild(blurDiv);
    }

    function _delete() {
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.afterRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];
        delete textbox[id + '-blur'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('blur', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'blur', properties: [id + '-blur']};
    }
}
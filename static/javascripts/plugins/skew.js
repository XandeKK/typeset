function skew(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
        textbox[id + '-skewX'] = 0;
	    textbox[id + '-skewY'] = 0;
    }

    textbox.hooks.beforeRender[id] = {
        id: id,
        function: function (obj, arg) {
            obj.set('skewX', obj[arg.id + '-skewX']);
        	obj.set('skewY', obj[arg.id + '-skewY']);
        }
    };

    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {}
            json[arg.id + '-skewX'] = obj[arg.id + '-skewX'];
            json[arg.id + '-skewY'] = obj[arg.id + '-skewY'];
            return json;
        }
    }

    function frontend(parent) {
        const skewXDiv = HtmlElementFactory.createDiv();
        const skewXLabel = HtmlElementFactory.createLabel('SkewX');

        const eventSkewX = (evt)=> {
            textbox[id + '-skewX'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const skewXInput = HtmlElementFactory.createInput('number', null, textbox[id + '-skewX'], eventSkewX.bind(this));

        skewXDiv.appendChild(skewXLabel);
        skewXDiv.appendChild(skewXInput);
        parent.appendChild(skewXDiv);

        const skewYDiv = HtmlElementFactory.createDiv();
        const skewYLabel = HtmlElementFactory.createLabel('SkewY');

        const eventSkewY = (evt)=> {
            textbox[id + '-skewY'] = Number(evt.target.value);
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const skewYInput = HtmlElementFactory.createInput('number', null, textbox[id + '-skewY'], eventSkewY.bind(this));

        skewYDiv.appendChild(skewYLabel);
        skewYDiv.appendChild(skewYInput);
        parent.appendChild(skewYDiv);
    }

    function _delete() {
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox[id + '-skewX'];
        delete textbox[id + '-skewY'];

        textbox.set('skewX', 0);
        textbox.set('skewY', 0);

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('skew', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'skew', properties: [id + '-skewX', id + '-skewY']};
    }
}
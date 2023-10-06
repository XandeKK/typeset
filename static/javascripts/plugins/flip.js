function flip(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
    }

    function frontend(parent) {
        const eventFlipX = (evt)=> {
            textbox['flipX'] = evt.target.checked;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const flipXCheckbox = HtmlElementFactory.createCheckbox(null, null, 'FlipX', textbox['flipX'], eventFlipX.bind(this));

        parent.appendChild(flipXCheckbox);

        const eventFlipY = (evt)=> {
            textbox['flipY'] = evt.target.checked;
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const flipYCheckbox = HtmlElementFactory.createCheckbox(null, null, 'FlipY', textbox['flipY'], eventFlipY.bind(this));

        parent.appendChild(flipYCheckbox);
    }

    function _delete() {
        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0]?.includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox['flipY'] = false;
        textbox['flipX'] = false;

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('flip', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'flip', properties: []};
    }
}
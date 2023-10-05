function opacity(textbox, id=null) {
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4();
    }

    function frontend(parent) {
        const opacityDiv = HtmlElementFactory.createDiv();
        const opacityLabel = HtmlElementFactory.createLabel('Opacity');

        const eventOpacity = (evt)=> {
            textbox.set('opacity', Number(evt.target.value));
            textbox.dirty = true;
            textbox.canvas.renderAll();
        };

        const opacityInput = HtmlElementFactory.createInput('number', null, textbox['opacity'], eventOpacity.bind(this));
        opacityInput.step = '0.1';
        opacityInput.min = 0;
        opacityInput.max= 1;

        opacityDiv.appendChild(opacityLabel);
        opacityDiv.appendChild(opacityInput);
        parent.appendChild(opacityDiv);
    }

    function _delete() {
        textbox.set('opacity', 1);

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('opacity', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'opacity', properties: []};
    }
}
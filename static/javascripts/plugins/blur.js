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

    textbox.cacheProperties.push(
        id + '-blur'
    );

    function frontend(parent) {
        const blur = document.createElement('input');
        blur.type = 'number';
        blur.step = '0.2';
        blur.setAttribute('data', 'text');
        blur.id = id + '-blur';
        blur.value = textbox[id + '-blur'];
        blur.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10 p-1';

        parent.appendChild(blur);
    }

    function _delete() {
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.afterRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];
        delete textbox[id + '-blur'];

        let index_plugin = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        textbox.plugins.splice(index_plugin, index_plugin + 1);

        let index_cache = textbox.cacheProperties.indexOf(id + '-blur');
        textbox.cacheProperties.splice(index_cache, index_cache + 1);
        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    textbox.textCanvas.addPlugin('blur', {id: id, frontend: frontend, delete: _delete});
    if (!loaded) {
        return {id: id, name: 'blur', properties: [id + '-blur']};
    }
}
function blur(textbox) {
	textbox.blur = 1;

    textbox.hooks.beforeRender.push(function (obj, arg) {
    	arg.ctx.filter = `blur(${obj.blur}px)`;
    });

    textbox.hooks.afterRender.push(function (obj, arg) {
    	arg.ctx.filter = 'blur(0px)';
    });

    textbox.cacheProperties.push(
        'blur'
    );
}

if (window.plugins) {
	window.plugins.push(blur);
} else {
	window.plugins = [blur];
}
fabric.CustomTextbox = new fabric.util.createClass(fabric.Object, {
    objectCaching: true,
    maxCacheSideLimit: 8000,
    minCacheSideLimit: 8000,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    type: 'CustomTextbox',
    text: '',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 1,
    fill: '#000000',
    letterSpacing: 0.5,
    textCanvas: null,

    addPlugin: function (plugin, id=null) {
        if (typeof plugin === 'function') {
            const obj = plugin(this, id);
            if (obj) {
                this.plugins.push(obj);
            }
        } else {
            console.error('The provided plugin is not a valid function.');
        }
    },

    executeHooks: function (hookType, arg) {
        const hooks = this.hooks[hookType];
        let returns = [];
        for (const hook_id in hooks) {
            const hook = hooks[hook_id];
            if (typeof hook.function === 'function') {
                returns.push(hook.function(this, {...arg, id: hook.id}));
            }
        }
        return returns;
    },

    initialize: function(options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.textCanvas = options.textCanvas || null;
        this.text = options.text || '';
        this.bold = options.bold ? 'bold' : '';
        this.italic = options.italic ? 'italic' : '';
        this.cacheProperties = [
            'text',
            'fill',
            'font',
            'fontSize',
            'textAlign',
            'marginTop',
            'marginBottom',
            'marginLeft',
            'marginRight',
            'lineHeight',
            'letterSpacing',
            'bold',
            'italic',
        ];

        this.plugins = options.plugins || [];

        this.hooks = options.hooks || {
            beforeRender: {},
            beforeLetterRender: {},
            afterLetterRender: {},
            afterRender: {},
            toObject: {},
            setScale: {},
        };
    },
    _render: function(ctx) {
        ctx.font = `${this.bold ? 'bold' : ''} ${this.italic ? 'italic' : ''} ${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.fill;
        ctx.textBaseline = this.textBaseline;
        ctx.letterSpacing = `${this.letterSpacing}px`;

        const maxWidth = this.width - this.marginLeft - this.marginRight;
        const lines = this.breakTextIntoLines(maxWidth, ctx);

        const textMeasured = ctx.measureText('Á');
        const lineHeight = textMeasured.fontBoundingBoxAscent + textMeasured.fontBoundingBoxDescent + this.lineHeight;
        const totalHeight = lines.length * lineHeight;

        const y1 = -this.height / 2;
        const y2 = this.height / 2;

        let y = y1 + this.marginTop + (y2 - y1 - totalHeight - this.marginTop - this.marginBottom) / 2 + lineHeight;

        this.executeHooks('beforeRender', {ctx});

        let index = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineWidth = ctx.measureText(line).width;

            let x;
            if (this.textAlign == 'left') {
                x = -this.width / 2 + this.marginLeft - this.marginRight;
            } else if (this.textAlign == 'right') {
                x = -lineWidth + this.width / 2 + this.marginLeft - this.marginRight;
            } else {
                x = -lineWidth / 2 + this.marginLeft - this.marginRight;
            }
            for (let j = 0; j < line.length; j++) {
                const letter = line[j];

                this.executeHooks('beforeLetterRender', {ctx, index, letter, x, y});

                ctx.fillText(letter, x, y);

                this.executeHooks('afterLetterRender', {ctx, index, letter, x, y});

                x += ctx.measureText(letter).width;
                index++;
            }
            y += lineHeight;
        }

        this.executeHooks('afterRender', {ctx});

        this.callSuper('_render', ctx);
    },
    breakTextIntoLines: function(maxWidth, ctx) {
        let lines = this.text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let words = lines[i].split(' ');
            let line = '';
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    lines.splice(i, 0, line);
                    i++;
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines[i] = line;
        }
        return lines;
    },
    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            text: this.text,
            font: this.font,
            fontSize: this.fontSize,
            textBaseline: this.textBaseline,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            marginTop: this.marginTop,
            marginBottom: this.marginBottom,
            marginLeft: this.marginLeft,
            marginRight: this.marginRight,
            lineHeight: this.lineHeight,
            letterSpacing: this.letterSpacing,
            bold: this.bold,
            italic: this.italic,
            plugins: this.plugins,
            ...Object.assign({}, ...this.executeHooks('toObject'))
        });
    },
    setScale(scale) {
        this.left /= scale;
        this.top /= scale;
        this.width /= scale;
        this.height /= scale;
        this.fontSize /= scale;
        this.marginTop /= scale;
        this.marginBottom /= scale;
        this.marginLeft /= scale;
        this.marginRight /= scale;
        this.lineHeight /= scale;
        this.letterSpacing /= scale;
        this.executeHooks('setScale', {scale});
    }
});

fabric.CustomTextbox.fromObject = function(object, callback) {
    return fabric.Object._fromObject('CustomTextbox', object, callback);
}

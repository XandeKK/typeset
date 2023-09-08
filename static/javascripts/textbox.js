fabric.CustomTextbox = new fabric.util.createClass(fabric.Object, {
    minCacheSideLimit: 1000,
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    type: 'CustomTextbox',
    text: '',
    styles: [],
    currentIndex: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 1,
    fill: '#000000',
    letterSpacing: 0.5,
    outlineOn: false,
    outlineSize: 3,
    outlineColor: '#ffffff',
    outlineBlurOn: false,
    outlineBlurSize: 3,
    outlineBlurColor: '#ffffff',
    outlineBlurLevel: 5,
    lightOn: false,
    lightGeometry: 'circle',
    lightHeight: 0,
    lightDirection: 'top',
    lightWidth: 0,
    lightX: 0,
    lightY: 0,
    lightRadius: 300,
    lightFill: '#ffffff',

    initialize: function(options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.text = options.text || '';
        this.bold = options.bold ? 'bold' : '';
        this.italic = options.italic ? 'italic' : '';
        this.lightWidth = options.lightWidth ? options.lightWidth : this.width / 2;
        this.lightHeight = options.lightHeight ? options.lightHeight : this.height / 2;
        this.cacheProperties = [
            'text',
            'styles',
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
            'outlineOn',
            'outlineSize',
            'outlineColor',
            'outlineBlurOn',
            'outlineBlurSize',
            'outlineBlurColor',
            'outlineBlurLevel',
            'lightOn',
            'lightGeometry',
            'lightHeight',
            'lightDirection',
            'lightWidth',
            'lightX',
            'lightY',
            'lightRadius',
            'lightFill',
        ]
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
        let y_outline = y;

        // outline
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
                const style = this.styles[this.currentIndex];

                if (style) {
                    ctx.fillStyle = style.fill || this.fill;
                    ctx.font = `${style.bold || this.bold} ${style.italic || this.italic} ${style.fontSize || this.fontSize}px ${style.font || this.font}`;
                }

                if (this.outlineBlurOn) {
                    this.drawOutlineBlur(ctx, letter, x, y_outline);
                }
                if (this.outlineOn) {
                    this.drawOutline(ctx, letter, x, y_outline);
                }

                x += ctx.measureText(letter).width;
                // this.currentIndex++;
            }
            y_outline += lineHeight;
        }

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
                const style = this.styles[this.currentIndex];

                if (style) {
                    ctx.fillStyle = style.fill || this.fill;
                    ctx.font = `${style.bold || this.bold} ${style.italic || this.italic} ${style.fontSize || this.fontSize}px ${style.font || this.font}`;
                }

                if (this.lightOn) {
                    this.draw_light(ctx);
                }
                ctx.fillText(letter, x, y);

                x += ctx.measureText(letter).width;
                this.currentIndex++;
            }
            y += lineHeight;
        }
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
    drawOutline(ctx, letter, x, y) {
        ctx.miterLimit = 2;
        ctx.lineJoin = 'circle';
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = this.outlineSize;
        ctx.strokeText(letter, x, y);
    },
    drawOutlineBlur(ctx, letter, x, y) {
        ctx.miterLimit = 2;
        ctx.lineJoin = 'circle';
        ctx.strokeStyle = this.outlineBlurColor;
        ctx.shadowColor = this.outlineBlurColor;
        ctx.shadowBlur = this.outlineBlurLevel;
        ctx.lineWidth = this.outlineBlurSize;
        ctx.strokeText(letter, x, y);
        ctx.shadowBlur = 0;
    },
    draw_light(ctx) {
        let gradient;
        if (this.lightGeometry === 'rect') {
            const x1 = -this.width / 2;
            const x2 = this.width / 2;
            const y1 = -this.height / 2;
            const y2 = this.height / 2;

            if (this.lightDirection === 'left') {
                gradient = ctx.createLinearGradient(x1, 0, x1 + this.lightWidth, 0);
            } else if (this.lightDirection === 'top') {
                gradient = ctx.createLinearGradient(x1 + this.width / 2, y1, x1 + this.width / 2, y1 + this.lightHeight);
            } else if (this.lightDirection === 'bottom') {
                gradient = ctx.createLinearGradient(x1 + this.width / 2, y2, x1 + this.width / 2, y2 - this.lightHeight);
            } else if (this.lightDirection === 'right') {
                gradient = ctx.createLinearGradient(x2, y1 + this.height / 2, x2 - this.lightWidth, y1 + this.height / 2);
            }
        } else {
            gradient = ctx.createRadialGradient(this.lightX, this.lightY, 0, this.lightX, this.lightY, this.lightRadius);
        }
        gradient.addColorStop(0, this.lightFill);
        gradient.addColorStop(1, this.fill);

        ctx.fillStyle = gradient;
    },
    addStyle: function(style) {
        this.styles.push(style);
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
            styles: this.styles,
            lineHeight: this.lineHeight,
            letterSpacing: this.letterSpacing,
            bold: this.bold,
            italic: this.italic,
            outlineOn: this.outlineOn,
            outlineSize: this.outlineSize,
            outlineColor: this.outlineColor,
            outlineBlurOn: this.outlineBlurOn,
            outlineBlurSize: this.outlineBlurSize,
            outlineBlurColor: this.outlineBlurColor,
            outlineBlurLevel: this.outlineBlurLevel,
            lightOn: this.lightOn,
            lightGeometry: this.lightGeometry,
            lightWidth: this.lightWidth,
            lightHeight: this.lightHeight,
            lightDirection: this.lightDirection,
            lightX: this.lightX,
            lightY: this.lightY,
            lightRadius: this.lightRadius,
            lightFill: this.lightFill,
        });
    },
    setScale(scale) {
        this.left /= scale;
        this.top /= scale;
        this.width /= scale;
        this.height /= scale;
        this.fontSize /= scale;
        this.outlineSize /= scale;
        this.outlineBlurSize /= scale;
        this.lightWidth /= scale;
        this.lightHeight /= scale;
        this.lightX /= scale;
        this.lightY /= scale;
        this.marginTop /= scale;
        this.marginBottom /= scale;
        this.marginLeft /= scale;
        this.marginRight /= scale;
        this.lineHeight /= scale;
        this.letterSpacing /= scale;
    }
});

fabric.CustomTextbox.fromObject = function(object, callback) {
    return fabric.Object._fromObject('CustomTextbox', object, callback);
}
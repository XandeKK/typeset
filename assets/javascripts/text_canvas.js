class TextCanvas {
    constructor(objects) {
        this.text_original = objects.text || '';
        this.font = objects.font || 'CCWildWords-Regular';
        this.font_size = objects.font_size || 28;
        this.bubble = objects.bubble;
        this.rect = this.bubble.rect;
        this.outline = objects.outline || {
            on: false,
            size: 3,
            color: "#ffffff"
        };
        this.outline_blur = objects.outline_blur || {
            on: false,
            size: 3,
            blur_level: 5,
            color: "#ffffff"
        };
        this.bold = objects.bold || false;
        this.italic = objects.italic || false;
        this.color = objects.color || "#000000";
        this.alignment_text = objects.alignment_text || 'center';
        this.letter_spacing = objects.letter_spacing || 0;
        this.degrees = objects.degrees || 0;
        this.line_height = objects.line_height || 0;

        this.margin = objects.margin || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }

        this.light = objects.light || {
            on: false,
            show: false,
            x: this.rect.x1,
            y: this.rect.y1,
            width: 100,
            height: 100,
            radius: 300,
            geometry_type: 'circle',
            color: '#ffffff',
            gradient_direction: 'top'
        }
    }

    draw() {
        this.bubble.canvas.context.font = `${this.get_bold()} ${this.get_italic()} ${this.font_size}px ${this.font}`;

        this.bubble.canvas.context.save();

        this.rotate_text();

        this.bubble.canvas.context.textAlign = this.alignment_text;
        this.bubble.canvas.context.letterSpacing = `${this.letter_spacing}px`;
        
        let maxWidth = this.rect.x2 - this.rect.x1 - this.margin.left - this.margin.right;
        const textMeasured = this.bubble.canvas.context.measureText('Á');
        let lineHeight = textMeasured.fontBoundingBoxAscent + textMeasured.fontBoundingBoxDescent + this.line_height;

        let lines = this.breakTextIntoLines(maxWidth);

        let totalHeight = lines.length * lineHeight;
        let y = this.rect.y1 + this.margin.top + (this.rect.y2 - this.rect.y1 - totalHeight - this.margin.top - this.margin.bottom) / 2 + lineHeight;
        let x = 0;
        if (this.alignment_text == 'left' || this.alignment_text == 'start') {
            x = this.rect.x1 + this.margin.left;
        } else {
            x = this.rect.x1 + this.margin.left + (this.rect.x2 - this.rect.x1 - this.margin.left - this.margin.right) / 2;
        }

        // drawing outline
        let y_outline = y;

        for (let i = 0; i < lines.length; i++) {
            if (this.outline_blur.on) {
                this.draw_outline_blur(lines[i], x, y_outline);
            }
            if (this.outline.on) {
                this.draw_outline(lines[i], x, y_outline);
            }

            y_outline += lineHeight;
        }

        for (let i = 0; i < lines.length; i++) {
            this.draw_text(lines[i], x, y);

            y += lineHeight;
        }

        this.bubble.canvas.context.restore();
    }

    rotate_text() {
        this.bubble.canvas.context.translate(this.rect.x1  + this.bubble.width / 2, this.rect.y1  + this.bubble.height / 2);
        this.bubble.canvas.context.rotate(this.degrees * Math.PI / 180);
        this.bubble.canvas.context.translate(-(this.rect.x1  + this.bubble.width / 2), -(this.rect.y1  + this.bubble.height / 2));   
    }

    breakTextIntoLines(maxWidth) {
        let lines = this.text_original.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let words = lines[i].split(' ');
            let line = '';
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let metrics = this.bubble.canvas.context.measureText(testLine);
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
    }

    draw_outline(line, x, y) {
        this.bubble.canvas.context.miterLimit = 2;
        this.bubble.canvas.context.lineJoin = 'circle';
        this.bubble.canvas.context.strokeStyle = this.outline.color;
        this.bubble.canvas.context.lineWidth = this.outline.size;
        this.bubble.canvas.context.strokeText(line, x, y);
    }

    draw_outline_blur(line, x, y) {
        this.bubble.canvas.context.miterLimit = 2;
        this.bubble.canvas.context.lineJoin = 'circle';
        this.bubble.canvas.context.strokeStyle = this.outline_blur.color;
        this.bubble.canvas.context.shadowColor = this.outline_blur.color;
        this.bubble.canvas.context.shadowBlur = this.outline_blur.blur_level;
        this.bubble.canvas.context.lineWidth = this.outline_blur.size;
        this.bubble.canvas.context.strokeText(line, x, y);
        this.bubble.canvas.context.shadowBlur = 0;
    }

    draw_text(line, x, y) {
        if (this.light.on) {
            this.draw_light();
            this.draw_shape_light();

        } else {
            this.bubble.canvas.context.fillStyle = this.color;
        }
        this.bubble.canvas.context.fillText(line, x, y);
    }

    draw_light() {
        let gradient;
        if (this.light.geometry_type === 'rect') {
            // lembrete para depois, considere o margin também para que muito longe da palavras.
            const width = this.rect.x2 - this.rect.x1;
            const height = this.rect.y2 - this.rect.y1;

            if (this.light.gradient_direction === 'left') {
                gradient = this.bubble.canvas.context.createLinearGradient(this.rect.x1, this.rect.y1 + height / 2, this.rect.x1 + this.light.width, this.rect.y1 + height / 2);
            } else if (this.light.gradient_direction === 'top') {
                gradient = this.bubble.canvas.context.createLinearGradient(this.rect.x1 + width / 2, this.rect.y1, this.rect.x1 + width / 2, this.rect.y1 + this.light.height);
            } else if (this.light.gradient_direction === 'bottom') {
                gradient = this.bubble.canvas.context.createLinearGradient(this.rect.x1 + width / 2, this.rect.y2, this.rect.x1 + width / 2, this.rect.y2 - this.light.height);
            } else if (this.light.gradient_direction === 'right') {
                gradient = this.bubble.canvas.context.createLinearGradient(this.rect.x2, this.rect.y1 + height / 2, this.rect.x2 - this.light.width, this.rect.y1 + height / 2);
            }
        } else {
            gradient = this.bubble.canvas.context.createRadialGradient(this.light.x, this.light.y, 0, this.light.x, this.light.y, this.light.radius);
        }
        gradient.addColorStop(0, this.light.color);
        gradient.addColorStop(1, this.color);

        // Set the fill style to the gradient
        this.bubble.canvas.context.fillStyle = gradient;
    }

    draw_shape_light() {
        if (this.light.show) {
            if (this.light.geometry_type === 'circle') {
                this.bubble.canvas.context.strokeStyle = '#000000';
                this.bubble.canvas.context.beginPath();
                this.bubble.canvas.context.arc(this.light.x, this.light.y, this.light.radius, 0, 2 * Math.PI);
                this.bubble.canvas.context.stroke();
            }
        }
    }


    set_text(text) {
        this.text_original = text;
        this.bubble.canvas.draw();
    }

    set_font(font) {
        if (document.fonts.check(`${this.font_size}px ${font}`)) {
            this.font = font;
            this.bubble.canvas.draw();
            document.getElementById('text_area').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
        }
    }

    set_font_size(font_size) {
        this.font_size = font_size;
        this.bubble.canvas.draw();
    }

    set_auto_hyphenate(auto_hyphenate) {
        this.auto_hyphenate = auto_hyphenate;
        this.set_text(this.text_original);
    }

    set_margin(objects) {
        this.margin = { ...this.margin, ...objects };
        this.bubble.canvas.draw();
    }

    set_outline(name, value) {
        const number = parseInt(value);
        if (isNaN(number)) {
            this.outline[name] = value;
        } else {
            this.outline[name] = number;
        }
        this.bubble.canvas.draw();
    }

    set_outline_blur(name, value) {
        const number = parseInt(value);
        if (isNaN(number)) {
            this.outline_blur[name] = value;
        } else {
            this.outline_blur[name] = number;
        }
        this.bubble.canvas.draw();
    }


    set_bold(on) {
        this.bold = on;
        this.bubble.canvas.draw();
        document.getElementById('text_area').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
    }

    get_bold() {
        if (this.bold) {
            return "bold";
        }
        return "";
    }

    set_italic(on) {
        this.italic = on;
        this.bubble.canvas.draw();
        document.getElementById('text_area').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
    }

    get_italic() {
        if (this.italic) {
            return "italic";
        }
        return "";
    }

    set_color(color) {
        this.color = color;
        this.bubble.canvas.draw();
    }

    set_alignment_text(text) {
        this.alignment_text = text;
        this.bubble.canvas.draw();
    }

    set_letter_spacing(value) {
        this.letter_spacing = parseFloat(value);
        this.bubble.canvas.draw();
    }

    set_degrees(degrees) {
        this.degrees = degrees;
        this.bubble.canvas.draw();
    }

    set_form(form) {
        this.form = form;
        this.bubble.canvas.draw();
    }

    set_line_height(line_height) {
        this.line_height = parseFloat(line_height);
        this.bubble.canvas.draw();
    }

    set_light(name, value) {
        const number = parseInt(value);
        if (isNaN(number)) {
            this.light[name] = value;
        } else {
            this.light[name] = number;
        }
        this.bubble.canvas.draw();
    }

    dup(percent, canvas) {
        const bubble = new BubbleCanvas(this.rect.x1 * percent, this.rect.y1 * percent,
            (this.rect.x2 - this.rect.x1) * percent, (this.rect.y2 - this.rect.y1) * percent, canvas, false);

        return new TextCanvas({
            text: this.text_original,
            font: this.font,
            font_size: this.font_size * percent,
            bubble: bubble,
            outline: { ...this.outline, size: this.outline.size * percent },
            outline_blur: { ...this.outline_blur, blur_level: this.outline_blur.blur_level * percent, size: this.outline_blur.size * percent },
            bold: this.bold,
            italic: this.italic,
            color: this.color,
            alignment_text: this.alignment_text,
            letter_spacing: this.letter_spacing,
            degrees: this.degrees,
            line_height: this.line_height,
            light: this.light,
            margin: {
                top: this.margin.top * percent,
                top: this.margin.top * percent,
                bottom: this.margin.bottom * percent,
                left: this.margin.left * percent,
                right: this.margin.right * percent
            }
        });
    }

    select() {
        this.generate_html();
    }

    deselect() {
        document.getElementById('selected_text').innerHTML = '';
    }

    generate_html() {
        const container = document.getElementById('selected_text');
        container.innerHTML = '';

        const grid1 = document.createElement('div');
        grid1.className = 'flex gap-1 justify-between mb-2';

        const sides = ['top', 'bottom', 'left', 'right'];

        sides.forEach(side => {
            const sideDiv = document.createElement('div');
            sideDiv.className = 'w-8';

            const sideLabel = document.createElement('label');
            sideLabel.className = 'block text-xs font-medium text-gray-700 truncate';
            sideLabel.setAttribute('for', side);
            sideLabel.textContent = side.charAt(0).toUpperCase() + side.slice(1);

            const sideInput = document.createElement('input');
            sideInput.id = side + '_input';
            sideInput.className = 'mt-1 block w-8 rounded-md border-gray-300 shadow-sm py-1 px-1 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-xs';
            sideInput.type = 'number';
            sideInput.value = this.margin[side];

            sideInput.addEventListener('input', (evt) => {
                const objects = {};
                objects[side] = Number(evt.target.value);
                this.set_margin(objects);
            });

            sideDiv.appendChild(sideLabel);
            sideDiv.appendChild(sideInput);
            grid1.appendChild(sideDiv);
        });

        container.appendChild(grid1);

        const fontsDiv = document.createElement('div');
        fontsDiv.className = 'flex gap-1 items-center mb-2 relative';

        const fontsLabel = document.createElement('label');
        fontsLabel.className = 'text-xs font-medium text-gray-700';
        fontsLabel.textContent = 'Fonts';

        const fontsTextInput = document.createElement('input');
        fontsTextInput.id = 'font_text_input';
        fontsTextInput.className = 'w-full text-xs p-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        fontsTextInput.type = 'text';
        fontsTextInput.value = this.font;

        const fontAutocompleteResults = document.createElement('div');
        fontAutocompleteResults.className = 'absolute top-10 left-0 w-full bg-white border rounded shadow-lg z-10 h-32 hidden overflow-auto';

        fontsDiv.appendChild(fontAutocompleteResults);

        fontsTextInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            fontAutocompleteResults.innerHTML = '';

            if (inputValue.length > 0) {
                const values = JSON.parse(localStorage.getItem('fonts'));
                const filteredValues = values.filter(function(value) {
                    return value.toLowerCase().includes(inputValue);
                });

                fontAutocompleteResults.classList.remove('hidden');

                filteredValues.forEach(function(value) {
                    const result = document.createElement('div');
                    result.textContent = value.replace(/\..*/, "");
                    result.classList.add('p-2', 'hover:bg-gray-100', 'cursor-pointer');
                    result.addEventListener('click', function() {
                        fontsTextInput.value = this.textContent;
                        fontAutocompleteResults.innerHTML = '';
                        fontAutocompleteResults.classList.add('hidden');
                        fontsTextInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                    });
                    fontAutocompleteResults.appendChild(result);
                });
            } else {
                fontAutocompleteResults.classList.add('hidden');
            }
        });

        fontsTextInput.addEventListener('keydown', (evt) => {
            if (evt.key == 'Enter') {
                const inputValue = evt.target.value.toLowerCase();
                const values = JSON.parse(localStorage.getItem('fonts'));
                const firstValue = values.filter(function(value) {
                    return value.toLowerCase().includes(inputValue);
                })[0].replace(/\..*/, "");

                this.set_font(firstValue);
                evt.target.value = firstValue;
                fontAutocompleteResults.classList.add('hidden');
            }
        });

        const fontsSizeInput = document.createElement('input');
        fontsSizeInput.className = 'w-8 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500';
        fontsSizeInput.type = 'number';
        fontsSizeInput.id = 'font_size';
        fontsSizeInput.value = this.font_size;

        fontsSizeInput.addEventListener('input', (evt) => {
            this.set_font_size(evt.target.value);
        });

        fontsDiv.appendChild(fontsLabel);
        fontsDiv.appendChild(fontsTextInput);
        fontsDiv.appendChild(fontsSizeInput);

        container.appendChild(fontsDiv);

        const styleDiv = document.createElement('div');
        styleDiv.className = 'flex items-center gap-1 mb-2 relative';

        const colorLabel = document.createElement('label');
        colorLabel.className = 'text-xs font-medium text-gray-900';
        colorLabel.textContent = 'Color';

        const colorTextInput = document.createElement('input');
        colorTextInput.className = 'w-10 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500';
        colorTextInput.type = 'color';
        colorTextInput.value = this.color;

        colorTextInput.addEventListener('input', (evt) => {
            this.set_color(evt.target.value);
        });

        const boldDiv = document.createElement('div');
        boldDiv.className = 'flex items-center gap-1';

        const boldLabel = document.createElement('label');
        boldLabel.className = 'text-xs font-medium text-gray-900';
        boldLabel.setAttribute('for', 'bold');
        boldLabel.textContent = 'Bold';

        const boldInput = document.createElement('input');
        boldInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        boldInput.type = 'checkbox';
        boldInput.id = 'bold';
        boldInput.checked = this.bold;

        boldInput.addEventListener('input', (evt) => {
            this.set_bold(evt.target.checked);
        });

        boldDiv.appendChild(boldLabel);
        boldDiv.appendChild(boldInput);

        const italicDiv = document.createElement('div');
        italicDiv.className = 'flex items-center gap-1';

        const italicLabel = document.createElement('label');
        italicLabel.className = 'text-xs font-medium text-gray-900';
        italicLabel.setAttribute('for', 'italic');
        italicLabel.textContent = 'Italic';

        const italicInput = document.createElement('input');
        italicInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        italicInput.type = 'checkbox';
        italicInput.id = 'italic';
        italicInput.checked = this.italic;

        italicInput.addEventListener('input', (evt) => {
            this.set_italic(evt.target.checked);
        });

        italicDiv.appendChild(italicLabel);
        italicDiv.appendChild(italicInput);

        styleDiv.appendChild(colorLabel);
        styleDiv.appendChild(colorTextInput);
        styleDiv.appendChild(boldDiv);
        styleDiv.appendChild(italicDiv);

        container.appendChild(styleDiv);

        const outlineDiv = document.createElement('div');
        outlineDiv.className = 'flex items-center mb-2 gap-1';

        const outlineLabel = document.createElement('label');
        outlineLabel.className = 'text-xs font-medium text-gray-900';
        outlineLabel.setAttribute('for', 'outline-text');
        outlineLabel.textContent = 'Outline';

        const outlineColorInput = document.createElement('input');
        outlineColorInput.className = 'w-10';
        outlineColorInput.type = 'color';
        outlineColorInput.value = this.outline.color;

        outlineColorInput.addEventListener('input', (evt) => {
            this.set_outline('color', evt.target.value);
        });

        const outlineSizeInput = document.createElement('input');
        outlineSizeInput.className = 'text-xs w-8 p-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        outlineSizeInput.type = 'number';
        outlineSizeInput.value = this.outline.size;

        outlineSizeInput.addEventListener('input', (evt) => {
            this.set_outline('size', evt.target.value);
        });

        const outlineCheckbox = document.createElement('input');
        outlineCheckbox.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        outlineCheckbox.type = 'checkbox';
        outlineCheckbox.id = 'outline_checkbox';
        outlineCheckbox.value = this.outline.on;

        outlineCheckbox.addEventListener('input', (evt) => {
            this.set_outline('on', evt.target.checked);
        });

        outlineDiv.appendChild(outlineLabel);
        outlineDiv.appendChild(outlineColorInput);
        outlineDiv.appendChild(outlineSizeInput);
        outlineDiv.appendChild(outlineCheckbox);

        container.appendChild(outlineDiv);

        const outlineBlurDiv = document.createElement('div');
        outlineBlurDiv.className = 'flex items-center mb-2 gap-1';

        const outlineBlurLabel = document.createElement('label');
        outlineBlurLabel.className = 'text-xs font-medium text-gray-900';
        outlineBlurLabel.setAttribute('for', 'outline-blur-text');
        outlineBlurLabel.textContent = 'Outline Blur';

        const outlineBlurColorInput = document.createElement('input');
        outlineBlurColorInput.className = 'w-10';
        outlineBlurColorInput.type = 'color';
        outlineBlurColorInput.value = this.outline_blur.color;

        outlineBlurColorInput.addEventListener('input', (evt) => {
            this.set_outline_blur('color', evt.target.value);
        });

        const outlineBlurSizeInput = document.createElement('input');
        outlineBlurSizeInput.className = 'text-xs w-8 p-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        outlineBlurSizeInput.type = 'number';
        outlineBlurSizeInput.value = this.outline_blur.size;

        outlineBlurSizeInput.addEventListener('input', (evt) => {
            this.set_outline_blur('size', evt.target.value);
        });

        const outlineBlurLevelInput = document.createElement('input');
        outlineBlurLevelInput.className = 'text-xs w-8 p-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        outlineBlurLevelInput.type = 'number';
        outlineBlurLevelInput.value = this.outline_blur.blur_level;

        outlineBlurLevelInput.addEventListener('input', (evt) => {
            this.set_outline_blur('blur_level', evt.target.value);
        });

        const outlineBlurCheckbox = document.createElement('input');
        outlineBlurCheckbox.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        outlineBlurCheckbox.type = 'checkbox';
        outlineBlurCheckbox.id = 'outlineBlur_checkbox';
        outlineBlurCheckbox.value = this.outline_blur.on;

        outlineBlurCheckbox.addEventListener('input', (evt) => {
            this.set_outline_blur('on', evt.target.checked);
        });

        outlineBlurDiv.appendChild(outlineBlurLabel);
        outlineBlurDiv.appendChild(outlineBlurColorInput);
        outlineBlurDiv.appendChild(outlineBlurSizeInput);
        outlineBlurDiv.appendChild(outlineBlurLevelInput);
        outlineBlurDiv.appendChild(outlineBlurCheckbox);

        container.appendChild(outlineBlurDiv);

        const alignment_div = document.createElement('div');
        alignment_div.className = 'flex gap-1 mb-2';

        const leftDiv = document.createElement('div');
        leftDiv.className = 'flex items-center gap-1';

        const leftLabel = document.createElement('label');
        leftLabel.className = 'text-xs font-medium text-gray-900';
        leftLabel.setAttribute('for', 'left');
        leftLabel.textContent = 'left';

        const leftInput = document.createElement('input');
        leftInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        leftInput.type = 'radio';
        leftInput.id = 'left_alignment';
        leftInput.name = 'align';
        leftInput.checked = this.alignment_text == 'left' || this.alignment_text == 'start';

        leftInput.addEventListener('input', (evt) => {
            this.set_alignment_text('left');
        });

        leftDiv.appendChild(leftLabel);
        leftDiv.appendChild(leftInput);

        const centerDiv = document.createElement('div');
        centerDiv.className = 'flex items-center gap-1';

        const centerLabel = document.createElement('label');
        centerLabel.className = 'text-xs font-medium text-gray-900';
        centerLabel.setAttribute('for', 'center');
        centerLabel.textContent = 'center';

        const centerInput = document.createElement('input');
        centerInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
        centerInput.type = 'radio';
        centerInput.id = 'center_alignment';
        centerInput.name = 'align';
        centerInput.checked = this.alignment_text == 'center';

        centerInput.addEventListener('input', (evt) => {
            this.set_alignment_text('center');
        });

        centerDiv.appendChild(centerLabel);
        centerDiv.appendChild(centerInput);

        alignment_div.appendChild(leftDiv);
        alignment_div.appendChild(centerDiv);

        container.appendChild(alignment_div);

        const letterSpacingDiv = document.createElement('div');
        letterSpacingDiv.className = 'flex items-center mb-2 gap-1';

        const letterSpacingLabel = document.createElement('label');
        letterSpacingLabel.className = 'text-xs font-medium text-gray-900';
        letterSpacingLabel.setAttribute('for', 'letter-spacing-text');
        letterSpacingLabel.textContent = 'Letter Spacing';

        const letterSpacingInput = document.createElement('input');
        letterSpacingInput.className = 'w-8 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        letterSpacingInput.type = 'number';
        letterSpacingInput.setAttribute('step', '0.1');
        letterSpacingInput.value = this.letter_spacing;

        letterSpacingDiv.appendChild(letterSpacingLabel);
        letterSpacingDiv.appendChild(letterSpacingInput);

        container.appendChild(letterSpacingDiv);

        letterSpacingInput.addEventListener('input', (evt) => {
            this.set_letter_spacing(evt.target.value);
        });

        const degreesDiv = document.createElement('div');
        degreesDiv.className = 'flex items-center mb-2 gap-1';

        const degreesLabel = document.createElement('label');
        degreesLabel.className = 'text-xs font-medium text-gray-900';
        degreesLabel.setAttribute('for', 'degrees');
        degreesLabel.textContent = 'Degrees';

        const degreesInput = document.createElement('input');
        degreesInput.className = 'w-8 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        degreesInput.type = 'number';
        degreesInput.value = this.degrees;

        degreesInput.addEventListener('input', (evt) => {
            this.set_degrees(evt.target.value);
        });

        degreesDiv.appendChild(degreesLabel);
        degreesDiv.appendChild(degreesInput);

        const lineHeightLabel = document.createElement('label');
        lineHeightLabel.className = 'text-xs font-medium text-gray-900';
        lineHeightLabel.setAttribute('for', 'lineHeight');
        lineHeightLabel.textContent = 'line Height';

        const lineHeightInput = document.createElement('input');
        lineHeightInput.className = 'w-8 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
        lineHeightInput.type = 'number';
        lineHeightInput.setAttribute('step', '0.5');
        lineHeightInput.value = this.line_height;

        lineHeightInput.addEventListener('input', (evt) => {
            this.set_line_height(evt.target.value);
        });

        degreesDiv.appendChild(lineHeightLabel);
        degreesDiv.appendChild(lineHeightInput);

        container.appendChild(degreesDiv);

        const light_div = document.createElement('div');
        light_div.className = 'mb-2';

        const button_light = document.createElement('button');
        button_light.className = 'flex items-center text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-2 py-1 text-center mr-2 mb-2';
        button_light.id = 'dropdown_light';
        button_light.type = 'button';
        button_light.innerHTML = `Light<svg class="w-2 h-2 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg></button>`

        light_div.appendChild(button_light);

        const dropdown_light = document.createElement('div');
        dropdown_light.className = 'z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80 px-5 py-1';
        dropdown_light.id = 'dropdown_menu';

        const dropdown = new Dropdown(dropdown_light, button_light, {
            placement: 'right',
            onShow: () => {
                setTimeout(()=> {dropdown_light.style.position = 'fixed'}, 10)
            },
        });

        const dropdown_content = document.createElement('div');
        dropdown_content.className = 'grid gap-2 grid-cols-2 select-none pt-2';

        dropdown_light.appendChild(dropdown_content);

        const show_and_enable_light = ['on', 'show'];

        show_and_enable_light.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2 mb-2';

            const label = document.createElement('label');
            label.className = 'text-sm font-medium text-gray-900';
            label.textContent = item;
            label.for = item;

            const input = document.createElement('input');
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
            input.id = item;
            input.type = 'checkbox';
            input.checked = this.light[item];

            input.addEventListener('input', (evt) => {
                this.set_light(evt.target.id, evt.target.checked);
            });

            div.appendChild(input);
            div.appendChild(label);

            dropdown_content.appendChild(div);
        });

        const content_range = [
            {
                name: 'x',
                value: this.light.x,
            },
            {
                name: 'y',
                value: this.light.y,
            },
            {
                name: 'width',
                value: this.light.width,
            },
            {
                name: 'height',
                value: this.light.height,
            },
            {
                name: 'radius',
                value: this.light.radius,
            }
        ]

        const light_number_div = document.createElement('div');
        light_number_div.className = 'flex col-span-2 justify-between';

        dropdown_content.appendChild(light_number_div);

        content_range.forEach((content) => {
            const div = document.createElement('div');

            const label = document.createElement('label');
            label.className = 'block mb-2 text-sm font-medium text-gray-900';
            label.textContent = content.name;
            label.for = content.name;

            const input = document.createElement('input');
            input.className = 'w-8 p-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500';
            input.id = content.name;
            input.type = 'number';
            input.value = content.value;

            input.addEventListener('input', (evt) => {
                this.set_light(evt.target.id, evt.target.value);
            });

            div.appendChild(label);
            div.appendChild(input);

            light_number_div.appendChild(div);
        });

        const geometry_type = document.createElement('div');

        const label_geometry_type = document.createElement('label');
        label_geometry_type.className = 'block mb-2 text-sm font-medium text-gray-900';
        label_geometry_type.textContent = 'Geometry Type:';

        const geometry_type_radio_div = document.createElement('div');
        geometry_type_radio_div.className = 'flex gap-2';

        const geometries = ['circle', 'rect'];

        geometries.forEach((geometry) => {
            const div = document.createElement('div');
            div.className = 'flex items-center mb-4';
            
            const input = document.createElement('input');
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500';
            input.id = geometry;
            input.type = 'radio';
            input.value = geometry;
            input.name = 'geometry_type';
            input.checked = this.light.geometry_type == geometry;

            input.addEventListener('input', (evt) => {
                this.set_light('geometry_type', evt.target.value);
            });

            const label = document.createElement('label');
            label.className = 'ml-2 text-sm font-medium text-gray-900';
            label.for = geometry;
            label.textContent = geometry;

            div.appendChild(input);
            div.appendChild(label);

            geometry_type_radio_div.appendChild(div);
        })

        geometry_type.appendChild(label_geometry_type);
        geometry_type.appendChild(geometry_type_radio_div);
        dropdown_content.appendChild(geometry_type);
        
        const div_color_light = document.createElement('div');
        dropdown_content.appendChild(div_color_light);

        const label_color_light = document.createElement('label');
        label_color_light.className = 'block mb-2 text-sm font-medium text-gray-900';
        label_color_light.textContent = 'Color:';
        label_color_light.for = 'color_light';

        const input_color_light = document.createElement('input');
        input_color_light.className = 'w-full text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500';
        input_color_light.id = 'color_light';
        input_color_light.type = 'color';
        input_color_light.value = this.light.color;

        input_color_light.addEventListener('input', (evt) => {
            this.set_light('color', evt.target.value);
        });

        div_color_light.appendChild(label_color_light);
        div_color_light.appendChild(input_color_light);

        const gradient_direction = document.createElement('div');
        gradient_direction.className = 'col-span-2';

        dropdown_content.appendChild(gradient_direction);

        const label_gradient_direction = document.createElement('label');
        label_gradient_direction.className = 'block mb-2 text-sm font-medium text-gray-900';
        label_gradient_direction.textContent = 'Gradient Direction:';

        gradient_direction.appendChild(label_gradient_direction);

        const gradient_direction_div = document.createElement('div');
        gradient_direction_div.className = 'grid grid-cols-2 gap-2';

        gradient_direction.appendChild(gradient_direction_div);

        const gradient_direction_sides = ['left', 'top', 'right', 'bottom'];

        gradient_direction_sides.forEach((side) => {
            const div = document.createElement('div');
            div.className = 'flex items-center mb-4';

            const input = document.createElement('input');
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500';
            input.id = side;
            input.type = 'radio';
            input.value = side;
            input.name = 'gradient_direction';
            input.checked = this.light.gradient_direction == side;

            input.addEventListener('input', (evt) => {
                this.set_light('gradient_direction', evt.target.value);
            });

            const label = document.createElement('label');
            label.className = 'ml-2 text-sm font-medium text-gray-900';
            label.for = side;
            label.textContent = side;

            div.appendChild(input);
            div.appendChild(label);

            gradient_direction_div.appendChild(div);
        });

        container.appendChild(light_div);
        container.appendChild(dropdown_light);

        const textareaDiv = document.createElement('div');
        textareaDiv.className = 'mb-2';

        const text_area = document.createElement('textarea');
        text_area.id = 'text_area';
        text_area.value = this.text_original;
        text_area.setAttribute('rows', '4');
        text_area.setAttribute('placeholder', 'Type here');
        text_area.style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
        text_area.className = 'border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 w-full';

        text_area.addEventListener('keyup', (evt) => {
            this.set_text(evt.target.value);
        });

        textareaDiv.appendChild(text_area);

        container.appendChild(textareaDiv);
    }
}

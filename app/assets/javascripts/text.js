class TextBubble {
    constructor(objects) {
        this.text_original = objects.text || '';
        this.font = objects.font || 'WildWordsRoman';
        this.font_size = objects.font_size || 28;
        this.bubble = objects.bubble;
        this.rect = this.bubble.rect;
        this.outline = objects.outline || {
            on: false,
            size: 3,
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
    }

    draw() {
        this.bubble.canvas.context.font = `${this.get_bold()} ${this.get_italic()} ${this.font_size}px ${this.font}`;

        this.bubble.canvas.context.save();

        this.rotateText();

        this.bubble.canvas.context.textAlign = this.alignment_text;
        this.bubble.canvas.context.letterSpacing = `${this.letter_spacing}px`;
        
        let maxWidth = this.rect.x2 - this.rect.x1 - this.margin.left - this.margin.right;
        const textMeasured = this.bubble.canvas.context.measureText('M');
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

        for (let i = 0; i < lines.length; i++) {
            if (this.outline.on) { // add outline
                this.drawOutline(lines[i], x, y);
            }
            
            this.drawText(lines[i], x, y);

            y += lineHeight;
        }

        this.bubble.canvas.context.restore();
    }

    rotateText() {
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

    drawOutline(line, x, y) {
        this.bubble.canvas.context.miterLimit = 2;
        this.bubble.canvas.context.lineJoin = 'circle';
        this.bubble.canvas.context.strokeStyle = this.outline.color;
        this.bubble.canvas.context.lineWidth = this.outline.size;
        this.bubble.canvas.context.strokeText(line, x, y);
    }

    drawText(line, x, y) {
        this.bubble.canvas.context.fillStyle = this.color;
        this.bubble.canvas.context.fillText(line, x, y);
    }

    set_text(text) {
        this.text_original = text;
        this.bubble.canvas.draw();
    }

    set_font(font) {
        if (document.fonts.check(`${this.font_size}px ${font}`)) {
            this.font = font;
            this.bubble.canvas.draw();
            document.getElementById('textareaInput').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
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

    set_color_outline(color) {
        this.outline.color = color;
        this.bubble.canvas.draw();
    }

    set_outline(on) {
        this.outline.on = on;
        this.bubble.canvas.draw();
    }

    set_size_outline(size) {
        this.outline.size = size;
        this.bubble.canvas.draw();
    }

    set_bold(on) {
        this.bold = on;
        this.bubble.canvas.draw();
        document.getElementById('textareaInput').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
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
        document.getElementById('textareaInput').style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
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

    dup(percent, canvas) {
        const bubble = new Bubble(this.rect.x1 * percent, this.rect.y1 * percent,
            (this.rect.x2 - this.rect.x1) * percent, (this.rect.y2 - this.rect.y1) * percent, canvas, false);

        return new TextBubble({
            text: this.text_original,
            font: this.font,
            font_size: this.font_size * percent,
            bubble: bubble,
            outline: { ...this.outline, size: this.outline.size * percent },
            bold: this.bold,
            italic: this.italic,
            color: this.color,
            alignment_text: this.alignment_text,
            letter_spacing: this.letter_spacing,
            degrees: this.degrees,
            line_height: this.line_height,
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
        document.getElementById('selected_bubble').innerHTML = '';
    }

    generate_html() {
        const container = document.getElementById('selected_bubble');
        container.innerHTML = '';

        const grid1 = document.createElement('div');
        grid1.className = 'grid grid-cols-4 gap-4 mb-2';

        const sides = ['top', 'bottom', 'left', 'right'];

        sides.forEach(side => {
            const sideDiv = document.createElement('div');

            const sideLabel = document.createElement('label');
            sideLabel.className = 'text-sm font-medium text-gray-900 dark:text-white';
            sideLabel.setAttribute('for', side);
            sideLabel.textContent = side.charAt(0).toUpperCase() + side.slice(1);

            const sideInput = document.createElement('input');
            sideInput.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
            sideInput.type = 'number';
            sideInput.value = this.margin[side];


            sideInput.addEventListener('change', (evt) => {
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
        fontsDiv.className = 'flex items-center mb-2 relative';

        const fontsLabel = document.createElement('label');
        fontsLabel.className = 'mr-2 text-sm font-medium text-gray-900 dark:text-white';
        fontsLabel.textContent = 'Fonts';

        const fontsTextInput = document.createElement('input');
        fontsTextInput.className = 'w-full p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
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
        fontsSizeInput.className = 'w-10 p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        fontsSizeInput.type = 'number';
        fontsSizeInput.id = 'fonts-size';
        fontsSizeInput.value = this.font_size;

        fontsSizeInput.addEventListener('change', (evt) => {
            this.set_font_size(evt.target.value);
        });

        fontsDiv.appendChild(fontsLabel);
        fontsDiv.appendChild(fontsTextInput);
        fontsDiv.appendChild(fontsSizeInput);

        container.appendChild(fontsDiv);

        const colorDiv = document.createElement('div');
        colorDiv.className = 'flex items-center mb-2 relative';

        const colorLabel = document.createElement('label');
        colorLabel.className = 'mr-2 text-sm font-medium text-gray-900 dark:text-white';
        colorLabel.textContent = 'Color';

        const colorTextInput = document.createElement('input');
        colorTextInput.className = 'w-full ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        colorTextInput.type = 'color';
        colorTextInput.value = this.color;

        colorTextInput.addEventListener('change', (evt) => {
            this.set_color(evt.target.value);
        });

        colorDiv.appendChild(colorLabel);
        colorDiv.appendChild(colorTextInput);

        container.appendChild(colorDiv);

        const outlineDiv = document.createElement('div');
        outlineDiv.className = 'flex items-center mb-2';

        const outlineLabel = document.createElement('label');
        outlineLabel.className = 'mr-2 text-sm font-medium text-gray-900 dark:text-white';
        outlineLabel.setAttribute('for', 'outline-text');
        outlineLabel.textContent = 'Outline';

        const outlineColorInput = document.createElement('input');
        outlineColorInput.className = 'w-12 h-6 rounded-full';
        outlineColorInput.type = 'color';
        outlineColorInput.value = this.outline.color;

        outlineColorInput.addEventListener('change', (evt) => {
            this.set_color_outline(evt.target.value);
        });

        const outlineSizeInput = document.createElement('input');
        outlineSizeInput.className = 'w-14 p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        outlineSizeInput.type = 'number';
        outlineSizeInput.value = this.outline.size;

        outlineSizeInput.addEventListener('change', (evt) => {
            this.set_size_outline(evt.target.value);
        });

        const outlineCheckbox = document.createElement('input');
        outlineCheckbox.className = 'w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        outlineCheckbox.type = 'checkbox';
        outlineCheckbox.value = this.outline.on;

        outlineCheckbox.addEventListener('change', (evt) => {
            this.set_outline(evt.target.checked);
        });

        outlineDiv.appendChild(outlineLabel);
        outlineDiv.appendChild(outlineColorInput);
        outlineDiv.appendChild(outlineSizeInput);
        outlineDiv.appendChild(outlineCheckbox);

        container.appendChild(outlineDiv);

        const grid2 = document.createElement('div');
        grid2.className = 'flex gap-4 mb-2';

        const boldDiv = document.createElement('div');

        const boldLabel = document.createElement('label');
        boldLabel.className = 'text-sm font-medium text-gray-900 dark:text-white mr-2';
        boldLabel.setAttribute('for', 'bold');
        boldLabel.textContent = 'Bold';

        const boldInput = document.createElement('input');
        boldInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        boldInput.type = 'checkbox';
        boldInput.id = 'bold';
        boldInput.checked = this.bold;

        boldInput.addEventListener('change', (evt) => {
            this.set_bold(evt.target.checked);
        });

        boldDiv.appendChild(boldLabel);
        boldDiv.appendChild(boldInput);

        const italicDiv = document.createElement('div');

        const italicLabel = document.createElement('label');
        italicLabel.className = 'text-sm font-medium text-gray-900 dark:text-white mr-2';
        italicLabel.setAttribute('for', 'italic');
        italicLabel.textContent = 'Italic';

        const italicInput = document.createElement('input');
        italicInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        italicInput.type = 'checkbox';
        italicInput.id = 'italic';
        italicInput.checked = this.italic;

        italicInput.addEventListener('change', (evt) => {
            this.set_italic(evt.target.checked);
        });

        italicDiv.appendChild(italicLabel);
        italicDiv.appendChild(italicInput);

        grid2.appendChild(boldDiv);
        grid2.appendChild(italicDiv);

        container.appendChild(grid2);

        const grid3 = document.createElement('div');
        grid3.className = 'flex gap-4 mb-2';

        const leftDiv = document.createElement('div');

        const leftLabel = document.createElement('label');
        leftLabel.className = 'text-sm font-medium text-gray-900 dark:text-white mr-2';
        leftLabel.setAttribute('for', 'left');
        leftLabel.textContent = 'left';

        const leftInput = document.createElement('input');
        leftInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        leftInput.type = 'radio';
        leftInput.id = 'left';
        leftInput.name = 'align';
        leftInput.checked = this.alignment_text == 'left' || this.alignment_text == 'start';

        leftInput.addEventListener('change', (evt) => {
            this.set_alignment_text('left');
        });

        leftDiv.appendChild(leftLabel);
        leftDiv.appendChild(leftInput);

        const centerDiv = document.createElement('div');

        const centerLabel = document.createElement('label');
        centerLabel.className = 'text-sm font-medium text-gray-900 dark:text-white mr-2';
        centerLabel.setAttribute('for', 'center');
        centerLabel.textContent = 'center';

        const centerInput = document.createElement('input');
        centerInput.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
        centerInput.type = 'radio';
        centerInput.id = 'center';
        centerInput.name = 'align';
        centerInput.checked = this.alignment_text == 'center';

        centerInput.addEventListener('change', (evt) => {
            this.set_alignment_text('center');
        });

        centerDiv.appendChild(centerLabel);
        centerDiv.appendChild(centerInput);

        grid3.appendChild(leftDiv);
        grid3.appendChild(centerDiv);

        container.appendChild(grid3);

        const letterSpacingDiv = document.createElement('div');
        letterSpacingDiv.className = 'flex items-center mb-2';

        const letterSpacingLabel = document.createElement('label');
        letterSpacingLabel.className = 'mr-2 text-sm font-medium text-gray-900 dark:text-white';
        letterSpacingLabel.setAttribute('for', 'letter-spacing-text');
        letterSpacingLabel.textContent = 'Letter Spacing';

        const letterSpacingInput = document.createElement('input');
        letterSpacingInput.className = 'w-14 p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        letterSpacingInput.type = 'number';
        letterSpacingInput.setAttribute('step', '0.1');
        letterSpacingInput.value = this.letter_spacing;

        letterSpacingDiv.appendChild(letterSpacingLabel);
        letterSpacingDiv.appendChild(letterSpacingInput);

        container.appendChild(letterSpacingDiv);

        letterSpacingInput.addEventListener('change', (evt) => {
            this.set_letter_spacing(evt.target.value);
        });

        const degreesDiv = document.createElement('div');
        degreesDiv.className = 'flex items-center mb-2';

        const degreesLabel = document.createElement('label');
        degreesLabel.className = 'mr-2 text-sm font-medium text-gray-900 dark:text-white';
        degreesLabel.setAttribute('for', 'degrees');
        degreesLabel.textContent = 'Degrees';

        const degreesInput = document.createElement('input');
        degreesInput.className = 'w-14 p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        degreesInput.type = 'number';
        degreesInput.value = this.degrees;

        degreesInput.addEventListener('change', (evt) => {
            this.set_degrees(evt.target.value);
        });

        degreesDiv.appendChild(degreesLabel);
        degreesDiv.appendChild(degreesInput);

        const lineHeightLabel = document.createElement('label');
        lineHeightLabel.className = 'ml-2 mr-2 text-sm font-medium text-gray-900 dark:text-white';
        lineHeightLabel.setAttribute('for', 'lineHeight');
        lineHeightLabel.textContent = 'line Height';

        const lineHeightInput = document.createElement('input');
        lineHeightInput.className = 'w-14 p-1.5 ml-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
        lineHeightInput.type = 'number';
        lineHeightInput.setAttribute('step', '0.5');
        lineHeightInput.value = this.line_height;

        lineHeightInput.addEventListener('change', (evt) => {
            this.set_line_height(evt.target.value);
        });

        degreesDiv.appendChild(lineHeightLabel);
        degreesDiv.appendChild(lineHeightInput);

        container.appendChild(degreesDiv);

        const textareaDiv = document.createElement('div');
        textareaDiv.className = 'mb-2';

        const textareaLabel = document.createElement('label');
        textareaLabel.setAttribute('for', 'text');
        textareaLabel.className = 'block mb-2 text-sm font-medium text-gray-900 pt-2';
        textareaLabel.textContent = 'Text';

        const textareaInput = document.createElement('textarea');
        textareaInput.value = this.text_original;
        textareaInput.setAttribute('rows', '4');
        textareaInput.setAttribute('placeholder', 'Type here');
        textareaInput.setAttribute('id', 'textareaInput');
        textareaInput.style.font = `${this.get_bold()} ${this.get_italic()} 15px ${this.font}`;
        textareaInput.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 w-full';

        textareaInput.addEventListener('keyup', (evt) => {
            this.set_text(evt.target.value);
        });

        textareaDiv.appendChild(textareaLabel);
        textareaDiv.appendChild(textareaInput);

        container.appendChild(textareaDiv);
    }
}
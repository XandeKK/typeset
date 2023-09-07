class Fonts {
    constructor() {
        this.font_input = document.getElementById('font_input');
        this.font_body = document.getElementById('font_body');
        this.font_help_text = document.getElementById('font_help_text');
        this.font_previous = document.getElementById('font_previous');
        this.font_next = document.getElementById('font_next');

        this.results;
        this.paginate = 0;
        this.max_items = 24;

        this.init_storage();
        this.get_fonts();
        this.events();
        this.frontend_input();
    }

    init_storage() {
        if (!localStorage.getItem("fonts")) {
            this.set_local_storage('fonts', []);
        }
    }

    get_fonts() {
        fetch('/fonts')
        .then(response => response.json())
        .then(data => {
            this.fonts = [];
            const fonts = this.get_local_storage('fonts');

            for (const font in data) {
                const font_index = this.get_index(fonts, font, 'name');
                const surname = font_index != -1 ? fonts[font_index].surname : '';

                this.fonts.push({name: font, surname: surname, url: data[font]});
            }

            this.results = this.fonts;
            this.frontend();
            this.init_install_fonts();
        });
    }

    events() {
        this.font_input.addEventListener('input', (evt) => {
            this.paginate = 0;
            this.results = this.filter(this.fonts, 'name', this.font_input.value);
            this.frontend();
        });

        this.font_previous.addEventListener('click', (evt) => {
            if (this.paginate <= 0) {
                if (this.results.length >= this.max_items)
                    this.paginate = this.results.length / this.max_items - 1;
            } else {
                this.paginate--;
            }

            this.frontend();
        });

        this.font_next.addEventListener('click', (evt) => {
            if (this.paginate >= this.results.length / this.max_items - 1) {
                this.paginate = 0;
            } else {
                this.paginate++;
            }

            this.frontend();
        });
    }

    init_install_fonts() {
        this.get_local_storage('fonts').forEach((font) => {
            var font_face = new FontFace(font.name.replace(/.(otf|ttf)$/, ''), 'url(' + font.url + ')');

            font_face.load().then(function(font_f) {
                document.fonts.add(font_f);
            });
        })
    }

    filter(obj, key, search_item) {
        return obj.filter(k => k[key].toLowerCase().includes(search_item.toLowerCase()));
    }

    get_index(obj, search_item, key) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i][key] === search_item) {
                return i;
            }
        }
        return -1;
    }

    get_local_storage(name) {
        return JSON.parse(localStorage.getItem(name));
    }

    set_local_storage(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    frontend_input() {
        const fonts_text_input = document.getElementById('font');
        const font_autocomplete_results = document.getElementById('font_autocomplete_results');

        fonts_text_input.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            font_autocomplete_results.innerHTML = '';

            if (inputValue.length > 0) {
                const values = JSON.parse(localStorage.getItem('fonts'));
                const filteredValues = values.filter(function(value) {
                    return value.name.toLowerCase().includes(inputValue) || value.surname?.toLowerCase().includes(inputValue);
                });

                font_autocomplete_results.classList.remove('hidden');

                filteredValues.forEach(function(value) {
                    const result = document.createElement('div');
                    result.textContent = value.name.replace(/\..*/, "");
                    result.classList.add('p-2', 'hover:bg-gray-100', 'cursor-pointer');
                    result.addEventListener('click', function() {
                        fonts_text_input.value = this.textContent;
                        font_autocomplete_results.innerHTML = '';
                        font_autocomplete_results.classList.add('hidden');
                        fonts_text_input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                    });
                    font_autocomplete_results.appendChild(result);
                });
            } else {
                font_autocomplete_results.classList.add('hidden');
            }
        });

        fonts_text_input.addEventListener('keydown', (evt) => {
            if (evt.key == 'Enter') {
                const inputValue = evt.target.value.toLowerCase();
                const values = JSON.parse(localStorage.getItem('fonts'));
                const firstValue = values.filter(function(value) {
                    return value.name.toLowerCase().includes(inputValue) || value.surname?.toLowerCase().includes(inputValue);
                })[0].name.replace(/\..*/, "");

                if (firstValue) {
                    evt.target.value = firstValue;
                    evt.target.dispatchEvent(new CustomEvent("set_font"));
                }
                font_autocomplete_results.classList.add('hidden');
            }
        });
    }

    frontend() {
        this.font_body.innerHTML = '';
        const fonts = this.get_local_storage('fonts');

        for (var i = this.max_items * this.paginate; i < this.max_items * (this.paginate + 1); i++) {
            const font = this.results[i];
            if (!font) { break; }

            const li = document.createElement('li');

            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';

            const input = document.createElement('input');
            input.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500';
            input.id = font.name;
            input.type = 'checkbox';
            input.name = 'font';
            input.checked = this.get_index(fonts, font.name, 'name') != -1;
            input.setAttribute('url', font.url)

            input.addEventListener('change', (evt) => {
                if (evt.target.checked) {
                    fonts.push(
                        {
                            name: evt.target.id,
                            surname: document.getElementById('surname-' + evt.target.id),
                            url: evt.target.getAttribute('url')
                        }
                    );
                    this.set_local_storage('fonts', fonts);

                    var font_face = new FontFace(evt.target.id.replace(/.(otf|ttf)$/, ''), 'url(' + evt.target.getAttribute('url') + ')');

                    font_face.load().then(function(font) {
                        document.fonts.add(font);
                    });
                } else {
                    const index = this.get_index(fonts, evt.target.id, 'name');
                    fonts.splice(index, 1);
                    this.set_local_storage('fonts', fonts);
                }
            });

            const label = document.createElement('label');
            label.className = 'ml-2 text-sm font-medium text-gray-90 break-all';
            label.htmlFor = font.name;
            label.textContent = font.name.replace(/.(otf|ttf)$/, '');

            const surname = document.createElement('input');
            surname.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1';
            surname.type = 'text';
            surname.value = font.surname;
            surname.setAttribute('font', font.name)

            surname.addEventListener('input', (evt)=> {
                const index = this.get_index(fonts, evt.target.getAttribute('font'), 'name');
                fonts[index].surname = evt.target.value;
                this.set_local_storage('fonts', fonts);
            });

            div.appendChild(input);
            div.appendChild(label);

            li.appendChild(div);
            li.appendChild(surname);

            this.font_body.appendChild(li);
        }

        font_help_text.innerHTML = `Showing <span class="font-semibold text-gray-900">${this.paginate == 0 ? 1 : this.max_items * this.paginate}</span> to <span class="font-semibold text-gray-900">${this.results.length < this.max_items * (this.paginate + 1) ? this.results.length : this.max_items * (this.paginate + 1)}</span> of <span class="font-semibold text-gray-900">${this.results.length}</span> Entries`
    }
}

const fonts = new Fonts();
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

        if (!localStorage.getItem("fonts")) {
            this.set_font_set(new Set());
        }

        fetch('/fonts')
            .then(response => response.json())
            .then(data => {
                this.fonts = data;
                this.results = Object.keys(this.fonts);
                this.create_list();
                this.install_fonts();
            });

        this.font_input.addEventListener('keyup', (evt) => {
            this.paginate = 0;
            this.results = this.findByKey(this.fonts, this.font_input.value);
            this.create_list();
        });

        this.font_previous.addEventListener('click', (evt) => {
            if (this.paginate <= 0) {
                if (this.results.length >= this.max_items)
                    this.paginate = this.results.length / this.max_items - 1;
            } else {
                this.paginate--;
            }

            this.create_list();
        });

        this.font_next.addEventListener('click', (evt) => {
            if (this.paginate >= this.results.length / this.max_items - 1) {
                this.paginate = 0;
            } else {
                this.paginate++;
            }

            this.create_list();
        });
    }

    install_fonts() {
        this.get_font_set().forEach((font) => {
            var font_face = new FontFace(font.replace(/\..*/, ""), 'url(' + this.fonts[font] + ')');

            font_face.load().then(function(font_f) {
                document.fonts.add(font_f);
            });
        })
    }

    findByKey(obj, key) {
        return Object.keys(obj).filter(k => k.toLowerCase().includes(key.toLowerCase()));
    }

    searchValue(obj, searchTerm) {
        for (const key in obj) {
            if (key.includes(searchTerm)) {
                return obj[key];
            }
        }
    }

    searchKey(data, searchTerm) {
        for (const key in data) {
            if (key.includes(searchTerm)) {
                return key;
            }
        }
    }


    get_font_set() {
        return new Set(JSON.parse(localStorage.getItem('fonts')));
    }

    set_font_set(font_set) {
        localStorage.setItem('fonts', JSON.stringify([...font_set]));
    }

    create_list() {
        this.font_body.innerHTML = '';
        const font_set = this.get_font_set();
        for (var i = this.max_items * this.paginate; i < this.max_items * (this.paginate + 1); i++) {
            if (!this.results[i]) { break; }

            const li = document.createElement('li');
            li.className = 'flex items-center gap-2';

            const input = document.createElement('input');
            input.id = this.results[i];
            input.type = 'checkbox';
            input.checked = font_set.has(this.results[i]);
            input.addEventListener('change', (evt) => {
                if (evt.target.checked) {
                    font_set.add(evt.target.id);
                    this.set_font_set(font_set);

                    var font_face = new FontFace(evt.target.id.replace(/\..*/, ""), 'url(' + this.fonts[evt.target.id] + ')');

                    font_face.load().then(function(font) {
                        document.fonts.add(font);
                    });

                } else {
                    font_set.delete(evt.target.id);
                    this.set_font_set(font_set);
                }
            });

            const label = document.createElement('label');
            label.className = 'break-all';
            label.setAttribute('for', this.results[i]);
            label.textContent = this.results[i].replace(/\..*/, "");

            li.appendChild(input);
            li.appendChild(label);
            this.font_body.appendChild(li);
        }

        font_help_text.innerHTML = `Showing <span class="font-semibold text-gray-900">${this.paginate == 0 ? 1 : this.max_items * this.paginate}</span> to <span class="font-semibold text-gray-900">${this.results.length < this.max_items * (this.paginate + 1) ? this.results.length : this.max_items * (this.paginate + 1)}</span> of <span class="font-semibold text-gray-900">${this.results.length}</span> Entries`

    }
}

const fonts = new Fonts();
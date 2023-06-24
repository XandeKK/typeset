class Texts {
    constructor() {
        this.current_line = 0;
        this.texts = [];

        this.add_event();
    }

    add_event() {
        document.getElementById('textsInput').addEventListener('keyup', (evt) => {
            this.set_texts(evt.target.value);
        });
    }

    set_texts(text) {
        this.texts = text.split("\n").filter(line => line.trim() !== '');
        this.generate_html();
    }

    generate_html() {
        const ul = document.getElementById('texts');
        ul.innerHTML = '';

        for (var i = 0; i < this.texts.length; i++) {
            const li = document.createElement('li');
            li.className = 'flex gap-2 p-1 border-b hover:text-gray-700 hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-500';
            li.setAttribute('index', i);
            li.addEventListener('click', (evt) => {
                document.getElementById('textareaInput').value = this.texts[parseInt(li.getAttribute('index'))];
                document.getElementById('textareaInput').dispatchEvent(new Event("keyup"));
            });

            const span = document.createElement('span');
            span.className = 'w-6';
            span.textContent = `${i + 1}-`;

            const p = document.createElement('p');
            p.className = 'text-ellipsis truncate';
            p.textContent = this.texts[i];

            li.appendChild(span);
            li.appendChild(p);
            ul.appendChild(li);
        }
    }
}

new Texts();
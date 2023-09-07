class ListText {
    constructor(canvas) {
        this.current_line = 0;
        this.texts = [];
        this.canvas = canvas;

        this.events();
    }

    events() {
        document.addEventListener('keydown', (evt)=> {
            if (evt.target !== document.body) return; // this is a crude solution, but the only one I can think of
            if (this.canvas.getActiveObject() && evt.key == 'Enter') {
                if (this.current_line >= this.texts.length) return;

                const before_line = document.querySelector(`li[index="${this.current_line}"]`);
                const text = document.getElementById('text');
                before_line.classList.remove('bg-blue-100');

                text.value = this.texts[this.current_line];
                text.dispatchEvent(new Event("input"));
                this.current_line++;
                if (this.current_line < this.texts.length) {
                    while (this.texts[this.current_line].startsWith('##')) {
                        if (this.current_line >= this.texts.length) break;
                        this.current_line++;
                    }
                } else {
                    this.current_line = this.texts.length - 1;
                }

                const after_line = document.querySelector(`li[index="${this.current_line}"]`);
                after_line.classList.add('bg-blue-100');
                document.getElementById('texts').scroll({
                    top: after_line.offsetTop - document.getElementById('texts').offsetTop,
                    behavior: "smooth",
                })
            } else if (this.canvas.getActiveObject() && evt.key.startsWith('000')) {
                const before_line = document.querySelector(`li[index="${this.current_line}"]`);
                const text = document.getElementById('text');
                before_line.classList.remove('bg-blue-100');

                this.current_line = parseInt(evt.key);

                const after_line = document.querySelector(`li[index="${this.current_line}"]`);
                after_line.classList.add('bg-blue-100');
                document.getElementById('texts').scroll({
                    top: after_line.offsetTop - document.getElementById('texts').offsetTop,
                    behavior: "smooth",
                })
            }
        });
    }

    set_texts(text) {
        this.texts = text.split("\n").filter(line => line.trim() !== '');
        this.current_line = 0;
        this.frontend();
    }

    frontend() {
        const ul = document.getElementById('texts');
        ul.innerHTML = '';

        for (var i = 0; i < this.texts.length; i++) {
            const li = document.createElement('li');
            li.className = 'flex gap-2 p-1 border-b hover:text-gray-700 hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-500';
            if (i === 0) {
                li.classList.add('bg-blue-100');
            }
            li.setAttribute('index', i);
            li.addEventListener('click', (evt) => {
                const id = parseInt(li.getAttribute('index'));
                document.getElementById('text').value = this.texts[id];
                document.getElementById('text').dispatchEvent(new Event("input"));
                document.dispatchEvent(new KeyboardEvent("keydown", { key: `000${id}`, current_line: id }));
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
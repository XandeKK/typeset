class Group {
	constructor(bubble, text, canvas) {
		this.bubble = bubble;
		this.text = text;
		this.rect = bubble.rect;
		this.textbox = text.text;
		this.canvas = canvas;

		this.canvas.add(this.rect);
		this.canvas.add(this.textbox);

		this.visible = true;

		this.events();
		this.frontend();
	}

	events() {
		this.textbox.on('mouseover', ()=> {
			if (this.canvas.getActiveObject() === this.textbox || !this.visible) return;
			this.rect.set({stroke: '#b6002a'});
			this.canvas.renderAll();
		});

		this.textbox.on('mouseout', ()=> {
			if (this.canvas.getActiveObject() === this.textbox || !this.visible) return;
			this.rect.set({stroke: '#333333'});
			this.canvas.renderAll();
		});

		this.textbox.on('toggle', (data)=> {
			this.visible = data.bool;
			if (this.visible) {
				if (this.canvas.getActiveObject() === this.textbox) return;
				this.rect.set({stroke: '#333333'});
			} else {
				this.rect.set({stroke: '#00000000'});
			}
			this.canvas.renderAll();
		});

		this.textbox.on('selected', ()=> {
			this.rect.set({stroke: '#ff033e'});
			this.text.select();

			this.elem.classList.remove('bg-white');
			this.elem.classList.add('bg-blue-300');
		});

		this.textbox.on('deselected', ()=> {
			this.rect.set({stroke: '#333333'});
			this.text.deselect();

			this.elem.classList.remove('bg-blue-300');
			this.elem.classList.add('bg-white');
		});

		this.textbox.on('delete', ()=> {
			this.canvas.remove(this.textbox);
			this.canvas.remove(this.rect);
			this.elem.remove();
		})
	}

	frontend() {
		const parent = document.getElementById('layers');

		this.elem = document.createElement('li');
		this.elem.className = 'flex gap-1 p-1 border-b border-zinc-300 items-center bg-white hover:bg-zinc-300 cursor-pointer';

		this.elem.addEventListener('mouseover', ()=> {
			this.textbox.fire('mouseover');
		});

		this.elem.addEventListener('mouseout', ()=> {
			this.textbox.fire('mouseout');
		});

		this.elem.addEventListener('click', (evt)=> {
			this.canvas.setActiveObject(this.textbox);
			this.canvas.renderAll();
		});

		const button_delete = document.createElement('button');
		button_delete.className = 'text-pink-500 hover:text-red-300';
		button_delete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

		button_delete.addEventListener('click', (evt)=> {
			evt.stopPropagation();
			this.textbox.fire('delete');
		});

		const p = document.createElement('p');
		p.className = 'truncate text-ellipsis';
		p.textContent = 'layer';

		this.elem.appendChild(button_delete);
		this.elem.appendChild(p);

		parent.appendChild(this.elem);
	}
}
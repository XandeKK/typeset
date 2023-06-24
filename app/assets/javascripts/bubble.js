class Bubble {
	constructor(x, y, width, height, canvas, show=true) {
		this.rect = {
			x1: x,
			x2: x + width,
			y1: y,
			y2: y + height
		}

		this.width = width;
		this.height = height;
		this.over = false;
		this.canvas = canvas;
		this.show = show;
	}

	draw() {
		if (!this.show) return;

		this.over = this.mouse_is_within();
		if (this.canvas.selected === this) {
			this.canvas.context.strokeStyle = "#ff033e";
		}else if (this.over) {
			this.canvas.context.strokeStyle = "#b6002a";
		}else {
			this.canvas.context.strokeStyle = "#333333";
		}
		this.canvas.context.lineWidth = 1;
		this.canvas.context.strokeRect(this.rect.x1, this.rect.y1, this.width, this.height);
	}

	mouse_is_within() {
		return (this.canvas.mousePos.x >= this.rect.x1 && this.canvas.mousePos.x <= this.rect.x1 + this.width &&
			this.canvas.mousePos.y >= this.rect.y1 && this.canvas.mousePos.y <= this.rect.y1 + this.height)
	}

	set_object_text(text) {
		this.text = text;
	}

	select() {
		this.generate_html();
		if (this.text) {
			this.text.select();
		}
	}

	deselect() {
		document.getElementById('selected_bubble_canvas').innerHTML = '';

		if (this.text) {
			this.text.deselect();
		}
	}

	dup(percent, canvas) {
		return new Bubble(this.rect.x1 * percent, this.rect.y1 * percent,
			(this.rect.x2 - this.rect.x1) * percent, (this.rect.y2 - this.rect.y1) * percent, canvas, false);
	}

	generate_html() {
		const parent = document.getElementById('selected_bubble_canvas');
		parent.innerHTML = '';

		const div_options = document.createElement('div');
		div_options.className = 'flex p-2 justify-end';

		const button_delete = document.createElement('button');
		button_delete.textContent = 'remove';
		button_delete.className = 'border focus:ring-2 focus:outline-none rounded-full text-sm p-2.5 text-center inline-flex items-center border-red-500 text-red-500 hover:text-white focus:ring-red-600 hover:bg-red-500';
		button_delete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>';
		button_delete.addEventListener('click', ()=> {
			this.canvas.delete_object(this.text);
			this.canvas.delete_object(this);
		});

		div_options.appendChild(button_delete);
		
		parent.appendChild(div_options);
	}
}
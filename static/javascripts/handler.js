class Handler {
	constructor() {
		this.canvas = new Canvas();
		this.fabric = this.canvas.fabric;
		this.socket = new Socket([
			{name: 'boxs', callback: this.get_work.bind(this)},
			{name: 'load', callback: this.load.bind(this)},
			], this.load_text.bind(this));
		this.current_index_image = 0;
		this.images = [];
		this.list_text = new ListText(this.fabric);
		window.can_pass = true;

		this.events();
	}

	events() {
		document.getElementById('previous').addEventListener('click', this.previous.bind(this));
		document.getElementById('next').addEventListener('click', this.next.bind(this));
		document.getElementById('switch_img').addEventListener('click', this.switch_img);
	}

	switch_img() {
		const raw = document.getElementById('raw');
		const canvas = document.querySelector('.canvas-container');

		if (raw.classList.contains('hidden')) {
			raw.classList.remove('hidden');
			canvas.classList.add('hidden');
		} else {
			raw.classList.add('hidden');
			canvas.classList.remove('hidden');
		}
	}

	load_text(path) {
		fetch(`file?path=${path}/Tradução`)
		.then(response => response.text())
		.then(data => {
			this.list_text.set_texts(data);
		});
	}

	scroll_to_top() {
		setTimeout(()=> {
			document.getElementById('body_canvas').scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
		}, 500);
	}

	set_mode_button(id, visible) {
		const element = document.getElementById(id);
		if (visible) {
			element.classList.remove('bg-purple-300', 'cursor-not-allowed');
			element.classList.add('bg-purple-700', 'hover:bg-purple-800', 'cursor-pointer');
			element.disabled = false;
		} else {
			element.classList.remove('bg-purple-700', 'hover:bg-purple-800', 'cursor-pointer');
			element.classList.add('bg-purple-300', 'cursor-not-allowed');
			element.disabled = true;
		}
	}

	previous() {
		if (!window.can_pass) return;
		window.can_pass = false;
		this.scroll_to_top();
		this.current_index_image--;

		if (this.current_index_image < 0) {
			this.current_index_image++;
			return;
		} else if (this.current_index_image == 0) {
			this.set_mode_button('previous', false);
		}

		if (this.current_index_image < this.images.length) {
			this.set_mode_button('next', true);
		}

		this.images[this.current_index_image + 1].obj = JSON.stringify(this.fabric)
		this.set_objects(this.images[this.current_index_image]);
	}

	next() {
		if (!window.can_pass) return;
		window.can_pass = false;
		this.scroll_to_top();
		this.current_index_image++;

		if (this.current_index_image > this.images.length) {
			this.current_index_image--;
			return;
		} else if (this.current_index_image == this.images.length - 1) {
			this.set_mode_button('next', false);
		}

		if (this.current_index_image > 0) {
			this.set_mode_button('previous', true);
		}

		this.images[this.current_index_image - 1].obj = JSON.stringify(this.fabric)
		this.set_objects(this.images[this.current_index_image]);
	}

	get_work(msg) {
		const filename = msg.filename.replace(/raw\//, 'cleaned/');
		const img = new Image();
		img.onload = ()=> {
			this.images.push({
				img: img,
				boxs: msg.boxs,
				obj: null
			});
			this.trigger_image();
		}
		img.src = 'file?path='+ filename;
	}

	load(msg) {
		const parsed = JSON.parse(msg.objects);
		const filename = parsed.backgroundImage.src.replace(/.*path=/, '')
		const img = new Image();
		img.onload = ()=> {
			this.images.push({
				img: img,
				boxs: null,
				obj: msg.objects
			});
			this.trigger_image();
		}
		img.src = 'file?path='+ filename;
	}

	trigger_image() {
		if (this.images.length == 1) {
			this.set_objects(this.images[0]);
		}

		if (this.images.length - 2 == this.current_index_image) {
			this.set_mode_button('next', true);
		}
	}

	set_background_image(data, callback) {
		const percent = this.fabric.width / data.img.width;
		const img = new fabric.Image(data.img, {
			scaleX: percent,
			scaleY: percent,
		});
    	this.fabric.setHeight(data.img.height * percent);
	   	this.fabric.setBackgroundImage(img, this.fabric.renderAll.bind(this.fabric));
	   	callback();
	   	const raw_image = document.getElementById('raw');
	   	raw_image.src = data.img.src.replace('cleaned', 'raw');
	   	raw_image.width = this.fabric.width;
	   	raw_image.height = this.fabric.height;
	}

	clear() {
		document.getElementById('layers').innerHTML = '';
		this.fabric.clear();
	}

	set_objects(data) {
		this.clear();
		if (data.obj) {
			this.canvas.load(data.obj);
		} else if (data.boxs) {
			this.set_background_image(data, ()=> {
				data.boxs.forEach((box) => {
					const bubble = new BubbleCanvas(this.fabric, {
						left: box.x1 * this.fabric.backgroundImage.get('scaleX'),
						top: box.y1 * this.fabric.backgroundImage.get('scaleX'),
						width: (box.x2 - box.x1) * this.fabric.backgroundImage.get('scaleX'),
						height: (box.y2 - box.y1) * this.fabric.backgroundImage.get('scaleX')
					});
					const text = new TextCanvas(this.fabric, {
						text: "",
						textAlign: 'center',
						fontSize: window.type_style === 'manga' ? 18 : 25,
						font: window.type_style === 'manga' ? 'CCWildWords-Regular' : 'CCMightyMouth-Regular',
						left: box.x1 * this.fabric.backgroundImage.get('scaleX'),
						top: box.y1 * this.fabric.backgroundImage.get('scaleX'),
						width: (box.x2 - box.x1) * this.fabric.backgroundImage.get('scaleX'),
						height: (box.y2 - box.y1) * this.fabric.backgroundImage.get('scaleX')
					})
					new Group(bubble, text, this.fabric);
				});
				window.can_pass = true;
			});
		}
	}
}

const handler = new Handler();
class Canvas {
	constructor() {
		let body_canvas = document.getElementById('body_canvas');
		fabric.Object.NUM_FRACTION_DIGITS = 10;
		this.fabric = new fabric.Canvas('canvas', {
			width: body_canvas.clientWidth - 15,
			height: body_canvas.clientHeight,
			selection: false,
			skipTargetFind: false,
		});
		this.can_download = true;

		new DrawBubble(this.fabric);
		this.events();
	}

	events() {
		document.getElementById('visible_box').addEventListener('change', (evt)=> {
			this.fabric.getObjects().forEach((object)=> {
				if (object.type === 'CustomTextbox') {
					object.fire('toggle', {bool: evt.target.checked});
				}
			});
		});

		document.getElementById('download').addEventListener('click', this.download.bind(this));
	}

	download() {
		if (!this.can_download) return;
		this.can_download = false;
		const img = this.fabric.overlayImage;
		const scale = img.scaleX;

		const originalObjects = this.fabric.getObjects();
		const clonedCanvas = new fabric.Canvas();

		const download = (clonedCanvas)=> {
			const dataURL = clonedCanvas.toDataURL();
			const json = JSON.stringify(this.fabric);

			let path = img.getSrc().replace(/.*path=/, '');
			path = path.split('/');
			const filename = path.pop();
			path.pop();
			path = path.join('/');

			const formData = new FormData();
			formData.append('image', this.dataURLtoBlob(dataURL), filename);
			formData.append('json_data', json);
			formData.append('path', path);

			fetch('/upload_image', {
				method: 'POST',
				body: formData
			})
			.then(response => response.text())
			.then(result => {Alert.alert(result, 'success'); this.can_download = true;})
			.catch(error => {Alert.alert(error, 'danger'); this.can_download = true;});
		}

		img.clone((_img)=> {
			_img.set({scaleX: 1, scaleY: 1});
			clonedCanvas.set({
				width: _img.width,
				height: _img.height,
			})
			clonedCanvas.overlayImage = _img;

			const length = originalObjects.length;

			if (length === 0) download(clonedCanvas);

			for (var i = 0; i < length; i++) {
				const obj = originalObjects[i];
				obj.clone((clone_obj)=> {
					if (clone_obj.type == 'CustomTextbox') {
						clone_obj.textCanvas = {addPlugin: ()=>{}};
						clone_obj.plugins.forEach(plugin=> {
			                clone_obj.addPlugin(window[plugin.name], plugin.id);
			            });
						clone_obj.setScale(scale);
						clonedCanvas.add(clone_obj);
					}
					if (i === length - 1) {
						download(clonedCanvas);
					}
				});
			}
		});
	}

	dataURLtoBlob(dataURL) {
		const parts = dataURL.split(';base64,');
		const contentType = parts[0].split(':')[1];
		const raw = window.atob(parts[1]);
		const rawLength = raw.length;
		const uInt8Array = new Uint8Array(rawLength);
		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		return new Blob([uInt8Array], {type: contentType});
	}

	load(json) {
		const img = JSON.parse(json).overlayImage;
		this.fabric.setHeight(img.height * img.scaleX);
		this.fabric.loadFromJSON(json, ()=> {this.fabric.renderAll.bind(this.fabric); window.can_pass = true;}, (o, object)=> {
			if (object.type === 'rect') {
				const bubble = new BubbleCanvas(this.fabric, {}, object);
				this.bubble = bubble;
			} else if (object.type === 'CustomTextbox') {
				const text = new TextCanvas(this.fabric, {}, object);
				new Group(this.bubble, text, this.fabric);
				this.rect = undefined;
			}
		});

		const raw_image = document.getElementById('raw');
		raw_image.src = img.src.replace('cleaned', 'raw');
		raw_image.width = this.fabric.width;
		raw_image.height = this.fabric.height;
	}
}

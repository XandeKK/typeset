class Canvas {
	constructor() {
		let body_canvas = document.getElementById('body_canvas');
		this.fabric = new fabric.Canvas('canvas', {
			width: body_canvas.clientWidth - 15,
			height: body_canvas.clientHeight,
			selection: false,
			skipTargetFind: false,
		});

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
		const scale = this.fabric.backgroundImage.scaleX;

		this.fabric.clone((canvas)=> {
			const img = canvas.get('backgroundImage');
			canvas.setWidth(img.width);
			canvas.setHeight(img.height);

			img.set({scaleX: 1, scaleY: 1});

			const objects = canvas.getObjects();
			objects.forEach((obj)=> {
				if (obj.type === 'rect') {
					canvas.remove(obj);
				} else {
					obj.setScale(scale);
				}
			});

		  	canvas.renderAll();

			const dataURL = canvas.toDataURL();
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
			.then(result => Alert.alert(result, 'success'))
			.catch(error => Alert.alert(error, 'danger'));
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
		const img = JSON.parse(json).backgroundImage;
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
	}
}

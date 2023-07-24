class ImageHandler {
	constructor(canvas_handler) {
		this.canvas_handler = canvas_handler;
		
	}

	async upload_image() {
		const filename = this.canvas_handler.images[this.canvas_handler.current_index_image].path_with_filename;
		if (filename === undefined || filename === null) {
			Alert.alert("you can't save without image", 'warning');
			return;
		}

		this.canvas_handler.canvas.canvas_element.toBlob(blob => {
		  const file = new File([blob], filename, {type: 'image/png'});
		  const formData = new FormData();
		  formData.append('image', file);
		  formData.append('filename', filename);

		  fetch('/upload', {
		    method: 'POST',
		    body: formData
		  })
		  .then(response => Alert.alert('ok'))
		  .catch(error => Alert.alert(`error: ${error}`));
		});
	}
}

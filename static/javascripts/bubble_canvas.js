class BubbleCanvas {
	constructor(canvas, options, object=null) {
		this.canvas = canvas;
		if (object) {
			object.set('selectable', false);
			this.rect = object;
		} else {
			this.rect = new fabric.Rect({
				selectable: false,
				left: options.left,
				top: options.top,
			    width: options.width,
			    height: options.height,
			    fill: 'transparent',
			    stroke: '#333333',
			    strokeWidth: 1
			});
		}
	}
}

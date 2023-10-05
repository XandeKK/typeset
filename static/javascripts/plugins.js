class Plugins {
	constructor(fabric) {
		this.fabric = fabric;

		this.install_plugins();
	}

	install_plugins() {
		const parent = document.getElementById('plugins');
		fetch('/plugins')
		.then(response => response.json())
		.then(data => {
			data.forEach(filename => {
				const scriptElement = document.createElement('script');
				scriptElement.src = '/static/javascripts/plugins/' + filename;

				document.body.appendChild(scriptElement);

				const elem = document.createElement('li');
				elem.className = 'flex gap-1 p-1 border-b border-zinc-300 items-center bg-white justify-between';
				
				const button_add = document.createElement('button');
				button_add.className = 'bg-green-500 rounded text-white hover:bg-green-700 px-2';
				button_add.textContent = '+';
				button_add.setAttribute('plugin', filename.replace('.js', ''));

				button_add.addEventListener('click', (evt)=> {
					const object = this.fabric.getActiveObject();
					if (!object) return;
					const plugin = evt.target.getAttribute('plugin');

					object.addPlugin(window[plugin]);
				});

				const p = document.createElement('p');
				p.className = 'truncate text-ellipsis';
				p.textContent = filename.replace('.js', '');

				elem.appendChild(p);
				elem.appendChild(button_add);

				parent.appendChild(elem);
			});
		});
	}
}

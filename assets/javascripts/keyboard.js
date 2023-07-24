// Margin
// bottom
hotkeys('ctrl+up', function(event, handler) {
	const element = document.getElementById('top_input');
	element.value = Number(element.value) - 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

hotkeys('shift+up', function(event, handler) {
	const element = document.getElementById('bottom_input');
	element.value = Number(element.value) + 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// top
hotkeys('ctrl+down', function(event, handler) {
	const element = document.getElementById('bottom_input');
	element.value = Number(element.value) - 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

hotkeys('shift+down', function(event, handler) {
	const element = document.getElementById('top_input');
	element.value = Number(element.value) + 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// right
hotkeys('ctrl+left', function(event, handler) {
	const element = document.getElementById('left_input');
	element.value = Number(element.value) - 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

hotkeys('shift+left', function(event, handler) {
	const element = document.getElementById('right_input');
	element.value = Number(element.value) + 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// left
hotkeys('ctrl+right', function(event, handler) {
	const element = document.getElementById('right_input');
	element.value = Number(element.value) - 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

hotkeys('shift+right', function(event, handler) {
	const element = document.getElementById('left_input');
	element.value = Number(element.value) + 1;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// Font size
hotkeys('s+f', function(event, handler) {
	const element = document.getElementById('font_size');
	element.focus();
    event.preventDefault();
});

// Fonts Text
hotkeys('f', function(event, handler) {
	const element = document.getElementById('font_text_input');
	element.focus();
    event.preventDefault();
});

// bold
hotkeys('b', function(event, handler) {
	const element = document.getElementById('bold');
	element.checked = !element.checked;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// italic
hotkeys('i', function(event, handler) {
	const element = document.getElementById('italic');
	element.checked = !element.checked;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// outline
hotkeys('o', function(event, handler) {
	const element = document.getElementById('outline_checkbox');
	element.checked = !element.checked;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// left alignment
hotkeys('l', function(event, handler) {
	const element = document.getElementById('left_alignment');
	element.checked = true;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// center alignment
hotkeys('c', function(event, handler) {
	const element = document.getElementById('center_alignment');
	element.checked = true;
	element.dispatchEvent(new Event('change'));
    event.preventDefault();
});

// text
hotkeys('t', function(event, handler) {
	const element = document.getElementById('text_area');
	element.focus();
    event.preventDefault();
});
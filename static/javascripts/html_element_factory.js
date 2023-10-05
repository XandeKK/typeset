class HtmlElementFactory {
  static createLabel(textContent='', className=null) {
    const label = document.createElement('label');
    label.className = className ? className : 'text-xs font-semibold text-gray-700';
    label.textContent = textContent;
    return label;
  }

  static createInput(type='text', className=null, value='', event=()=>{}) {
    const input = document.createElement('input');
    input.type = type;
    input.className =  className ? className : 'bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10 p-1';
    input.value = value;

    input.addEventListener('input', event);

    return input;
  }

  static createDiv(className=null) {
    const div = document.createElement('div');
    div.className = className ? className : 'flex gap-2 items-center pb-2';
    return div;
  }

  static createRadio(classNameDiv=null, classNameInput=null, options=[], value=null, event) {
    const radioDiv = HtmlElementFactory.createDiv(classNameDiv ? classNameDiv : 'flex gap-1 items-center select-none mb-2 justify-between');
    const uuid = uuidv4();

    options.forEach(opt=> {
      const div = HtmlElementFactory.createDiv('flex gap-2');

      const input = document.createElement('input');
      input.id = uuidv4();
      input.type = 'radio';
      input.className =  classNameInput ? classNameInput : 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500';
      input.checked = value == opt.toLowerCase();;
      input.name = uuid;
      input.setAttribute('value-text', opt.toLowerCase());

      input.addEventListener('input', event);

      const label = HtmlElementFactory.createLabel(opt, null);
      label.htmlFor = input.id;
      
      div.appendChild(input);
      div.appendChild(label);

      radioDiv.appendChild(div);
    });

    return radioDiv;
  }
  
  static createSelect(className=null, options=[], event=()=>{}) {
    const select = document.createElement('select');
    select.className = className ? className : "border border-gray-300 rounded py-1 px-1 text-xs font-medium";
        
    options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.toLowerCase();
        option.textContent = opt;
        select.appendChild(option);
    });

    select.value = options[0].toLowerCase();

    select.addEventListener('input', event);

    return select;
  }
}

# CustomTextbox Documentation

The `CustomTextbox` is a class that extends the functionality of `fabric.Object` to create custom text boxes on the canvas.

## Constructor

```javascript
var textbox = new fabric.CustomTextbox(options);
```

### Parameters:

- `options` (object): An object containing options to customize the `CustomTextbox`.
  - `text` (string): The text to be displayed in the text box.
  - Other custom options as needed.

## Methods

### `addPlugin(plugin)`

This method allows adding custom plugins to the `CustomTextbox`.

#### Parameters:

- `plugin` (function): A function that accepts an instance of `CustomTextbox` as an argument and can add custom functionalities.

### `_render()`

This method initiates the rendering process within the `CustomTextbox`.

### `drawText(ctx, lines, y)`

- `ctx` (object): The rendering context. This object represents the canvas context and can be used to set rendering properties or draw on the canvas before the text rendering begins.
- `lines` (array): The lines that being rendered.
- `y` (number): The y-coordinate where the letter will be rendered.

This method draw the text within the `CustomTextbox`.

### `breakTextIntoLines(text, ctx)`

This method breaks the text into multiple lines based on the available width.

#### Parameters:

- `text` (string): The text to be broken into lines.
- `ctx` (object): The rendering context to measure the text.

### `toObject()`

This method converts the `CustomTextbox` into a serializable object.

### `setScale(scale)`

This method adjusts the scale of the `CustomTextbox`.

## Hooks

The `CustomTextbox` class includes several hooks that allow custom plugins to execute actions at specific points during the rendering process. Each hook provides a different context and may receive specific arguments that provide information about the current state of the rendering. Here are the hooks along with their respective arguments:

### `beforeRender(ctx)`

- `ctx` (object): The rendering context. This object represents the canvas context and can be used to set rendering properties or draw on the canvas before the text rendering begins.

This hook is executed right before the text rendering process starts. It's useful for performing actions that should occur just before the text is drawn.

### `beforeLetterRender({ctx, letter, x, y})`

- `ctx` (object): The rendering context.
- `letter` (string): The current letter being rendered.
- `x` (number): The x-coordinate where the letter will be rendered.
- `y` (number): The y-coordinate where the letter will be rendered.

This hook is executed before rendering each individual letter of the text. It allows you to perform actions specific to each letter, such as applying custom styling or effects.

### `afterLetterRender({ctx, letter, x, y})`

- `ctx` (object): The rendering context.
- `letter` (string): The current letter that has just been rendered.
- `x` (number): The x-coordinate where the letter was rendered.
- `y` (number): The y-coordinate where the letter was rendered.

This hook is executed after rendering each individual letter of the text. You can use it to perform actions that should occur after rendering each letter, such as post-processing or additional effects.

### `afterRender({ctx})`

- `ctx` (object): The rendering context.

This hook is executed after the entire text rendering process is complete. It provides an opportunity to perform actions that should occur after all text has been drawn.

### `toObject()`

This hook is executed when the `CustomTextbox` object is being serialized into an object representation. It allows you to customize how the object is represented and add additional properties or data to the serialized object.

### `setScale(scale)`

- `scale` (number): The scale factor applied to the `CustomTextbox`.

This hook is executed when the scale of the `CustomTextbox` is adjusted. It provides access to the new scale factor, allowing you to perform actions or adjustments specific to scaling.

These hooks provide flexibility for customizing the rendering process and behavior of the `CustomTextbox` class. You can use the provided arguments to access information about the rendering context and the current state of the rendering, enabling you to implement a wide range of custom functionalities and effects.

```javascript
// Create an instance of CustomTextbox
var textbox = new fabric.CustomTextbox({ text: 'Sample text' });

// Add a custom plugin
function customPlugin(textbox) {
    // Add custom functionalities here

    // Add a hook before rendering
    textbox.hooks.beforeRender.push(function (obj, arg) {
        // Perform actions before rendering
        console.log('Before rendering');
    });
    // push property in cacheProperties of fabricjs
    textbox.cacheProperties.push(
        'test',
        'test_1'
    );
}

// Add the plugin to the CustomTextbox object
textbox.addPlugin(customPlugin);

// Render the text
textbox.renderText();
```
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
/**
 * Creates a custom plugin for the CustomTextbox.
 *
 * @param {CustomTextbox} textbox - The CustomTextbox instance.
 * @param {string|null} id - An optional unique identifier for the plugin.
 * @returns {Object} - An object representing the plugin.
 */
function createCustomPlugin(textbox, id = null) {
    // Check if the plugin is loaded or needs to generate an ID
    let loaded = true;
    if (!id) {
        loaded = false;
        id = uuidv4(); // You may replace this with your ID generation logic
        // Create and initialize custom properties when generating a new ID
        // Example:
        textbox[id + '-name_property'] = 0;
    }

    // Define the plugin's hook functions

    // Hook: Before rendering
    textbox.hooks.beforeRender[id] = {
        id: id,
        function: function (obj, arg) {
            // Add custom actions before rendering here
        }
    };

    // Hook: Before rendering each letter
    textbox.hooks.beforeLetterRender[id] = {
        id: id,
        function: function (obj, arg) {
            // Add custom actions before rendering each letter here
        }
    };

    // Hook: After rendering each letter
    textbox.hooks.afterLetterRender[id] = {
        id: id,
        function: function (obj, arg) {
            // Add custom actions after rendering each letter here
        }
    };

    // Hook: After rendering
    textbox.hooks.afterRender[id] = {
        id: id,
        function: function (obj, arg) {
            // Add custom actions after rendering here
        }
    };

    // Hook: Serialize plugin-specific properties for object serialization
    textbox.hooks.toObject[id] = {
        id: id,
        function: function (obj, arg) {
            const json = {};
            // Add custom properties to be serialized here
            // Example: json[id + '-name_property'] = obj[id + '-name_property'];
            return json;
        }
    };

    // Hook: Handle scaling of plugin-specific properties
    textbox.hooks.setScale[id] = {
        id: id,
        function: function (obj, arg) {
            // Adjust custom properties based on the scaling factor here
            // Example: obj[id + '-name_property'] /= arg.scale;
        }
    };

    // Add custom properties to the cacheProperties array for caching
    // Example: textbox.cacheProperties.push(id + '-name_property');

    // Define a frontend function for rendering
    function frontend(parent) {
        // Render the frontend UI or visual elements here
    }

    // Define a delete function to clean up the plugin
    function deletePlugin() {
        // Remove all hooks related to this plugin
        delete textbox.hooks.beforeRender[id];
        delete textbox.hooks.afterRender[id];
        delete textbox.hooks.toObject[id];
        delete textbox.hooks.setScale[id];

        // Delete any plugin-specific properties
        // Example: delete textbox[id + '-name_property'];

        // Remove the plugin from the textbox's plugins array
        const pluginIndex = textbox.plugins.findIndex(obj => obj.properties[0].includes(id));
        if (pluginIndex !== -1) {
            textbox.plugins.splice(pluginIndex, 1);
        }

        // Remove any plugin-specific properties from the cacheProperties array
        // Example: const cacheIndex = textbox.cacheProperties.indexOf(id + '-name_property');
        // Example: if (cacheIndex !== -1) textbox.cacheProperties.splice(cacheIndex, 1);

        // Set the textbox as dirty and trigger rendering
        textbox.dirty = true;
        textbox.canvas.renderAll();
    }

    // Add the plugin to the textCanvas for frontend rendering
    textbox.textCanvas.addPlugin('custom_plugin', { id: id, frontend: frontend, delete: deletePlugin });

    // If the plugin is not loaded from a saved state, return plugin information
    if (!loaded) {
        return { id: id, name: 'custom_plugin', properties: [] /* Add property names here */ };
    }
}
```
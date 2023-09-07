const CustomText = fabric.util.createClass(fabric.Object, {
  type: 'customText',
  text: '', // The full text
  styles: [], // Array to store text styles
  currentIndex: 0, // Current index of the letter being rendered
  paddingLeft: 0,
  paddingRight: 0,
  lineHeight: 1.25, // Default line height

  initialize: function(text, options) {
    options || (options = {});
    this.callSuper('initialize', options);
    this.text = text;
    this.paddingTop = typeof options.paddingTop !== 'undefined' ? options.paddingTop : 0;
    this.paddingBottom = typeof options.paddingBottom !== 'undefined' ? options.paddingBottom : 0;
    this.paddingLeft = typeof options.paddingLeft !== 'undefined' ? options.paddingLeft : 0;
    this.paddingRight = typeof options.paddingRight !== 'undefined' ? options.paddingRight : 0;
    this.styles = [];
  },

  _render: function(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.fill;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;

    // Split the text into an array of lines
    var lines = this.text.split('\n');
    var lineHeight = this.fontSize * this.lineHeight;
    var totalHeight = lines.length * lineHeight + (lines.length - 1) * (this.paddingTop + this.paddingBottom);

    var y = -totalHeight / 2;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var lineWidth = ctx.measureText(line).width;

      // Render the current line letter by letter
      var x = -lineWidth / 2 + this.paddingLeft;
      for (var j = 0; j < line.length; j++) {
        var letter = line[j];
        var style = this.styles[this.currentIndex];

        // Apply styles if available
        if (style) {
          ctx.fillStyle = style.fill || this.fill;
          ctx.font = style.font || this.font;
        }

        ctx.fillText(letter, x, y);

        x += ctx.measureText(letter).width;
        // Increment the current index and style
        this.currentIndex++;
      }

      y += lineHeight + (this.paddingTop + this.paddingBottom);
    }
  },

  addStyle: function(style) {
    this.styles.push(style);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      text: this.text,
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      lineHeight: this.lineHeight,
      styles: this.styles
    });
  }
});
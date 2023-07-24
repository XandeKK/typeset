const express = require('express');
const path = require('path');
const fileUpload = require("express-fileupload");
const routes = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules/flowbite/')));
app.use(fileUpload());
app.use(routes);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

function serveStatic(dir) {
    app.use(express.static(dir));
}

require('./client')(serveStatic);
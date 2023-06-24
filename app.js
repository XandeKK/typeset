const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require("express-fileupload");
const client = require('./client');

const app = express();

const fonts = findFonts(__dirname + '/app/assets/fonts/');

app.use(express.static(__dirname + '/app/assets'));
app.use(express.static(__dirname + '/node_modules/flowbite/'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/home.html'));
});

app.get('/fonts', (req, res) => {
    res.json(fonts);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

function findFonts(startPath, result = {}) {
    const files = fs.readdirSync(startPath);

    files.forEach(file => {
        const filePath = path.join(startPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findFonts(filePath, result);
        } else if (path.extname(file) === '.otf' || path.extname(file) === '.ttf') {
            result[file] = filePath.replace(__dirname + '/app/assets', '');
        }
    });

    return result;
}
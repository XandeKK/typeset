const fs = require('fs');
const path = require('path');

function findFonts(startPath, result = {}) {
    const files = fs.readdirSync(startPath);

    files.forEach(file => {
        const filePath = path.join(startPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findFonts(filePath, result);
        } else if (path.extname(file) === '.otf' || path.extname(file) === '.ttf') {
            result[file] = filePath.replace(path.join(__dirname, '../assets'), '');
        }
    });

    return result;
}

module.exports = findFonts;

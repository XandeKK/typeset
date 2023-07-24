const express = require('express');
const path = require('path');
const findFonts = require('../utils/findFonts');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const fonts = findFonts(path.join(__dirname, '../assets/fonts/'));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

router.get('/fonts', (req, res) => {
    res.json(fonts);
});

router.post('/upload', upload.single('image'), (req, res) => {
  const filepath = req.body.filename;
  fs.rename(req.file.path, filepath, err => {
    if (err) throw err;
    console.log(`Imagem salva em ${filepath}`);
    // res.send('Imagem recebida e salva!');
  });
});

module.exports = router;

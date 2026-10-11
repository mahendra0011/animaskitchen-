const fs = require('fs');
const path = require('path');

// We can read the image and process it via canvas or sharp if available,
// or we can test if sharp is in node_modules
try {
  const sharp = require('sharp');
  sharp('C:/Users/mahen/Downloads/WhatsApp Image 2026-10-11 at 6.29.52 AM.jpeg')
    .trim()
    .toFile('public/brand-text.png')
    .then(info => console.log('Trimmed with sharp:', info))
    .catch(err => console.error(err));
} catch (e) {
  console.log('Sharp not installed, using alternative');
}

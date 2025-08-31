const fs = require('fs');
const path = require('path');

// Source and destination directories
const srcDir = path.join(__dirname, 'src', 'app', 'images');
const destDir = path.join(__dirname, 'public', 'images');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// List of PNG files to copy
const pngFiles = ['logo.png', '1.png', '2.png', '3.png', '4.png', '5.png'];

// Copy each PNG file
pngFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to public/images/`);
  } else {
    console.log(`File ${file} not found in source directory`);
  }
});

console.log('Image copying complete!');

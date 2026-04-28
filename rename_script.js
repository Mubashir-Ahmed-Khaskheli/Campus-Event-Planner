const fs = require('fs');
const oldPath = 'c:/Users/Lenovo/OneDrive - MUET/Desktop/2/backend';
const newPath = 'c:/Users/Lenovo/OneDrive - MUET/Desktop/2/functions';

try {
  fs.renameSync(oldPath, newPath);
  console.log('Successfully renamed backend to functions!');
} catch (err) {
  console.error('Error renaming:', err);
}

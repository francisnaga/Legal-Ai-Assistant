
const fs = require('fs');
const pdf = require('pdf-parse');

const buffer = fs.readFileSync('package.json'); // Just using a dummy file buffer to check import, though pdf-parse needs a PDF. 
// Actually let's just check if pdf is a function.
console.log('Type of pdf:', typeof pdf);
console.log('pdf:', pdf);

try {
    // We don't have a PDF handy easily without path, but we can check if it throws "not a function"
    if (typeof pdf !== 'function') {
        console.error('FAIL: pdf is not a function');
    } else {
        console.log('SUCCESS: pdf is a function');
    }
} catch (e) {
    console.error(e);
}

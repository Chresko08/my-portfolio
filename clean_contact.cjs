const fs = require('fs');
let content = fs.readFileSync('src/components/Contact.jsx', 'utf8');

const startStr = '<button\n                                    type="button"\n                                    onClick={handleCopyEmail}';
const endStr = '</button>';
const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    // Only remove the button itself, not the closing div.
    content = content.substring(0, startIdx) + content.substring(endIdx + endStr.length);
    fs.writeFileSync('src/components/Contact.jsx', content);
    console.log('Cleaned Contact form buttons properly');
} else {
    console.log('Could not find the duplicate button block.');
}

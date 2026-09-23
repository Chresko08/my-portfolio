const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

// Remove the copied state and handleCopyEmail
content = content.replace(/const \[copied, setCopied\] = useState\(false\);\n\n\s+const handleCopyEmail = \(\) => \{\n\s+navigator\.clipboard\.writeText\('shubhamsrivastava08@gmail\.com'\);\n\s+setCopied\(true\);\n\s+setTimeout\(\(\) => setCopied\(false\), 2000\);\n\s+\};\n/, '');

// Find the start of the Email Plain Text Display
const emailStart = content.indexOf('{/* Email Plain Text Display */}');
// Find the end of the Resume CTA button (which is an </a> tag)
// Let's just find the closing tag of the Resume button.
const resumeStart = content.indexOf('{/* Resume CTA button */}');
const resumeEnd = content.indexOf('</motion.a>', resumeStart) + '</motion.a>'.length;

if (emailStart !== -1 && resumeEnd !== -1) {
    content = content.substring(0, emailStart) + content.substring(resumeEnd);
}

fs.writeFileSync('src/components/Navbar.jsx', content);
console.log('Navbar cleaned');

import fs from 'fs';
import { interviewCategories } from './src/data/interviewData.js';

let counter = 1;
for (const cat of interviewCategories) {
    for (const q of cat.questions) {
        if (!q.qNo) {
            q.qNo = counter;
        }
        counter++;
    }
}

const jsContent = `export const interviewCategories = ${JSON.stringify(interviewCategories, null, 4)};\n`;
fs.writeFileSync('./src/data/interviewData.js', jsContent, 'utf-8');
console.log(`Assigned numbers up to Q${counter - 1}`);

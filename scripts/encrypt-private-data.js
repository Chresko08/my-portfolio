import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawDataPath = path.join(rootDir, 'src/data/lineageData.raw.js');
const outputEncryptedPath = path.join(rootDir, 'src/data/encryptedLineage.json');

function getPassphrase() {
    if (process.env.PORTFOLIO_ENCRYPTION_KEY) {
        return process.env.PORTFOLIO_ENCRYPTION_KEY;
    }
    const envFiles = [path.join(rootDir, '.env.local'), path.join(rootDir, '.env')];
    for (const envFile of envFiles) {
        if (fs.existsSync(envFile)) {
            const lines = fs.readFileSync(envFile, 'utf8').split('\n');
            for (const line of lines) {
                const match = line.match(/^\s*PORTFOLIO_ENCRYPTION_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }
        }
    }
    return null;
}

const encryptionPassphrase = getPassphrase();

async function runEncryption() {
    console.log('🔒 Starting zero-knowledge encryption check for personal career lineage...');

    if (!encryptionPassphrase || !fs.existsSync(rawDataPath)) {
        if (fs.existsSync(outputEncryptedPath)) {
            console.log('ℹ️ Pre-built encrypted lineage artifact found at: ' + outputEncryptedPath);
            console.log('   Skipping re-encryption (running in public/CI build environment).');
            return;
        }
        if (!encryptionPassphrase) {
            console.error('❌ Missing PORTFOLIO_ENCRYPTION_KEY in environment or .env.local.');
            process.exit(1);
        }
        if (!fs.existsSync(rawDataPath)) {
            console.error(`❌ Raw lineage file not found at: ${rawDataPath}`);
            process.exit(1);
        }
    }

    // Dynamic import of raw data
    const rawModule = await import(`file://${rawDataPath}`);
    const { careerParameters, lineageEras, lineageItems } = rawModule;

    if (!careerParameters || !lineageEras || !lineageItems) {
        console.error('❌ Incomplete exports from raw lineage data module.');
        process.exit(1);
    }

    const payload = JSON.stringify({
        careerParameters,
        lineageEras,
        lineageItems,
        encryptedAt: new Date().toISOString()
    });

    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
    const iterations = 100000;
    const keyLength = 32; // 256 bits

    // Derive 256-bit AES key via PBKDF2-SHA256
    const key = crypto.pbkdf2Sync(
        Buffer.from(encryptionPassphrase, 'utf8'),
        salt,
        iterations,
        keyLength,
        'sha256'
    );

    // Encrypt via AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedBody = Buffer.concat([
        cipher.update(Buffer.from(payload, 'utf8')),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag(); // 16 bytes authentication tag

    // Combine ciphertext and tag (standard format for browser Web Crypto API)
    const combinedCiphertextAndTag = Buffer.concat([encryptedBody, authTag]);

    const encryptedOutput = {
        version: 1,
        algorithm: 'AES-GCM-256',
        kdf: 'PBKDF2-SHA256',
        iterations,
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        ciphertext: combinedCiphertextAndTag.toString('base64'),
        itemCount: lineageItems.length
    };

    fs.writeFileSync(outputEncryptedPath, JSON.stringify(encryptedOutput, null, 2), 'utf8');

    console.log(`✅ Successfully encrypted ${lineageItems.length} lineage records & master deep dives.`);
    console.log(`📁 Emitted encrypted artifact: ${outputEncryptedPath}`);
    console.log(`🔐 Ciphertext length: ${encryptedOutput.ciphertext.length} characters (100% unreadable without key).`);
}

runEncryption().catch(err => {
    console.error('❌ Encryption failed:', err);
    process.exit(1);
});

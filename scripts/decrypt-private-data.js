import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const encryptedPath = path.join(rootDir, 'src/data/encryptedLineage.json');

function getPassphrase() {
    if (process.argv[2]) {
        return process.argv[2];
    }
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

const passphrase = getPassphrase();

function runDecryption() {
    if (!passphrase) {
        console.error('❌ Passphrase required. Provide as CLI arg, env var, or in .env.local');
        process.exit(1);
    }
    if (!fs.existsSync(encryptedPath)) {
        console.error(`❌ Encrypted artifact not found at: ${encryptedPath}`);
        process.exit(1);
    }

    const payload = JSON.parse(fs.readFileSync(encryptedPath, 'utf8'));
    const salt = Buffer.from(payload.salt, 'base64');
    const iv = Buffer.from(payload.iv, 'base64');
    const combined = Buffer.from(payload.ciphertext, 'base64');

    // Split ciphertext and 16-byte auth tag
    const ciphertext = combined.subarray(0, combined.length - 16);
    const authTag = combined.subarray(combined.length - 16);

    const key = crypto.pbkdf2Sync(
        Buffer.from(passphrase, 'utf8'),
        salt,
        payload.iterations,
        32,
        'sha256'
    );

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    try {
        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]);
        const data = JSON.parse(decrypted.toString('utf8'));
        console.log(`✅ Decryption test SUCCESSFUL!`);
        console.log(`📊 Records verified: ${data.lineageItems.length} items`);
        console.log(`📅 Encrypted at: ${data.encryptedAt}`);
        return data;
    } catch (err) {
        console.error(`❌ Decryption FAILED (Authentication tag mismatch / invalid key):`, err.message);
        process.exit(1);
    }
}

runDecryption();

// Client-Side Zero-Knowledge Decryption Utility using Browser-Native Web Crypto API
// Compatible with Node.js and all modern web browsers (Chrome, Safari, Firefox, Edge)

function base64ToUint8Array(base64) {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } else {
        // Node.js fallback for testing environments
        return new Uint8Array(Buffer.from(base64, 'base64'));
    }
}

/**
 * Decrypts the AES-256-GCM encrypted lineage payload using a passphrase.
 * Uses PBKDF2-SHA256 (100,000 iterations) to derive the 256-bit AES key.
 * 
 * @param {string} passphrase - Secret password provided by the user
 * @param {object} payload - Encrypted JSON containing { salt, iv, ciphertext, iterations }
 * @returns {Promise<object>} - Decrypted JavaScript object { careerParameters, lineageEras, lineageItems }
 * @throws {Error} - If passphrase is invalid or payload has been tampered with
 */
export async function decryptLineagePayload(passphrase, payload) {
    if (!passphrase || typeof passphrase !== 'string') {
        throw new Error('Please enter a valid passcode.');
    }
    if (!payload || !payload.salt || !payload.iv || !payload.ciphertext) {
        throw new Error('Invalid encrypted payload structure.');
    }

    const cryptoApi = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
        ? window.crypto.subtle
        : globalThis.crypto?.subtle;

    if (!cryptoApi) {
        throw new Error('Web Crypto API is not supported in this environment.');
    }

    const salt = base64ToUint8Array(payload.salt);
    const iv = base64ToUint8Array(payload.iv);
    const combinedCiphertextAndTag = base64ToUint8Array(payload.ciphertext);
    const iterations = payload.iterations || 100000;

    const enc = new TextEncoder();
    const keyMaterial = await cryptoApi.importKey(
        'raw',
        enc.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    const derivedKey = await cryptoApi.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    try {
        const decryptedBuffer = await cryptoApi.decrypt(
            { name: 'AES-GCM', iv: iv },
            derivedKey,
            combinedCiphertextAndTag
        );

        const dec = new TextDecoder();
        const jsonString = dec.decode(decryptedBuffer);
        return JSON.parse(jsonString);
    } catch (err) {
        // AES-GCM fails tag verification if the key or ciphertext does not match
        throw new Error('Incorrect passcode. Decryption failed.');
    }
}

#!/usr/bin/env node

/**
 * Utility script to generate XOR hash for new challenge variants
 * Usage: node generate-hash.js "YOUR PLAINTEXT HERE"
 */

const crypto = require('crypto');

function xorText(text, key) {
    return text.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ key)
    ).join('');
}

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

function generateChallenge(plaintext) {
    const XOR_KEY = 77;
    
    console.log('🔧 Challenge Hash Generator');
    console.log('===========================\n');
    
    console.log(`Original Plaintext: "${plaintext}"`);
    
    // XOR the plaintext
    const xoredText = xorText(plaintext, XOR_KEY);
    console.log(`XORed Text (key=${XOR_KEY}): "${xoredText}"`);
    
    // Show XOR bytes for verification
    const xorBytes = xoredText.split('').map(char => char.charCodeAt(0));
    console.log(`XORed Bytes: [${xorBytes.join(', ')}]`);
    
    // Generate MD5
    const hash = md5(xoredText);
    console.log(`MD5 Hash: ${hash}`);
    
    console.log('\n🔧 Environment Variables:');
    console.log(`FLAG=flag{${plaintext}}`);
    console.log(`MD5_XOR_HASH=${hash}`);
    
    console.log('\n✅ Verification Test:');
    const testXor = xorText(plaintext, XOR_KEY);
    const testHash = md5(testXor);
    const matches = testHash === hash;
    console.log(`Hash matches: ${matches ? '✅ YES' : '❌ NO'}`);
    
    return { plaintext, xoredText, hash, xorBytes };
}

// Command line usage
if (require.main === module) {
    const plaintext = process.argv[2];
    
    if (!plaintext) {
        console.log('Usage: node generate-hash.js "YOUR PLAINTEXT HERE"');
        console.log('\nExample:');
        console.log('node generate-hash.js "IN FRONT OF FOUNTAIN"');
        process.exit(1);
    }
    
    generateChallenge(plaintext);
}

module.exports = { generateChallenge, xorText, md5 };

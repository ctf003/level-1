const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

// Environment variables with defaults
const FLAG = process.env.FLAG || 'flag{IN_FRONT_OF_FOUNTAIN}';
const MD5_XOR_HASH = process.env.MD5_XOR_HASH || 'ee4d73d68a2e0bd60d0424bf6c7e40c5';
const PORT = process.env.PORT || 3000;

// XOR key used in the challenge
const XOR_KEY = 77;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// XOR function
function xorText(text, key) {
    return text.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ key)
    ).join('');
}

// MD5 hash function
function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// Main route - serve the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit endpoint for validating player answers
app.post('/submit', (req, res) => {
    try {
        const { plaintext } = req.body;
        
        if (!plaintext || typeof plaintext !== 'string') {
            return res.json({ 
                success: false, 
                message: 'Invalid input. Please provide plaintext.' 
            });
        }

        // Apply XOR to the submitted plaintext
        const xoredText = xorText(plaintext.trim(), XOR_KEY);
        
        // Compute MD5 of the XORed text
        const computedHash = md5(xoredText);
        
        console.log(`[SUBMIT] Player submitted: "${plaintext.trim()}"`);
        console.log(`[SUBMIT] XOR result: "${xoredText}"`);
        console.log(`[SUBMIT] Computed hash: ${computedHash}`);
        console.log(`[SUBMIT] Target hash:   ${MD5_XOR_HASH}`);
        
        // Compare with stored hash
        if (computedHash === MD5_XOR_HASH.toLowerCase()) {
            console.log(`[SUBMIT] ✅ CORRECT! Returning flag.`);
            return res.json({ 
                success: true, 
                flag: FLAG,
                message: 'Congratulations! You found the correct plaintext!' 
            });
        } else {
            console.log(`[SUBMIT] ❌ INCORRECT. Hash mismatch.`);
            return res.json({ 
                success: false, 
                message: 'Incorrect plaintext. Try again!' 
            });
        }
        
    } catch (error) {
        console.error('[ERROR]', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error occurred.' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: {
            flag_set: !!process.env.FLAG,
            hash_set: !!process.env.MD5_XOR_HASH
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mission Exploit CTF Server running on port ${PORT}`);
    console.log(`📁 Static files served from: ${__dirname}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
    console.log(`\n🔧 Environment Configuration:`);
    console.log(`   FLAG: ${FLAG}`);
    console.log(`   MD5_XOR_HASH: ${MD5_XOR_HASH}`);
    console.log(`   XOR_KEY: ${XOR_KEY}`);
    console.log(`\n💡 To test the challenge:`);
    console.log(`   1. Visit http://localhost:${PORT}`);
    console.log(`   2. Run 'missionexploit' command`);
    console.log(`   3. Use hints to find the plaintext`);
    console.log(`   4. Submit with 'submit [your_answer]'`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    process.exit(0);
});

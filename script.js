class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('commandInput');
        this.currentDirectory = '/home/agent';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.discoveredSecrets = new Set();
        this.challengeProgress = 0;
        this.hintIndex = 0;
        
        // Challenge data - only hash available
        this.targetHash = null;
        
        // File system structure
        this.fileSystem = this.buildFileSystem();

        this.commands = {
            help: this.helpCommand.bind(this),
            ls: this.lsCommand.bind(this),
            cat: this.catCommand.bind(this),
            cd: this.cdCommand.bind(this),
            pwd: this.pwdCommand.bind(this),
            clear: this.clearCommand.bind(this),
            hash: this.hashCommand.bind(this),
            missionexploit: this.missionExploitCommand.bind(this),
            hint: this.hintCommand.bind(this),
            submit: this.submitCommand.bind(this),
            whoami: this.whoamiCommand.bind(this),
            date: this.dateCommand.bind(this),
            uname: this.unameCommand.bind(this),
            echo: this.echoCommand.bind(this)
        };

        this.initializeTerminal();
    }

    // Mission exploit command - directs to hash database
    missionExploitCommand() {
        this.addOutput(`<span class="success">MISSION EXPLOIT PROTOCOL ACTIVATED</span>`);
        this.addOutput(`<span class="success">====================================</span>`);
        this.addOutput(``);
        this.addOutput(`<span class="info">Hash database successfully accessed.</span>`);
        this.addOutput(`<span class="warn">Check hashes.txt for intercepted data.</span>`);
        this.addOutput(``);
        this.addOutput(`<span class="info">Decode hashes to plaintext and submit for validation.</span>`);
    }

    // Progressive hint system
    hintCommand() {
        const hints = [
            "H1: Check hashes.txt for intercepted data - analyze all 5 hashes.",
            "H2: Each hash = MD5(XOR(plaintext, key)). XOR key is 77.",
            "H3: Target location is a short meeting place phrase.",
            "H4: Use XOR decoder online: input hash data XORed with 77, find readable text."
        ];
        
        if (this.hintIndex < hints.length) {
            this.addOutput(`<span class="hint">${hints[this.hintIndex]}</span>`);
            this.hintIndex++;
        } else {
            this.addOutput(`<span class="warn">No more hints available.</span>`);
        }
    }

    // Submit command to validate answer with server
    async submitCommand(args) {
        if (args.length === 0) {
            this.addOutput(`<span class="error">Usage: submit [your_plaintext_answer]</span>`);
            this.addOutput(`<span class="info">Example: submit HELLO WORLD</span>`);
            return;
        }

        const submission = args.join(' ').trim();
        if (!submission) {
            this.addOutput(`<span class="error">Please provide a non-empty answer.</span>`);
            return;
        }

        this.addOutput(`<span class="info">Submitting: ${submission}</span>`);
        this.addOutput(`<span class="warn">Validating with server...</span>`);

        try {
            const endpoint = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
                ? '/submit'
                : '/.netlify/functions/submit';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ plaintext: submission })
            });

            const result = await response.json();
            
            if (result.success) {
                this.addOutput(`<span class="success glitch">🎉 MISSION COMPLETE! 🎉</span>`);
                this.addOutput(`<span class="success">Flag: ${result.flag}</span>`);
            } else {
                this.addOutput(`<span class="error">${result.message}</span>`);
                this.addOutput(`<span class="info">Keep trying! Use 'hint' if you need help.</span>`);
            }
        } catch (error) {
            this.addOutput(`<span class="error">Connection error. Is the server running?</span>`);
            console.error('Submit error:', error);
        }
    }

    // Helper functions for obfuscation
    rot13(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    reverseString(str) {
        return str.split('').reverse().join('');
    }

    xorEncode(str, key) {
        let result = 0;
        for (let i = 0; i < str.length; i++) {
            result ^= str.charCodeAt(i) ^ key;
        }
        return result;
    }

    // Build simple file system - 3 files with direct hints
    buildFileSystem() {
        return {
            '/home/agent': {
                type: 'directory',
                contents: {
                    'readme.txt': {
                        type: 'file',
                        content: 'Welcome to Mission Exploit CTF!\n\nYour mission: Decode intercepted MD5 hashes to find\ncritical intelligence.\n\nCommands to try:\n1. ls - list files\n2. cat [filename] - read files\n3. missionexploit - access hash database\n4. hint - get assistance (limited)\n5. hash [text] - test MD5 generation\n6. submit [text] - validate solution\n\nAvailable files:\n- intel.txt - Mission briefing\n- methods.txt - Analysis techniques  \n- hashes.txt - Intercepted hash database\n\nStart with: missionexploit, then check hashes.txt!'
                    },
                    'intel.txt': {
                        type: 'file',
                        content: 'INTELLIGENCE BRIEFING\n=====================\n\nSITUATION:\nIntercepted enemy communications containing suspicious\nMD5 hashes. One contains critical intelligence.\n\nOBJECTIVE:\n• Analyze intercepted hashes (see hashes.txt)\n• Decode to obtain plaintext information  \n• Submit decoded intelligence for verification\n\nNOTE:\nStandard hash cracking methods insufficient.\nAdvanced cryptographic analysis required.\n\nClassification: TOP SECRET'
                    },
                    'methods.txt': {
                        type: 'file',
                        content: 'ANALYSIS METHODS\n================\n\nSTANDARD WORKFLOW:\n1. Access hash database via missionexploit\n2. Obtain intercepted hashes from hashes.txt\n3. Apply cryptographic analysis techniques\n4. Test potential solutions\n5. Submit decoded plaintext for validation\n\nAVAILABLE TOOLS:\n• missionexploit - access hash database\n• hint - limited assistance available\n• hash [text] - MD5 testing utility\n• submit [text] - solution validation\n\nNOTE: Multiple hashes provided. Only one is valid.\nUse appropriate cryptographic methods to decode.'
                    },
                    'hashes.txt': {
                        type: 'file',
                        content: 'INTERCEPTED HASH DATABASE\n=========================\n\nIntelligence has intercepted 5 MD5 hashes from\nenemy communications. One of them is correct.\n\nINTERCEPTED HASHES:\n------------------\nHash-Alpha: de73807b41656e73eb3938c56872167d\nHash-Beta:  9fda2b69d18ca58393fd0c6c63fa6c9b  \nHash-Gamma: 633d5b9956e790957a51f32f480d822b\nHash-Delta: 2ce9906047c7286fd9ba7d6cdcd3e21b\nHash-Echo:  ee4d73d68a2e0bd60d0424bf6c7e40c5\n\nMISSION: Decode these hashes to plain text and\nsubmit the correct one for validation.'
                    }
                }
            }
        };
    }

    initializeTerminal() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        this.input.focus();
        
        // Keep input focused
        document.addEventListener('click', () => {
            this.input.focus();
        });

        // Handle cursor positioning and blinking
        this.setupCursor();
        
        // Anti-debugging measures
        this.setupAntiDebug();
    }

    setupCursor() {
        const cursor = document.querySelector('.cursor');
        const input = this.input;
        
        // Position cursor based on input content
        const updateCursorPosition = () => {
            const inputValue = input.value;
            const inputWidth = this.getTextWidth(inputValue, '0.95rem Fira Code');
            cursor.style.transform = `translateX(${inputWidth}px)`;
        };

        // Update cursor position on input
        input.addEventListener('input', updateCursorPosition);
        input.addEventListener('keydown', (e) => {
            setTimeout(updateCursorPosition, 0);
        });

        // Initial positioning
        updateCursorPosition();

        // Cursor blinking animation
        let blinkState = true;
        setInterval(() => {
            cursor.style.opacity = blinkState ? '1' : '0';
            blinkState = !blinkState;
        }, 500);
    }

    getTextWidth(text, font) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        return context.measureText(text).width;
    }

    setupAntiDebug() {
        // Detect dev tools
        let devtools = {
            open: false,
            orientation: null
        };
        
        const threshold = 160;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.log('%c🚨 SECURITY ALERT 🚨', 'color: red; font-size: 20px; font-weight: bold;');
                    console.log('%cDeveloper tools detected! The flag is not stored in the source code.', 'color: red; font-size: 14px;');
                    console.log('%cYou must solve the challenge through the terminal interface.', 'color: red; font-size: 14px;');
                    console.log('%cThe flag is generated dynamically when you crack the hash!', 'color: red; font-size: 14px;');
                }
            } else {
                devtools.open = false;
            }
        }, 500);

        // Obfuscate console and prevent easy inspection
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        console.dir = () => {};
        console.table = () => {};
        
        // Prevent common debugging tricks
        Object.defineProperty(window, 'terminal', {
            get: () => undefined,
            set: () => {}
        });
        
        // Clear any global references
        window.Terminal = undefined;
        window.terminal = undefined;
    }

    processCommand() {
        const command = this.input.value.trim();
        if (command === '') return;

        this.addToHistory(command);
        this.addOutput(`<span class="prompt">root@mission-exploit:${this.currentDirectory}# </span><span class="command">${command}</span>`);

        const [cmd, ...args] = command.split(' ');
        
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addOutput(`<span class="error">Command not found: ${cmd}</span>`);
            this.addOutput(`<span class="warning">Type 'help' for available commands.</span>`);
        }

        this.input.value = '';
        this.scrollToBottom();
    }

    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    addOutput(text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        div.className = 'output-text';
        this.output.appendChild(div);
    }

    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Command implementations
    helpCommand() {
        const helpText = `
<span class="success">Available Commands:</span>
==================

<span class="command">help</span>             - Show this help message
<span class="command">ls</span>               - List directory contents
<span class="command">cat [file]</span>       - Display file contents
<span class="command">missionexploit</span>   - Access hash database
<span class="command">hint</span>             - Get progressive hints
<span class="command">submit [text]</span>    - Submit plaintext answer
<span class="command">hash [phrase]</span>    - Generate MD5 hash for testing
<span class="command">clear</span>            - Clear terminal
<span class="command">pwd</span>              - Print working directory
<span class="command">whoami</span>           - Display current user
<span class="command">echo [text]</span>      - Display text

<span class="warning">Mission:</span> Find the plaintext that generates the target hash!
<span class="warning">Start:</span> Run 'missionexploit' to begin your mission.`;

        this.addOutput(helpText);
    }


    lsCommand(args) {
        const showHidden = args.includes('-la') || args.includes('-a');
        const currentDir = this.getCurrentDirectory();
        
        if (!currentDir || currentDir.type !== 'directory') {
            this.addOutput('<span class="error">Not a directory</span>');
            return;
        }

        let output = '';
        for (const [name, item] of Object.entries(currentDir.contents)) {
            if (!showHidden && name.startsWith('.')) continue;
            
            const type = item.type === 'directory' ? 'd' : '-';
            const permissions = item.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
            const size = item.type === 'directory' ? '4096' : (item.content?.length || '0');
            const color = item.type === 'directory' ? 'color: #00aaff;' : 'color: #00ff00;';
            
            if (showHidden) {
                output += `${type}${permissions}  1 root root  ${size.padStart(8)} Jan 15 10:24 <span style="${color}">${name}</span>\n`;
            } else {
                output += `<span style="${color}">${name}</span>  `;
            }
        }
        
        this.addOutput(`<pre>${output}</pre>`);
    }

    catCommand(args) {
        if (args.length === 0) {
            this.addOutput('<span class="error">Usage: cat [filename]</span>');
            return;
        }

        const filename = args[0];
        const currentDir = this.getCurrentDirectory();
        
        if (!currentDir || !currentDir.contents[filename]) {
            this.addOutput(`<span class="error">cat: ${filename}: No such file or directory</span>`);
            return;
        }

        const file = currentDir.contents[filename];
        if (file.type !== 'file') {
            this.addOutput(`<span class="error">cat: ${filename}: Is a directory</span>`);
            return;
        }

        this.addOutput(`<pre>${file.content}</pre>`);
    }

    cdCommand(args) {
        if (args.length === 0) {
            this.currentDirectory = '/home/agent';
            return;
        }

        const targetDir = args[0];
        
        if (targetDir === '..') {
            const pathParts = this.currentDirectory.split('/').filter(p => p);
            if (pathParts.length > 1) {
                pathParts.pop();
                this.currentDirectory = '/' + pathParts.join('/');
            }
            return;
        }

        const currentDir = this.getCurrentDirectory();
        if (!currentDir || !currentDir.contents[targetDir]) {
            this.addOutput(`<span class="error">cd: ${targetDir}: No such file or directory</span>`);
            return;
        }

        if (currentDir.contents[targetDir].type !== 'directory') {
            this.addOutput(`<span class="error">cd: ${targetDir}: Not a directory</span>`);
            return;
        }

        this.currentDirectory = this.currentDirectory === '/' ? `/${targetDir}` : `${this.currentDirectory}/${targetDir}`;
    }

    pwdCommand() {
        this.addOutput(this.currentDirectory);
    }

    clearCommand() {
        this.output.innerHTML = '';
    }

    hashCommand(args) {
        if (args.length === 0) {
            this.addOutput('<span class="error">Usage: hash [phrase]</span>');
            this.addOutput('<span class="warning">Generate MD5 hash for testing purposes</span>');
            this.addOutput('<span class="warning">Use this to verify your solutions!</span>');
            return;
        }

        const text = args.join(' ');
        const hash = this.md5(text);
        
        this.addOutput(`<span class="success">Input:</span> ${text}`);
        this.addOutput(`<span class="success">MD5:</span>   ${hash}`);
        this.addOutput(`<span class="info">Use this hash for comparison and testing.</span>`);
    }

    whoamiCommand() {
        this.addOutput('root');
    }

    dateCommand() {
        this.addOutput(new Date().toString());
    }

    unameCommand() {
        this.addOutput('Linux mission-exploit 2.6.32-generic #1 SMP x86_64 GNU/Linux');
    }

    echoCommand(args) {
        this.addOutput(args.join(' '));
    }

    findCommand(args) {
        if (args.length === 0) {
            this.addOutput('<span class="error">Usage: find [filename]</span>');
            return;
        }

        const searchTerm = args[0];
        const results = this.searchFileSystem(searchTerm);
        
        if (results.length === 0) {
            this.addOutput(`<span class="warning">No files found matching: ${searchTerm}</span>`);
        } else {
            this.addOutput(`<span class="success">Found ${results.length} file(s):</span>`);
            results.forEach(path => {
                this.addOutput(`  ${path}`);
            });
        }
    }

    grepCommand(args) {
        if (args.length === 0) {
            this.addOutput('<span class="error">Usage: grep [pattern]</span>');
            return;
        }

        const pattern = args[0].toLowerCase();
        const results = this.searchInFiles(pattern);
        
        if (results.length === 0) {
            this.addOutput(`<span class="warning">No matches found for: ${pattern}</span>`);
        } else {
            this.addOutput(`<span class="success">Found ${results.length} match(es):</span>`);
            results.forEach(result => {
                this.addOutput(`<span style="color: #00aaff;">${result.file}:</span> ${result.line}`);
            });
        }
    }

    // Utility methods
    getCurrentDirectory() {
        if (this.currentDirectory === '/home/agent') {
            return this.fileSystem['/home/agent'];
        }
        
        const pathParts = this.currentDirectory.split('/').filter(p => p);
        let current = this.fileSystem;
        
        // Navigate through the path
        let fullPath = '';
        for (const part of pathParts) {
            fullPath += '/' + part;
            if (current[fullPath]) {
                current = current[fullPath];
            } else if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        
        return current;
    }

    searchFileSystem(searchTerm, path = '', currentDir = this.fileSystem) {
        const results = [];
        
        for (const [name, item] of Object.entries(currentDir)) {
            const fullPath = path ? `${path}/${name}` : name;
            
            if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push(fullPath);
            }
            
            if (item.type === 'directory' && item.contents) {
                results.push(...this.searchFileSystem(searchTerm, fullPath, item.contents));
            }
        }
        
        return results;
    }

    searchInFiles(pattern, path = '', currentDir = this.fileSystem) {
        const results = [];
        
        for (const [name, item] of Object.entries(currentDir)) {
            const fullPath = path ? `${path}/${name}` : name;
            
            if (item.type === 'file' && item.content) {
                const lines = item.content.split('\n');
                lines.forEach((line, index) => {
                    if (line.toLowerCase().includes(pattern)) {
                        results.push({
                            file: fullPath,
                            line: line.trim(),
                            lineNumber: index + 1
                        });
                    }
                });
            } else if (item.type === 'directory' && item.contents) {
                results.push(...this.searchInFiles(pattern, fullPath, item.contents));
            }
        }
        
        return results;
    }

    // Simple MD5 implementation
    md5(string) {
        function rotateLeft(value, amount) {
            return (value << amount) | (value >>> (32 - amount));
        }

        function addUnsigned(x, y) {
            return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
        }

        function md5cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3];
            
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = addUnsigned(a, x[0]);
            x[1] = addUnsigned(b, x[1]);
            x[2] = addUnsigned(c, x[2]);
            x[3] = addUnsigned(d, x[3]);
        }

        function cmn(q, a, b, x, s, t) {
            return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function md51(s) {
            const n = s.length;
            const state = [1732584193, -271733879, -1732584194, 271733878];
            let i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++) {
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            }
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        function md5blk(s) {
            const md5blks = [];
            for (let i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        function rhex(n) {
            let s = '';
            for (let j = 0; j <= 3; j++) {
                s += (((n >> (j * 8 + 4)) & 0x0F).toString(16) + ((n >> (j * 8)) & 0x0F).toString(16));
            }
            return s;
        }

        function hex(x) {
            for (let i = 0; i < x.length; i++) {
                x[i] = rhex(x[i]);
            }
            return x.join('');
        }

        return hex(md51(string));
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

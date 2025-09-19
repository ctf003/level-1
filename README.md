# Mission Exploit - Hashing CTF Challenge Level 1

A secure CTF challenge that requires players to reverse-engineer a hash through XOR decoding, making it human-solvable but resistant to AI/code analysis.

## Challenge Overview

Players must:
1. Run `missionexploit` command to confirm the primary target hash
2. Access `hashes.txt` to see 5 intercepted MD5 hashes (4 decoys + 1 real)
3. Use progressive hints to understand the XOR + MD5 encoding method
4. Analyze each hash to find which one decodes to a valid English meeting location
5. Submit the decoded location to the server for validation

**Enhanced Security Features**: 
- Flag never appears in client-side code
- Multiple decoy hashes prevent easy guessing
- Requires actual cryptographic analysis skills

## Setup Instructions

### Prerequisites
- Node.js 14+ installed
- npm package manager

### Installation
1. Navigate to the challenge directory:
   ```bash
   cd "set3/hashing S3 1"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (optional):
   ```bash
   # Linux/Mac
   export FLAG="flag{IN_FRONT_OF_FOUNTAIN}"
   export MD5_XOR_HASH="ee4d73d68a2e0bd60d0424bf6c7e40c5"
   export PORT="3000"
   
   # Windows
   set FLAG=flag{IN_FRONT_OF_FOUNTAIN}
   set MD5_XOR_HASH=ee4d73d68a2e0bd60d0424bf6c7e40c5
   set PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the challenge:
   ```
   http://localhost:3000
   ```

## How to Play

1. **Start Mission**: Run `missionexploit` command to access hash database
2. **Analyze Database**: Run `cat hashes.txt` to see 5 intercepted MD5 hashes
3. **Cryptographic Analysis**: Determine which hash can be decoded to readable text
4. **Get Hints**: Run `hint` command if needed for assistance
5. **Submit Solution**: Use `submit [decoded_text]` to validate with server

## Solution Process

**Spoiler Alert - Solution Below**

<details>
<summary>Click to reveal solution steps</summary>

### Step 1: Understanding the Challenge
- 5 intercepted hashes, only 1 is real
- Each hash = MD5(XOR(plaintext, key))
- XOR key is 77 (from hints)
- Need to find which hash decodes to English

### Step 2: Hash Analysis Process
1. **Hash-Alpha** (`de73807b41656e73eb3938c56872167d`) → Decoy data
2. **Hash-Beta** (`9fda2b69d18ca58393fd0c6c63fa6c9b`) → Decoy data  
3. **Hash-Gamma** (`633d5b9956e790957a51f32f480d822b`) → Decoy data
4. **Hash-Delta** (`2ce9906047c7286fd9ba7d6cdcd3e21b`) → Decoy data
5. **Hash-Echo** (`ee4d73d68a2e0bd60d0424bf6c7e40c5`) → "IN FRONT OF FOUNTAIN" ✅

### Step 3: Identifying the Real Location
- Only "IN FRONT OF FOUNTAIN" is a realistic meeting location
- Other phrases are obviously random/decoy data
- Hash-Echo contains the real meeting coordinates

### Step 4: Submit
```
submit IN FRONT OF FOUNTAIN
```

</details>

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLAG` | `flag{IN_FRONT_OF_FOUNTAIN}` | The actual flag returned on success |
| `MD5_XOR_HASH` | `ee4d73d68a2e0bd60d0424bf6c7e40c5` | Target hash to match |
| `PORT` | `3000` | Server port |

## Available Commands

- `help` - Show available commands
- `missionexploit` - Access hash database
- `hint` - Progressive hints (4 available)
- `submit [location]` - Submit decoded meeting location
- `hash [text]` - Generate MD5 for testing
- `ls` - List files (shows readme.txt, intel.txt, methods.txt, hashes.txt)
- `cat [file]` - Read files (especially important: `cat hashes.txt`)
- `clear` - Clear terminal

## Analysis Tools

- **`analyze-hashes.js`** - Development tool to test all hashes
  ```bash
  node analyze-hashes.js  # Shows which hash decodes to English
  ```
- **`generate-hash.js`** - Create new challenge variants
  ```bash
  node generate-hash.js "YOUR PHRASE"  # Generate hash for new phrase
  ```

## Security Features

- ✅ Flag never appears in client-side code
- ✅ Server-side validation only
- ✅ Multiple decoy hashes prevent guessing attacks
- ✅ XOR obfuscation requires cryptographic analysis
- ✅ Progressive hint system guides but doesn't reveal
- ✅ Requires actual hash analysis skills
- ✅ Human-solvable but AI-resistant

## File Structure

```
hashing S3 1/
├── index.html          # Frontend terminal interface
├── script.js           # Terminal logic (no flags!)
├── style.css           # Terminal styling
├── server.js           # Express server with validation
├── package.json        # Dependencies
└── README.md           # This file
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing the Challenge
1. Start server: `npm start`
2. Visit: `http://localhost:3000`
3. Run: `missionexploit`
4. Use: `hint` (3 times)
5. Submit: `submit IN FRONT OF FOUNTAIN`
6. Should receive: `flag{IN_FRONT_OF_FOUNTAIN}`

### Customizing the Challenge
To create a new challenge variant:
1. Choose new plaintext
2. XOR with key 77
3. Compute MD5 hash
4. Update `MD5_XOR_HASH` environment variable
5. Update `FLAG` environment variable

## Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Run `npm install` to ensure dependencies are installed

### Frontend Not Loading
- Ensure server is running on correct port
- Check browser console for errors

### Submission Not Working
- Verify server is responding to POST requests
- Check network tab in browser dev tools
- Ensure Content-Type is application/json

## License

MIT License - Feel free to use and modify for educational purposes.

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(srcDir, function(filePath) {
    if (!filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Convert const X = require('Y') to import X from 'Y'
    content = content.replace(/const\s+([a-zA-Z0-9_{}\s,]+)\s*=\s*require\((['"])(.*?)\2\);?/g, "import $1 from '$3';");
    
    // Convert module.exports = { ... } to export { ... }
    // Actually, let's just let it be or do simple replacements
    content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, "export default $1;");

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
});

// Fix seed and create_admin
const rootFiles = ['seed.ts', 'create_admin.ts'].map(f => path.join(__dirname, '../', f));
rootFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/const\s+([a-zA-Z0-9_{}\s,]+)\s*=\s*require\((['"])(.*?)\2\);?/g, "import $1 from '$3';");
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
});

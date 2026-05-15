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

    // Convert module.exports = { X, Y } to export { X, Y }
    content = content.replace(/module\.exports\s*=\s*(\{.*?\});?/gs, "export $1;");
    
    // Convert module.exports = X to export default X
    content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, "export default $1;");

    if (original !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated exports in ${filePath}`);
    }
});

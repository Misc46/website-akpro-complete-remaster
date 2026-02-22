
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

async function optimize() {
    console.log('Starting optimization...');
    for (const file of files) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, file.replace(/\.(jpg|png)$/, '.webp'));

        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        const oldSize = fs.statSync(inputPath).size / 1024;
        const newSize = fs.statSync(outputPath).size / 1024;
        console.log(`${file}: ${oldSize.toFixed(2)}KB -> ${newSize.toFixed(2)}KB (${((1 - newSize / oldSize) * 100).toFixed(2)}% reduction)`);
    }
}

optimize().catch(console.error);

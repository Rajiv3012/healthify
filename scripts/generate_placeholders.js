
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_FRAMES = 120;
const OUTPUT_DIR = path.join(__dirname, '../public');

// A simple 1x1 green pixel PNG (Base64)
const GREEN_PIXEL_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const BUFFER = Buffer.from(GREEN_PIXEL_BASE64, 'base64');

console.log(`Generating ${TOTAL_FRAMES} placeholder frames in ${OUTPUT_DIR}...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
    // Pad index to 3 digits if needed, or just standard numbers. 
    // Prompt says "apple_frame_[i].webp", usually implies 0, 1, 2... or 000, 001.
    // I will use simple numbers for now: apple_frame_0.webp, etc.
    // Using .png extension effectively but naming it .webp might work in some browsers, 
    // but let's just make valid .png files and maybe the user can swap them.
    // Actually, I'll just name them .png and update the React code match.
    const fileName = `apple_frame_${i}.png`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(filePath, BUFFER);
}

console.log("Done! Created placeholder images.");

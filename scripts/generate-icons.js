const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Standard SVG Icon (with subtle corner rounding and depth)
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.22 : size * 0.14;
  const iconSize = size - padding * 2;
  const radius = isMaskable ? 0 : size * 0.22;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a38e8" />
        <stop offset="50%" stop-color="#1c2ac8" />
        <stop offset="100%" stop-color="#0f198f" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.02}" flood-opacity="0.35"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />

    <!-- Center Academic Emblem (Graduation Cap + Shield) -->
    <g transform="translate(${padding}, ${padding}) scale(${iconSize / 24})" filter="url(#shadow)">
      <!-- Graduation Cap -->
      <path d="M12 2.5L1 8.5L12 14.5L21 9.59V16.5H23V8.5L12 2.5Z" fill="#ffffff" />
      <!-- Lower Shield / Ribbon -->
      <path d="M5 12.68V16.68C5 19.34 8.13 21.5 12 21.5C15.87 21.5 19 19.34 19 16.68V12.68L12 16.5L5 12.68Z" fill="#ffffff" fill-opacity="0.9" />
      <!-- Golden Accent Dot -->
      <circle cx="21.5" cy="8.5" r="1.8" fill="url(#goldGrad)" />
    </g>
  </svg>
  `;
}

async function generateAll() {
  const sizes = [
    { name: 'icon-192x192.png', size: 192, maskable: false },
    { name: 'icon-512x512.png', size: 512, maskable: false },
    { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'icon-96x96.png', size: 96, maskable: false },
    { name: 'icon-72x72.png', size: 72, maskable: false },
    { name: 'icon-48x48.png', size: 48, maskable: false },
  ];

  for (const item of sizes) {
    const svg = createSvg(item.size, item.maskable);
    const dest = path.join(outDir, item.name);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`Generated: ${item.name}`);
  }

  // Also write favicon.ico / favicon.png
  const favSvg = createSvg(64, false);
  await sharp(Buffer.from(favSvg))
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));

  // Also write SVG version in icons/icon.svg
  fs.writeFileSync(path.join(outDir, 'icon.svg'), createSvg(512, false).trim());
  console.log('All icons generated successfully!');
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

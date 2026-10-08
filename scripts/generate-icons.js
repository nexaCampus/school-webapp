const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Proportional SVG generator for standard and LITE icons
function createSvg(size, isMaskable = false, isLite = true) {
  const radius = isMaskable ? 0 : Math.round(size * 0.22);
  const shadowDy = Math.max(1, Number((size * 0.016).toFixed(1)));

  // If standard icon (no LITE badge)
  if (!isLite) {
    const padding = isMaskable ? size * 0.22 : size * 0.14;
    const iconSize = size - padding * 2;
    const scale = iconSize / 24;
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
          <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${shadowDy}" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />
      <g transform="translate(${padding.toFixed(2)}, ${padding.toFixed(2)}) scale(${scale.toFixed(4)})" filter="url(#shadow)">
        <path d="M12 2.5L1 8.5L12 14.5L21 9.59V16.5H23V8.5L12 2.5Z" fill="#ffffff" />
        <path d="M5 12.68V16.68C5 19.34 8.13 21.5 12 21.5C15.87 21.5 19 19.34 19 16.68V12.68L12 16.5L5 12.68Z" fill="#ffffff" fill-opacity="0.9" />
        <circle cx="21.5" cy="8.5" r="1.8" fill="url(#goldGrad)" />
      </g>
    </svg>
    `.trim();
  }

  // LITE Icon: Emblem scaled proportionally to leave room for the LITE pill badge at the bottom
  const emblemFraction = isMaskable ? 0.48 : 0.56;
  const emblemSize = size * emblemFraction;
  const scale = emblemSize / 24;
  const emblemX = (size - 24 * scale) / 2;
  const emblemY = size * (isMaskable ? 0.15 : 0.11);

  const pillW = Math.round(size * (isMaskable ? 0.38 : 0.42));
  const pillH = Math.round(size * (isMaskable ? 0.11 : 0.12));
  const pillX = Math.round((size - pillW) / 2);
  const pillY = Math.round(size * (isMaskable ? 0.72 : 0.75));
  const pillRx = Math.round(pillH / 2);

  const fontSize = Math.round(pillH * 0.60);
  const letterSpacing = Math.max(1, Math.round(size * 0.012));
  const strokeW = Math.max(1, Number((size * 0.005).toFixed(1)));
  const textY = Math.round(pillY + pillH * 0.70);

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
        <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${shadowDy}" flood-opacity="0.35"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />

    <!-- Center Academic Emblem (Graduation Cap + Shield) -->
    <g transform="translate(${emblemX.toFixed(2)}, ${emblemY.toFixed(2)}) scale(${scale.toFixed(4)})" filter="url(#shadow)">
      <!-- Graduation Cap -->
      <path d="M12 2.5L1 8.5L12 14.5L21 9.59V16.5H23V8.5L12 2.5Z" fill="#ffffff" />
      <!-- Lower Shield / Ribbon -->
      <path d="M5 12.68V16.68C5 19.34 8.13 21.5 12 21.5C15.87 21.5 19 19.34 19 16.68V12.68L12 16.5L5 12.68Z" fill="#ffffff" fill-opacity="0.9" />
      <!-- Golden Accent Dot -->
      <circle cx="21.5" cy="8.5" r="1.8" fill="url(#goldGrad)" />
    </g>

    <!-- LITE Badge Pill Container at Bottom -->
    <g filter="url(#shadow)">
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillRx}" fill="#ffffff" stroke="rgba(255,255,255,0.85)" stroke-width="${strokeW}" />
      <text x="${(size / 2).toFixed(1)}" y="${textY}" text-anchor="middle" font-family="'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="${letterSpacing}" fill="#1c2ac8">LITE</text>
    </g>
  </svg>
  `.trim();
}

async function generateAll() {
  // 1. Write the clean standard SVG files: public/icons/icon.svg and icon-lite.svg
  const cleanSvg512 = createSvg(512, false, false);
  fs.writeFileSync(path.join(outDir, 'icon.svg'), cleanSvg512);
  fs.writeFileSync(path.join(outDir, 'icon-lite.svg'), cleanSvg512);
  console.log('Saved clean: icon.svg & icon-lite.svg');

  // 2. Generate all PNG icons for PWA & home screen installation
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
    const svg = createSvg(item.size, item.maskable, false);
    const dest = path.join(outDir, item.name);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`Generated: ${item.name}`);
  }

  // 3. Favicon (64x64)
  const favSvg = createSvg(64, false, false);
  await sharp(Buffer.from(favSvg))
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
  console.log('Generated: favicon.png');

  console.log('All NexaCampus icons generated successfully!');
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

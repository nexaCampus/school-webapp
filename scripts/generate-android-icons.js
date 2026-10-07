const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createSvg(size, isMaskable = false, isRound = false) {
  let radius;
  if (isRound) {
    radius = size / 2;
  } else if (isMaskable) {
    radius = 0;
  } else {
    radius = Math.round(size * 0.22);
  }

  const shadowDy = Math.max(1, Number((size * 0.016).toFixed(1)));

  // Proportional sizing for academic emblem
  const emblemFraction = (isRound || isMaskable) ? 0.46 : 0.54;
  const emblemSize = size * emblemFraction;
  const scale = emblemSize / 24;
  const emblemX = (size - 24 * scale) / 2;
  const emblemY = size * (isRound ? 0.16 : 0.11);

  // Proportional sizing for LITE pill badge
  const pillW = Math.round(size * (isRound ? 0.36 : 0.40));
  const pillH = Math.round(size * (isRound ? 0.11 : 0.12));
  const pillX = Math.round((size - pillW) / 2);
  const pillY = Math.round(size * (isRound ? 0.70 : 0.75));
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
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />
    <g transform="translate(${emblemX.toFixed(2)}, ${emblemY.toFixed(2)}) scale(${scale.toFixed(4)})" filter="url(#shadow)">
      <path d="M12 2.5L1 8.5L12 14.5L21 9.59V16.5H23V8.5L12 2.5Z" fill="#ffffff" />
      <path d="M5 12.68V16.68C5 19.34 8.13 21.5 12 21.5C15.87 21.5 19 19.34 19 16.68V12.68L12 16.5L5 12.68Z" fill="#ffffff" fill-opacity="0.9" />
      <circle cx="21.5" cy="8.5" r="1.8" fill="url(#goldGrad)" />
    </g>
    <g filter="url(#shadow)">
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillRx}" fill="#ffffff" stroke="rgba(255,255,255,0.85)" stroke-width="${strokeW}" />
      <text x="${(size / 2).toFixed(1)}" y="${textY}" text-anchor="middle" font-family="'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="${letterSpacing}" fill="#1c2ac8">LITE</text>
    </g>
  </svg>
  `.trim();
}

async function run() {
  const baseRes = path.join(__dirname, '..', '..', 'app', 'src', 'main', 'res');
  const densities = [
    { name: 'mipmap-mdpi', size: 48 },
    { name: 'mipmap-hdpi', size: 72 },
    { name: 'mipmap-xhdpi', size: 96 },
    { name: 'mipmap-xxhdpi', size: 144 },
    { name: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const d of densities) {
    const dir = path.join(baseRes, d.name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // ic_launcher.png (standard squircle icon)
    const svgNormal = createSvg(d.size, false, false);
    await sharp(Buffer.from(svgNormal)).png({ compressionLevel: 9 }).toFile(path.join(dir, 'ic_launcher.png'));

    // ic_launcher_round.png (round circular icon)
    const svgRound = createSvg(d.size, false, true);
    await sharp(Buffer.from(svgRound)).png({ compressionLevel: 9 }).toFile(path.join(dir, 'ic_launcher_round.png'));

    console.log(`Generated Android LITE icons for ${d.name} (${d.size}x${d.size})`);
  }

  // Also 512x512 play store icon in app/src/main/ic_launcher-web.png
  const webIconPath = path.join(__dirname, '..', '..', 'app', 'src', 'main', 'ic_launcher-web.png');
  const svg512 = createSvg(512, false, false);
  await sharp(Buffer.from(svg512)).png({ compressionLevel: 9 }).toFile(webIconPath);
  console.log('Generated Android ic_launcher-web.png (512x512)');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';

const scriptContent = fs.readFileSync('scripts/generate_all_editions.ts', 'utf-8');
const match = scriptContent.match(/const PRODUCTS_EDITIONS_CONFIG = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not find PRODUCTS_EDITIONS_CONFIG');
const config = eval(match[1]);

let productsTs = fs.readFileSync('src/data/products.ts', 'utf-8');

for (const item of config) {
  const code = item.code;
  const editions = item.editions;
  const primaryImage = `/images/editions/${editions[0].file}`;
  const galleryArray = editions.map((e: any) => `'/images/editions/${e.file}'`).join(',\n      ');
  const editionImagesEntries = editions.map((e: any) => `      '${e.name}': '/images/editions/${e.file}'`).join(',\n');

  // Find product block in productsTs
  // Regex matches from `code: '${code}',` up to `inStock:`
  const codeRegex = new RegExp(`(code:\\s*'${code}',[\\s\\S]*?)(image:\\s*[^,\\n]+,)([\\s\\S]*?)(gallery:\\s*\\[[\\s\\S]*?\\],)([\\s\\S]*?)(editionImages:\\s*\\{[\\s\\S]*?\\},)?([\\s\\S]*?)(tag:|description:)`, 'm');

  const matchProd = productsTs.match(codeRegex);
  if (!matchProd) {
    console.error(`Could not match product block for code ${code}`);
    continue;
  }

  // Build the replacement chunk
  // We keep everything before `image:`, replace `image`, `gallery`, and `editionImages`, then continue with `tag:` or `description:`
  const beforeImage = matchProd[1];
  const middle1 = matchProd[3]; // between image and gallery
  const afterGallery = matchProd[5]; // between gallery and editionImages/tag
  const afterEditionImages = matchProd[7]; // between editionImages and tag/description
  const remainder = matchProd[8];

  const newBlock = `${beforeImage}image: '${primaryImage}',${middle1}gallery: [\n      ${galleryArray}\n    ],\n    editionImages: {\n${editionImagesEntries}\n    },\n    ${remainder}`;

  productsTs = productsTs.replace(codeRegex, newBlock);
  console.log(`Updated product #${code}`);
}

fs.writeFileSync('src/data/products.ts', productsTs, 'utf-8');
console.log('Successfully updated src/data/products.ts!');

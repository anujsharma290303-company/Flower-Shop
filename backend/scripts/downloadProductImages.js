const fs = require("fs/promises");
const path = require("path");

const productImages = require("../src/seed/productImages");

const outputDir = path.resolve(__dirname, "../../frontend/public/images/products");
const mappingFilePath = path.resolve(__dirname, "../src/seed/productImages.js");

const downloadToBuffer = async (url) => {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "flower-shop-image-seeder/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.arrayBuffer();
  return Buffer.from(data);
};

const run = async () => {
  await fs.mkdir(outputDir, { recursive: true });

  const entries = Object.entries(productImages);
  const nextMapping = {};

  let downloaded = 0;
  let failed = 0;

  for (const [slug, imageArray] of entries) {
    const sourceUrl = Array.isArray(imageArray) ? imageArray[0] : null;
    const fileName = `${slug}.jpg`;
    const destinationPath = path.join(outputDir, fileName);

    try {
      if (!sourceUrl || sourceUrl.startsWith("/images/products/")) {
        nextMapping[slug] = [`/images/products/${fileName}`];
        continue;
      }

      const buffer = await downloadToBuffer(sourceUrl);
      await fs.writeFile(destinationPath, buffer);
      nextMapping[slug] = [`/images/products/${fileName}`];
      downloaded += 1;
    } catch (error) {
      failed += 1;
      console.error(`Failed for ${slug}: ${error.message}`);
      nextMapping[slug] = [`/images/products/${fileName}`];
    }
  }

  const fileContent = `const productImages = ${JSON.stringify(nextMapping, null, 2)};\n\nmodule.exports = productImages;\n`;
  await fs.writeFile(mappingFilePath, fileContent, "utf8");

  console.log(`Done. Downloaded: ${downloaded}, Failed: ${failed}, Total: ${entries.length}`);
  console.log(`Images folder: ${outputDir}`);
  console.log(`Updated mapping: ${mappingFilePath}`);
};

run().catch((error) => {
  console.error("Script failed:", error.message);
  process.exit(1);
});

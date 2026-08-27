import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const portfolioDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(portfolioDir, 'dist');
const sources = ['index.html', 'lab.html', 'styles.css', 'script.js', 'lab.js', 'assets'];

if (path.dirname(outputDir) !== portfolioDir) {
  throw new Error('Refusing to clean a directory outside portfolio/.');
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const source of sources) {
  const sourcePath = path.join(portfolioDir, source);
  try {
    await stat(sourcePath);
  } catch {
    if (source === 'script.js' || source === 'lab.js' || source === 'assets') continue;
    throw new Error(`Required portfolio source is missing: ${source}`);
  }
  await cp(sourcePath, path.join(outputDir, source), { recursive: true });
}

const htmlFiles = ['index.html', 'lab.html'];

for (const file of htmlFiles) {
  const filePath = path.join(outputDir, file);
  try {
    await stat(filePath);
  } catch {
    throw new Error(`Expected HTML file missing in build output: ${file}`);
  }

  const html = await readFile(filePath, 'utf8');
  const localReferences = [...html.matchAll(/(?:href|src)="(?!https?:|#|mailto:|tel:)([^"?]+)"/g)].map((match) => match[1]);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate HTML ids in ${file}: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.includes(anchor)) {
      throw new Error(`Broken internal anchor in ${file}: #${anchor}`);
    }
  }

  for (const requiredMarkup of ['<html lang="pt-BR">', '<title>', 'name="description"']) {
    if (!html.includes(requiredMarkup)) {
      throw new Error(`Required accessibility/SEO markup is missing in ${file}: ${requiredMarkup}`);
    }
  }

  for (const imageTag of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]+"/.test(imageTag[0])) {
      throw new Error(`Every content image must have meaningful alternative text in ${file}: ${imageTag[0]}`);
    }
  }

  for (const reference of localReferences) {
    const filePart = reference.split('#')[0];
    if (!filePart) continue;
    try {
      await stat(path.join(outputDir, filePart));
    } catch {
      throw new Error(`Broken local reference in ${file}: ${reference}`);
    }
  }
}

console.log(`Moreira Tech site build completed: ${outputDir}`);


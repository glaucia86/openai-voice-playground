import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skippedDirectories = new Set([
  ".git",
  ".next",
  ".jekyll-cache",
  "_site",
  "coverage",
  "node_modules",
  "vendor",
]);

async function collectMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdown(absolute)));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
  }
  return files;
}

function withoutCodeFences(markdown) {
  let fenced = false;
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return "";
      }
      return fenced ? "" : line;
    })
    .join("\n");
}

function extractTargets(markdown) {
  const targets = [];
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    targets.push(match[1]);
  }
  for (const match of markdown.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    targets.push(match[1]);
  }
  return targets;
}

function normalizeTarget(raw) {
  let target = raw.trim();
  if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
  if (!target.includes(" ")) return target;
  const title = target.match(/^(\S+)\s+["'][^"']*["']$/);
  return title ? title[1] : target;
}

function slugHeadings(markdown) {
  const slugs = new Set();
  const counts = new Map();
  const source = withoutCodeFences(markdown);

  for (const match of source.matchAll(/\bid=["']([^"']+)["']/g)) {
    slugs.add(match[1].toLowerCase());
  }

  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    let slug = heading[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/[`*_~\[\]]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
      .replace(/\s/g, "-");
    const occurrence = counts.get(slug) ?? 0;
    counts.set(slug, occurrence + 1);
    if (occurrence) slug = `${slug}-${occurrence}`;
    slugs.add(slug);
  }

  return slugs;
}

const markdownFiles = await collectMarkdown(root);
const contents = new Map();
const errors = [];

for (const file of markdownFiles) {
  contents.set(file, await readFile(file, "utf8"));
}

for (const [sourceFile, markdown] of contents) {
  const visibleMarkdown = withoutCodeFences(markdown);
  for (const rawTarget of extractTargets(visibleMarkdown)) {
    const target = normalizeTarget(rawTarget);
    if (
      !target ||
      /^(https?:|mailto:|tel:|data:|javascript:)/i.test(target) ||
      target.includes("{{")
    ) {
      continue;
    }

    const [rawPath, rawFragment = ""] = target.split("#", 2);
    const fragment = decodeURIComponent(rawFragment).toLowerCase();
    const targetFile = rawPath
      ? path.resolve(path.dirname(sourceFile), decodeURIComponent(rawPath))
      : sourceFile;

    try {
      const targetStats = await stat(targetFile);
      if (fragment && targetStats.isFile() && targetFile.endsWith(".md")) {
        const targetMarkdown = contents.get(targetFile) ?? (await readFile(targetFile, "utf8"));
        if (!slugHeadings(targetMarkdown).has(fragment)) {
          errors.push(
            `${path.relative(root, sourceFile)} -> ${target}: anchor does not exist`,
          );
        }
      }
    } catch {
      errors.push(`${path.relative(root, sourceFile)} -> ${target}: target does not exist`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${markdownFiles.length} Markdown files: links and anchors resolve.`);
}

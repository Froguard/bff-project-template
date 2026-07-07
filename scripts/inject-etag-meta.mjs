import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const appOutputDir = join(process.cwd(), ".next", "server", "app");

function resolveGitCommitSha() {
  const envSha =
    process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? process.env.COMMIT_SHA;

  if (envSha) {
    return envSha;
  }

  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function listHtmlFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);

    if (statSync(fullPath).isDirectory()) {
      return listHtmlFiles(fullPath);
    }

    return fullPath.endsWith(".html") ? [fullPath] : [];
  });
}

const gitCommitSha = escapeHtmlAttribute(resolveGitCommitSha());
const etagMeta = `<meta http-equiv="etag" content="${gitCommitSha}">`;
const existingEtagMetaPattern = /<meta\s+http-equiv=["']etag["'][^>]*\/?>/gi;
const htmlFiles = listHtmlFiles(appOutputDir);

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  const htmlWithoutExistingEtag = html.replace(existingEtagMetaPattern, "");
  const htmlWithEtag = htmlWithoutExistingEtag.replace(/<head>/i, `<head>${etagMeta}`);

  writeFileSync(htmlFile, htmlWithEtag);
}

console.log(`Injected etag meta into ${htmlFiles.length} HTML file(s): ${gitCommitSha}`);

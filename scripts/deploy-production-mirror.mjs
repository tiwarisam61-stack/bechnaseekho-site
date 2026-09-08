import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const sourceRoot = resolve(new URL("..", import.meta.url).pathname);
const mirrorRepo = process.env.PRODUCTION_MIRROR_REPO ?? "https://github.com/tiwarisam61-stack/bechnaseekho-site.git";
const tmpRoot = mkdtempSync(join(tmpdir(), "bechnaseekho-prod-"));
const mirrorRoot = join(tmpRoot, "site");

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(" ")}`);
  execFileSync(command, args, {
    cwd: options.cwd ?? sourceRoot,
    stdio: "inherit",
    env: { ...process.env, ...options.env },
  });
}

function exportTrackedFilesToMirror() {
  for (const item of readdirSync(mirrorRoot)) {
    if (item === ".git") continue;
    rmSync(join(mirrorRoot, item), { recursive: true, force: true });
  }

  const archivePath = join(tmpRoot, "source.tar");
  run("git", ["archive", "--format=tar", "--output", archivePath, "HEAD"]);
  run("tar", ["-xf", archivePath, "-C", mirrorRoot]);
}

try {
  run("git", ["clone", "--depth", "1", mirrorRepo, mirrorRoot]);
  exportTrackedFilesToMirror();

  run("git", ["status", "--short"], { cwd: mirrorRoot });

  const hasChanges = execFileSync("git", ["status", "--short"], { cwd: mirrorRoot }).toString().trim().length > 0;
  if (!hasChanges) {
    console.log("No production mirror changes to deploy.");
    process.exit(0);
  }

  const sourceCommit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: sourceRoot }).toString().trim();
  run("git", ["add", "-A"], { cwd: mirrorRoot });
  run("git", ["commit", "-m", `Deploy source ${sourceCommit}`], { cwd: mirrorRoot });
  run("git", ["push", "origin", "main"], { cwd: mirrorRoot });

  console.log("Production mirror pushed. Netlify will build from the updated mirror main branch.");
} finally {
  if (existsSync(tmpRoot)) rmSync(tmpRoot, { recursive: true, force: true });
}

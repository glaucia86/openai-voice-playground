import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const compilerPath = join(
  process.cwd(),
  "node_modules",
  "typescript7",
  "bin",
  "tsc",
);

if (!existsSync(compilerPath)) {
  console.error(
    "TypeScript 7 não foi encontrado. Execute `npm install` antes do typecheck.",
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [compilerPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

if (result.error) {
  console.error(`Não foi possível executar o TypeScript 7: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);

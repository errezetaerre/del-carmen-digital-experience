import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const project = fileURLToPath(new URL("../../", import.meta.url));

// Local tooling only: load the actual TypeScript configuration/handlers without
// a second copy of their validation logic. Never imported by application code.
export function serverModules(mocks = new Map()) {
    const cache = new Map();
    function load(path) {
        const filename = [path, `${path}.ts`, `${path}.tsx`, `${path}.json`, resolve(path, "index.ts")]
            .find(candidate => existsSync(candidate) && statSync(candidate).isFile());
        assert.ok(filename, `Missing module: ${path}`);
        if (cache.has(filename)) return cache.get(filename).exports;
        const source = readFileSync(filename, "utf8");
        if (filename.endsWith(".json")) return JSON.parse(source);
        const output = ts.transpileModule(source, { compilerOptions: {
            module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
        } }).outputText;
        const compiled = { exports: {} };
        cache.set(filename, compiled);
        const dependency = name => {
            if (mocks.has(name)) return mocks.get(name);
            // The marker is enforced by Next's server/client compiler. This
            // loader runs exclusively as local Node tooling, never in a client.
            if (name === "server-only") return {};
            if (name.startsWith("@/")) return load(resolve(project, "src", name.slice(2)));
            if (name.startsWith(".")) return load(resolve(dirname(filename), name));
            return require(name);
        };
        new Function("require", "module", "exports", output)(dependency, compiled, compiled.exports);
        return compiled.exports;
    }
    return path => load(resolve(project, path));
}

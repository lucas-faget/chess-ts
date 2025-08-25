import { defineConfig } from "vite";
import { glob } from "glob";
import path from "path";

const entryPoints = glob.sync("src/**/*.ts");

export default defineConfig({
    build: {
        target: "ESNext",
        emptyOutDir: true,
        preserveModules: true,
        sourcemap: true,
        rollupOptions: {
            input: entryPoints,
            output: {
                dir: "dist",
                format: "esm",
                entryFileNames: ({ name, facadeModuleId }) => {
                    if (!facadeModuleId) return `${name}.js`;
                    const relativePath = path.relative(path.resolve(__dirname, "src"), facadeModuleId);
                    return relativePath.replace(/\.ts$/, ".js");
                },
            },
        },
    },
});

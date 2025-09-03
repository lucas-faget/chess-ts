import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "chess",
            formats: ["es"], // ESM
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: [],
        },
        sourcemap: true,
    },
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});

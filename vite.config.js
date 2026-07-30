import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';

/** Remove type="module" from inlined script so file:// delivery works. */
function stripModuleTypePlugin() {
  return {
    name: 'strip-module-type',
    closeBundle() {
      const htmlPath = path.resolve('dist', 'index.html');
      if (!fs.existsSync(htmlPath)) return;
      let html = fs.readFileSync(htmlPath, 'utf8');
      html = html
        .replace(/<script type="module" crossorigin>/g, '<script>')
        .replace(/<script type="module">/g, '<script>');
      fs.writeFileSync(htmlPath, html);
    },
  };
}

export default defineConfig({
  plugins: [viteSingleFile(), stripModuleTypePlugin()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        name: 'GemRush',
      },
    },
  },
});

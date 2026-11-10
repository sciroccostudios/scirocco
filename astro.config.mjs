import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import { visualizer } from 'rollup-plugin-visualizer';

// Bundle report is opt-in: `ANALYZE=1 npm run build`. It must never land in
// dist/, which is published as-is.
const analyze = process.env.ANALYZE
  ? [visualizer({ filename: './.stats/bundle.html', gzipSize: true, brotliSize: true })]
  : [];

// https://astro.build/config
export default defineConfig({
  // Drives every canonical URL, og:url and sitemap entry.
  site: 'https://sciroccostudios.com',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false }
    }),
    react(),
    sitemap(),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
          // Strips React's `<!-- -->` text separators. Keep adjacent JSX
          // expressions out of markup or hydration breaks in the build only.
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      },
      Image: false,
      JavaScript: true,
      SVG: true
    })
  ],
  output: 'static',
  devToolbar: {
    enabled: false
  },
  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
    split: true
  },
  compressHTML: true,
  scopedStyleStrategy: 'class',
  server: {
    host: true,
    port: 4323
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    formats: ['avif', 'webp'],
    quality: {
      avif: 80,
      webp: 85,
      jpg: 85,
      png: 90
    }
  },
  vite: {
    ssr: {
      noExternal: ['framer-motion']
    },
    server: {
      host: true
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // Keep console.error/warn so production failures stay diagnosable.
          drop_console: ['log', 'info', 'debug'],
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      cssMinify: 'lightningcss',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        plugins: analyze,
        output: {
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? '';
            let extType = name.split('.').pop();
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(name)) {
              extType = 'images';
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              extType = 'fonts';
            }
            return `_astro/${extType}/[name]-[hash][extname]`;
          }
        }
      },
      treeShake: {
        preset: 'recommended'
      },
      sourcemap: false,
      target: 'es2020',
      modulePreload: {
        polyfill: true
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'react-simple-maps'],
      exclude: ['@astrojs/react']
    }
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});

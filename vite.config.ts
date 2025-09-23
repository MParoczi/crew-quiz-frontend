import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enhanced cache busting configuration
    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications', '@mantine/form'],
          tanstack: ['@tanstack/react-query'],
          router: ['react-router-dom'],
          icons: ['@tabler/icons-react'],
          utils: ['jotai', 'md5', '@microsoft/signalr']
        },
        // Enhanced filename patterns with content hashes
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organize assets by type for better cache management
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Optimize chunk size for better caching
    chunkSizeWarningLimit: 1000,
    // Ensure source maps are generated for debugging but with cache-friendly names
    sourcemap: false,
    // Enable CSS code splitting for better caching
    cssCodeSplit: true,
    // Minify for production with cache-friendly output
    minify: 'esbuild',
    // Target modern browsers for better optimization
    target: 'es2020'
  }
});

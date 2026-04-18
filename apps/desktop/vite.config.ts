import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        electron([
            {
                entry: 'electron/main.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        minify: mode === 'production',
                        sourcemap: mode !== 'production',
                        rollupOptions: {
                            external: ['electron'],
                            output: {
                                format: 'cjs',
                            },
                        },
                    },
                },
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    options.reload();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        sourcemap: mode !== 'production' ? 'inline' : false,
                        rollupOptions: {
                            external: ['electron'],
                            output: {
                                format: 'cjs',
                                entryFileNames: '[name].cjs',
                            },
                        },
                    },
                },
            },
        ]),
        renderer(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    markdown: ['react-markdown', 'react-syntax-highlighter'],
                },
            },
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
    },
}));

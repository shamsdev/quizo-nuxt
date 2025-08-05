import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    devServer: {
        port: 3001
    },
    runtimeConfig: {
        public: {
            serverEndpoint: process.env.SERVER_ENDPOINT
        }
    },
    css: ['@/assets/styles/fonts.css', '@/assets/styles/confetti.css'],
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
        '@vite-pwa/nuxt',
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Quizo!',
            short_name: 'Quizo!',
            description: 'Awesome Quiz Game!',
            theme_color: '#ec592a',
            background_color: '#ffffff',
            icons: [
                {
                    src: '/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: '/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        workbox: {
            navigateFallback: null,
            skipWaiting: true,
            clientsClaim: true,
        },
        devOptions: {
            enabled: true
        },
        client: {
            installPrompt: true,
        },
    },
})

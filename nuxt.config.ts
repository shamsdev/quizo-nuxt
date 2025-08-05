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
        '@vite-pwa/nuxt',
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
        //...
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
            start_url: '/',
            display: 'fullscreen',
            background_color: '#ec592a',
            theme_color: '#ec592a',
            icons: [
                {
                    src: '/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        },
        workbox: {
            // optional caching strategies
        }
    }
})

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
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.svg'],
        manifest: {
            name: 'Quizo!',
            short_name: 'Quizo!',
            description: 'Awsomee Quiz Game!',
            theme_color: '#c16f18',
            background_color: '#c16f18',
            display: 'standalone',
            start_url: '/',
        }
    }
})

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
        //...
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})

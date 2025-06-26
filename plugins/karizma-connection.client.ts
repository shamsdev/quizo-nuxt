import {defineNuxtPlugin} from "#app";
import {Connection} from '@karizma-studio/karizma-connection-js';

export default defineNuxtPlugin((nuxtApp) => {

    const connection = new Connection();

    return {
        provide: {
            karizmaConnection: {
                connection,
            },
        },
    };
});

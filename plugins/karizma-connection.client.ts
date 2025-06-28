import { defineNuxtPlugin, useRouter } from '#app';
import { Connection } from '@karizma-studio/karizma-connection-js';

export default defineNuxtPlugin(() => {
    const router = useRouter();
    const connection = new Connection();

    // Mutable handler container
    const handlers = {
        onDisconnected: () => {}
    };

    // Attach a single listener forever
    connection.onDisconnected(() => {
        handlers.onDisconnected();
    });

    const handleDisconnection = () => {
        useDialogManager.closeAll();
        useMessageDialog.show({
            title: 'Disconnected',
            message: 'Connection lost. Please check your internet connection and retry.',
            buttons: [
                {
                    text: 'Reconnect',
                    color: '#e74c3c',
                    onClick: () => router.replace('/')
                }
            ]
        });
    };

    const registerCallbacks = () => {
        handlers.onDisconnected = handleDisconnection;
    };

    const unregisterCallbacks = () => {
        handlers.onDisconnected = () => {};
    };

    return {
        provide: {
            karizmaConnection: {
                connection,
                registerCallbacks,
                unregisterCallbacks
            }
        }
    };
});

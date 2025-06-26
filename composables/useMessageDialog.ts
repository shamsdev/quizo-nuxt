import mitt from 'mitt';

const emitter = mitt();

export const useMessageDialog = {
    onCall: undefined,

    /**
     * Show dialog from anywhere
     * @param dialogData { title: string, message: string, buttons: Button[] }
     */
    show(dialogData) {
        emitter.emit('show-message-dialog', dialogData);
    },

    /**
     * Register the handler (should be called once in App.vue or Layout)
     * @param handler Function(dialogData)
     */
    register(handler) {
        this.onCall = handler
        emitter.on('show-message-dialog', handler);
    },

    /**
     * Unregister the handler (optional)
     */
    unregister() {
        if (this.onCall) {
            emitter.off('show-message-dialog', this.onCall);
            this.onCall = undefined;
        }
    }
}

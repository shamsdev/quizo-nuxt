import mitt from 'mitt';

type DialogEvents = {
    'close-all-dialogs': void;
};

const emitter = mitt<DialogEvents>();

export const useDialogManager = {
    closeAll: () => {
        emitter.emit('close-all-dialogs');
    },
    onCloseAll: (handler: () => void) => {
        emitter.on('close-all-dialogs', handler);
    },
    offCloseAll: (handler: () => void) => {
        emitter.off('close-all-dialogs', handler);
    }
};

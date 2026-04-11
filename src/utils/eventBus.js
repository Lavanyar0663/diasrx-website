const CHANNEL_NAME = 'DIASRX_GLOBAL_SYNC';

// Create a BroadcastChannel for cross-tab communication
// Fallback to a simple internal listener if BroadcastChannel is not supported
let channel;
const listeners = new Set();

try {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
        channel = new window.BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event) => {
            const { type, data } = event.data;
            listeners.forEach(callback => callback(type, data));
        };
    }
} catch (err) {
    console.warn('BroadcastChannel not supported in this environment.', err);
}

export const eventBus = {
    /**
     * Emit a global event across all tabs
     */
    emit: (type, data = null) => {
        // Notify current tab listeners first
        listeners.forEach(callback => callback(type, data));
        
        // Notify other tabs
        if (channel) {
            channel.postMessage({ type, data });
        }
    },

    /**
     * Subscribe to global events
     * @returns {Function} unsubscribe function
     */
    on: (callback) => {
        listeners.add(callback);
        return () => {
            listeners.delete(callback);
        };
    }
};

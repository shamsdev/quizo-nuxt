export default defineNuxtRouteMiddleware((to, from) => {

    const {$karizmaConnection} = useNuxtApp();

    // if (!import.meta.client)
    //     return;

    if (to.path === '/')
        return;

    console.log('from:', from.path);
    console.log('to:', to.path);

    const isConnectionInitialized = $karizmaConnection
        && $karizmaConnection.connection
        && $karizmaConnection.connection.isConnected;

    if (!isConnectionInitialized)
        return navigateTo({
            path: '/',
            query: {
                ...to.query,
                origin: to.path.replaceAll('/', '')
            }
        });
});
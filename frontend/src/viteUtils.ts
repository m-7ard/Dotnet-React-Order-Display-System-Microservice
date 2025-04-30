export const getLocalUrl = (path: string) => {
    return new URL(
        path,
        import.meta.url,
    ).href
}

export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL;
};

export const getWebsocketUrl = () => {
    return import.meta.env.VITE_WEBSOCKET_URL;
};

export const getFileServerUrl = () => {
    return import.meta.env.VITE_FILE_SERVER_URL;
};

export const getAuthUrl = () => {
    return import.meta.env.VITE_AUTH_URL;
};

export const getLogoutUrl = () => {
    return import.meta.env.VITE_LOGOUT_URL;
};

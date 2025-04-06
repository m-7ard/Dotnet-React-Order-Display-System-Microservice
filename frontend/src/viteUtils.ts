export const getLocalUrl = (path: string) => {
    return new URL(
        path,
        import.meta.url,
    ).href
}

export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL;
};

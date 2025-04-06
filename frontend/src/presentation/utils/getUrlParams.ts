// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUrlParams(params: Record<string, any>): URLSearchParams {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([name, value]) => {
        if (value == null) return;
        if (value instanceof Date) {
            urlParams.append(name, value.toISOString());
        } else {
            urlParams.append(name, `${value}`);
        }
    });

    return urlParams;
}

export default getUrlParams;

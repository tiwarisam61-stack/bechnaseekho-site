const DEFAULT_AUTH_HOST = "https://bechnaseekho.com";

function stripTrailingSlash(value: string): string {
    return value.replace(/\/+$/, "");
}

function getConfiguredAuthHost(): string {
    const configured = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
    if (configured && configured.trim().length > 0) {
        return stripTrailingSlash(configured.trim());
    }

    if (typeof window !== "undefined") {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (isLocal) return stripTrailingSlash(window.location.origin);
    }

    return DEFAULT_AUTH_HOST;
}

export function getAuthRedirectUrl(path = "/careersync"): string {
    const host = getConfiguredAuthHost();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${host}${normalizedPath}`;
}

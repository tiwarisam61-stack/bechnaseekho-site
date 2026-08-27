type SupabaseLikeError = {
    message?: string;
    code?: string | number;
    error_code?: string;
};

export function toAuthUserMessage(error: SupabaseLikeError | null | undefined, fallback: string): string {
    if (!error) return fallback;

    const message = (error.message || "").toLowerCase();
    const errorCode = String(error.error_code || error.code || "").toLowerCase();

    if (message.includes("unsupported provider") || message.includes("missing oauth secret")) {
        return "Google login is not configured yet. Please enable Google provider in Supabase Auth settings (Client ID and Secret).";
    }

    if (errorCode.includes("validation_failed") && message.includes("provider")) {
        return "OAuth provider validation failed in Supabase. Please check Google provider credentials and allowed redirect URLs.";
    }

    return error.message || fallback;
}

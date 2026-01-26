

export function ok(data = null) {
    return {
        success: true,
        data,
    };
}

export function fail(code, message) {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
        },
    };
}  
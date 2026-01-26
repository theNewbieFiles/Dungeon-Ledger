export function mapErrorToStatus(error) {
    switch (error.code) {
    case "INVALID_CREDENTIALS":
        return 401; // Unauthorized
    case "BAD_REQUEST":
        return 400; // Bad Request
    case "NOT_FOUND":
        return 404; // Not Found        
    case "FORBIDDEN":
        return 403; // Forbidden
    default:
        return 500; // Internal Server Error
    }
}
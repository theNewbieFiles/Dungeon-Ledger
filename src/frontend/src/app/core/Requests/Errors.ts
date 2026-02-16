

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

export class RetryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RetryError";
    }   
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

export class MissingURLError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingURLError";
    }   
}

export class FetchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FetchError";
    }
}

export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }   
}

export class RetryLimitReachedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RetryLimitReachedError";
    }   
}

export class BackendDownError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BackendDownError";
    }
}

export class jsonParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "jsonParseError";
    }   
}

export class MissingTokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingTokenError";
    }   
}
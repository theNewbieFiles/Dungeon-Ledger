import z from "zod";

export function createSystemSettings(rawSettings: ISettings) {
    const schema = z.object({
        apiBaseUrl: z.url(),
        websocketUrl: z.url(),
        maxRetryCount: z.int().min(0),
        requestTimeoutMs: z.int().min(100),
        enableDebugLogs: z.boolean(),
        secured: z.boolean(), 
    });

    let settings: ISettings;

    try {
        settings = schema.parse(rawSettings);
    } catch (error) { }

    //get a setting
    function get<K extends keyof ISettings>(key: K): ISettings[K] | undefined {
        return settings?.[key];
    }

    return {
        get,
    }
}

export interface ISystemSettings { get<K extends keyof ISettings>(key: K): ISettings[K]; }

export interface ISettings {
    apiBaseUrl: string;
    websocketUrl: string;
    secured: boolean;
    maxRetryCount: number;
    requestTimeoutMs: number;
    enableDebugLogs: boolean;
}

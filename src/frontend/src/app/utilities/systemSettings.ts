import z from "zod";

export function createSystemSettings(rawSettings: Settings): SystemSettings {
    const schema = z.object({
        apiBaseUrl: z.string(),
        websocketUrl: z.string(),
        maxRetryCount: z.int(),
        requestTimeoutMs: z.int(),
        enableDebugLogs: z.boolean(),
        secured: z.boolean(), 
    });

    let settings: Settings;

    try {
        settings = schema.parse(rawSettings);
    } catch (error) { 
        throw new Error("Failed Validation")
     }

    //get a setting
    function get<K extends keyof Settings>(key: K): Settings[K] {
        return settings[key];
    }

    return {
        get,
    }
}

export interface SystemSettings { get<K extends keyof Settings>(key: K): Settings[K]; }

export interface Settings {
    apiBaseUrl: string;
    websocketUrl: string;
    secured: boolean;
    maxRetryCount: number;
    requestTimeoutMs: number;
    enableDebugLogs: boolean;
}

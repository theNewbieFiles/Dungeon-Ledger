import z from "zod";

export function createSystemSettings(rawSettings: ISettings): ISystemSettings {
    const schema = z.object({
        apiBaseUrl: z.string(),
        websocketUrl: z.string(),
        maxRetryCount: z.int(),
        requestTimeoutMs: z.int(),
        enableDebugLogs: z.boolean(),
        secured: z.boolean(), 
    });

    let settings: ISettings;

    try {
        settings = schema.parse(rawSettings);
    } catch (error) { 
        console.error(error); 
        //throw new Error("Failed Validation")
     }

    //get a setting
    function get<K extends keyof ISettings>(key: K): ISettings[K] {
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

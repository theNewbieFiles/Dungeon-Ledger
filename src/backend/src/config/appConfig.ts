export interface AppConfigShape { 
    Token_TTL_Days: number; 
    Refresh_Token_Length: number; 
    ACCESS_TOKEN_TTL: string; 
}


const appConfig: AppConfigShape = {
    //token data
    Token_TTL_Days: 7, // the number of days until a refresh token expires
    
    Refresh_Token_Length: 64, // length in bytes of the refresh token
    
    ACCESS_TOKEN_TTL: "1h", //how long access tokens are valid or "10m", "5m", etc.

}; 



export default appConfig;
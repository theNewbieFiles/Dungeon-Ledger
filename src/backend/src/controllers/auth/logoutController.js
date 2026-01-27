import logoutService from "../../services/auth/logoutService.js";
import { mapErrorToStatus } from "../../utilities/mapErrorToStatus.js";


async function logoutController(req, res) {
    try {
        
        const cookie = req.cookies.refreshToken;

        //check cookie signature
        if (!cookie || !cookie.lookupID || !cookie.refreshToken) { 
            return res.status(401).json({ error: "Not authenticated" }); 
        }

        //attempt to invalidate the token.
        const response = await logoutService(cookie.lookupID, cookie.refreshToken);

        if (!response.success) {
            return res
                .status(mapErrorToStatus(response.error))
                .json({ error: response.error.message });
        }

        //delete cookie
        res.clearCookie("refreshToken"); 

        return res.sendStatus(204);


    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};  
 


export default logoutController; 
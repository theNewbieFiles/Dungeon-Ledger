import { Navigate } from "react-router-dom";
import { useAuthState } from "../../hooks/useAuthState";


export function Login() {
    const authState = useAuthState();

    //if user is already logged in redirect to home page. 
    if (authState === "authenticated") {
        return <Navigate to="/home" replace />;
    }

    return (
        <>
            login
        </>
    )
}
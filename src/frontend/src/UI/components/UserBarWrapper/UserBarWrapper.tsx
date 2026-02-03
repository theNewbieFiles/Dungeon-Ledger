import "./UserBarWrapper.css";
import { authenticated } from "../../../app/core/AuthSystem";
import { useAuthState } from "../../hooks/useAuthState";
import { AuthUserMenu } from "../Auth-UserMenu/Auth-UserMenu";
import { useNavigate } from "react-router-dom";
import { UnauthUserBar } from "../Unauth-Userbar/Unauth-UserBar";

export function UserBarWrapper() {
  const navigate = useNavigate();
  const authState = useAuthState();
  return (
    <div className="userbar-container">
      
      {authState === authenticated ? <AuthUserMenu /> : <UnauthUserBar />}
    </div>
  );
}

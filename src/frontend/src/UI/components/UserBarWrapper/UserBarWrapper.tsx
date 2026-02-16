import "./UserBarWrapper.css";
import { AuthStatus } from "../../../app/core/AuthSystem";
import { AuthUserMenu } from "../UserMenu-Auth/UserMenu-Auth";
import { useNavigate } from "react-router-dom";
import { UnauthUserBar } from "../UserBar-Unauth/UserBar-Unauth";
import { DungeonLedger } from "../../../app";

export function UserBarWrapper() {
  const navigate = useNavigate();

  const dl = DungeonLedger.get();
  const authState = dl.getAuthSystem().getStatus();

  return (
    <div className="userbar-container">
      {authState === AuthStatus.Authenticated ? (
        <AuthUserMenu />
      ) : (
        <UnauthUserBar />
      )}
    </div>
  );
}

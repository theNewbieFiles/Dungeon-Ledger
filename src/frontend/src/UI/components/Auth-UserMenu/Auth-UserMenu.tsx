import { Button } from "../Button/Button";
import { Logo } from "../logo/Logo";
import "./Auth-UserMenu.css";

import dungeonLedger from "../../../app/index";

export function AuthUserMenu() {
  const logoffBtnHandler = () => {
    dungeonLedger.authSystem.logoff();
  };

  return (
    <div className="userbar auth-menu">
      <div className="userbar-left">
        <Logo />
      </div>

      <div className="userbar-right">
        <Button variant="primary" size="md" onClick={logoffBtnHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
}    
  
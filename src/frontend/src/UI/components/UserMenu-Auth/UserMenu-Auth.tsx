import { Button } from "../Button/Button";
import { Logo } from "../logo/Logo";
import "./UserMenu-Auth.css";

import {DungeonLedger} from "../../../app/index";
import { CampaignMenu } from "../megaMenu/campaignMenu/CampaignMenu";
import { CharacterMenu } from "../megaMenu/characterMenu/CharacterMenu";


export function AuthUserMenu() {
  const dungeonLedger = DungeonLedger.get();

  const logoffBtnHandler = () => {
    dungeonLedger.getAuthSystem().logoff();
  };

  return (
    <div className="userbar auth-menu">
      <div className="userbar-left">
        <Logo />

        <CampaignMenu />

        <CharacterMenu />
      </div>

      <div className="userbar-right">
        <Button variant="primary" size="md" onClick={logoffBtnHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
}    
  

import { useNavigate } from "react-router-dom";
import { DropDownMenu } from "../../DropDown/DropDownMenu";

export function CampaignMenu() {

    const navigate = useNavigate();
  return (
    <DropDownMenu trigger={<div>Campaigns</div>}>
      <a onClick={() => navigate("/campaigns")}>My Campaigns</a>
      <a onClick={() => navigate("/maps")}>My Maps</a>
      <a onClick={() => navigate("/mapeditor")}>Map Editor</a>
      <div>Shared with me</div>
    </DropDownMenu>
  );
}

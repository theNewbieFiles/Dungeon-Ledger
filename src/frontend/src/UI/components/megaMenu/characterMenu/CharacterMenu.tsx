import { DropDownMenu } from "../../DropDown/DropDownMenu";


export function CharacterMenu() {
    return (
        <DropDownMenu trigger = {<div>Characters</div>}>
          <div>Characters </div>
          <div>Shared with me</div>
        </DropDownMenu>
    )
}
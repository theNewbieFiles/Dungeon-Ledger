import "./MenuBar.css";
import { useMenuBar } from "./MenuBarProvider";

export function Menu({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children?: React.ReactNode;
}) {
  const { openMenu, setOpenMenu } = useMenuBar();
  const isOpen = openMenu === id;

  return (
    <div
      className="menu"
      onMouseEnter={() => setOpenMenu(id)}
      onClick={() => setOpenMenu(isOpen ? null : id)}
    >
      <div className="menu-label">{label}</div>

      {isOpen && <div className="menu-list">{children}</div>}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "./DropDownMenu.css";
import { createPortal } from "react-dom";

export function DropDownMenu({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  

  //close on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  return (
    <div className="dropdown" ref={ref}>
      <div className="dropdown-trigger"
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            onMouseOver={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="dropdown-menu"
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}

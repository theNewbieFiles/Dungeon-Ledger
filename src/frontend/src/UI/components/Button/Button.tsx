import "./Button.css";
import type { PropsWithChildren, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps =
  PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: Variant;
      size?: Size;
      loading?: boolean;
    }
  >;


export function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false, 
    disabled = false,

    ...props
}: ButtonProps) {

    const className = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    loading && "btn--loading",
  ]
    .filter(Boolean)
    .join(" ");

    return (
    <button
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="btn__spinner" /> : children}
    </button>
  );

}  
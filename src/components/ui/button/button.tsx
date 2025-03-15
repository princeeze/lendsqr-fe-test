import { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./button.module.scss";

type ButtonProps = {
  variant?: "primary" | "secondary" | "destructive";
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

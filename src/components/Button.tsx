import { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

interface IButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type: string;
}

export default function Button({ children, onClick, type }: IButtonProps) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}

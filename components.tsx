import { clsx } from ".";

export function Button({ label, children, className, ...props }: ButtonProps) {
  return (
    <button className={clsx(className, `cursor-pointer`)} {...props}>
      {label || children}
    </button>
  );
}

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLButtonElement>;

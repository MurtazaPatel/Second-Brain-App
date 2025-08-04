
import React from "react";
import { ModalTrigger } from "../components/ui/animated-modal"; // Adjust path to your modal system

export type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type Variant = "primary" | "secondary";

type VariantStyles = Record<Variant, { body: string; icon: string }>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant: Variant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon: Icon;
  endIcon?: Icon;
  withModal?: boolean;
  loading?: boolean;
}

const variantStyles: VariantStyles = {
  primary: {
    body: "bg-purple-600 text-white rounded-lg px-4 py-2 m-2 flex justify-center items-center gap-2 backdrop-blur-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-[0_4px_14px_rgba(147,51,234,0.4)]",
    icon: "text-white h-5 w-5",
  },
  secondary: {
    body: "bg-purple-300 text-purple-500 rounded-lg px-4 py-2 m-2 flex justify-center items-center gap-2 backdrop-blur-sm transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-[0_4px_14px_rgba(192,132,252,0.4)]",
    icon: "h-5 w-5 text-purple-500",
  },
};

export function Button(props: ButtonProps) {
  const { text, variant, startIcon: StartIcon, onClick, withModal, loading, ...rest } = props;

  const content = (
    <button
      className={`${variantStyles[variant].body} ${loading ? "cursor-wait opacity-70" : "cursor-pointer"}`}
      onClick={onClick}
      disabled={loading}
      {...rest}
    >
      <StartIcon className={variantStyles[variant].icon} />
      <div>{text}</div>
    </button>
  );

  return withModal ? <ModalTrigger>{content}</ModalTrigger> : content;
}
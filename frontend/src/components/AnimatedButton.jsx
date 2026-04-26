import { useState } from "react";
import { useSound } from "../sounds/SoundProvider";

const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { play } = useSound();

  const variants = {
    primary:
      "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30",
    secondary:
      "bg-secondary-400 hover:bg-secondary-500 text-gray-800 shadow-lg shadow-secondary-400/30",
    success:
      "bg-success-500 hover:bg-success-600 text-white shadow-lg shadow-success-500/30",
    error:
      "bg-error-500 hover:bg-error-600 text-white shadow-lg shadow-error-500/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-3xl",
  };

  const handleClick = (e) => {
    if (disabled) return;
    play("click");
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        font-bold cursor-pointer select-none
        transition-all duration-200 ease-out
        hover:scale-105 hover:-translate-y-0.5
        active:scale-95 active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${isPressed ? "animate-pop" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;

import { motion } from "framer-motion";

function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  // You can customize these as needed or remove them if not used
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    error: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-black hover:bg-yellow-600",
    // Add more as needed
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const buttonClass = `rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed \
    ${variantClasses[variant] || variantClasses.default} \
    ${sizeClasses[size] || sizeClasses.md} \
    ${className}`;

  const MotionButton = motion.button;

  return (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 mr-2 align-middle border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      )}
      {children}
    </MotionButton>
  );
}

export default Button;

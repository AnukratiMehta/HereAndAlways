import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Shared button component
 *
 * @param {string} variant - primary | secondary | danger | tertiary
 * @param {string} type - button | submit
 * @param {boolean} disabled
 * @param {string} label
 * @param {object} icon - a FontAwesome icon object from icons.js
 * @param {function} onClick
 * @param {string} className
 * @param {JSX.Element} children
 */
const Button = ({
  variant = "primary",
  type = "button",
  disabled = false,
  label,
  icon,
  onClick,
  className = "",
  children,
}) => {
  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = disabled
        ? "bg-brandRose-light text-white cursor-not-allowed"
        : "bg-brandRose text-white hover:bg-brandRose-dark cursor-pointer";
      break;
    case "secondary":
      variantClasses =
        "border border-gray-400 text-gray-700 hover:bg-gray-100";
      break;
    case "danger":
      variantClasses =
        "bg-red-600 text-white hover:bg-red-700";
      break;
    case "tertiary":
      variantClasses = disabled
        ? "bg-white text-brandRose border border-brandRose opacity-50 cursor-not-allowed"
        : "bg-white text-brandRose border border-brandRose hover:bg-brandRose-dark hover:text-white cursor-pointer";
      break;
    default:
      variantClasses = "bg-gray-300 text-black";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {icon && <i className="text-base"><FontAwesomeIcon icon={icon} /></i>}
      {label}
      {children}
    </button>
  );
};

export default Button;

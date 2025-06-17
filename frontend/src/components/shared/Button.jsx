const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', label }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none transition-colors duration-200 hover:cursor-pointer';
  const variants = {
    primary: 'bg-brandRose text-white hover:bg-brandRose-dark',
    secondary: 'bg-lightGray text-charcoal hover:bg-gray-300',
    ghost: 'bg-transparent text-brandRose hover:bg-rose-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label || children}
    </button>
  );
};

export default Button;

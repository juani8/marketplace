import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import classNames from 'classnames';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
}) {
  const baseStyles =
    'inline-flex items-center gap-2 px-4 py-2 rounded font-medium transition focus:outline-none';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={classNames(
        baseStyles,
        variants[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {!loading && Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  icon: PropTypes.elementType,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

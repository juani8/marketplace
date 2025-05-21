import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

export default function ButtonAdd({ onClick, text = 'Añadir', className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition ${className}`}
    >
      <FaPlus />
      {text}
    </button>
  );
}

ButtonAdd.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
};

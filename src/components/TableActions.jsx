import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function TableActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onEdit}
        className="text-green-500 hover:text-green-700"
        title="Editar"
      >
        <FaEdit className="w-4 h-4 md:w-4 md:h-4" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        title="Eliminar"
      >
        <FaTrash className="w-4 h-4 md:w-4 md:h-4" /> 
      </button>
    </div>
  );
}

TableActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function TableActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="text-green-500 hover:text-green-700">
        <FaEdit />
      </button>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        <FaTrash />
      </button>
    </div>
  );
}

TableActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

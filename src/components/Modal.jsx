import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';

export default function StateBadge({ estado }) {
  const colorClasses = estado === 'activo'
    ? 'bg-green-100 text-green-800 border-green-400'
    : 'bg-gray-200 text-gray-700 border-gray-300';

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${colorClasses}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}

StateBadge.propTypes = {
  estado: PropTypes.string.isRequired,
};

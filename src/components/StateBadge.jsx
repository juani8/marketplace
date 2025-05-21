import PropTypes from 'prop-types';

export default function StateBadge({ estado, tipo = 'producto' }) {
  const isDisponible = estado === 'disponible';

  const colorClasses = isDisponible
    ? 'bg-green-100 text-green-800 border-green-400'
    : 'bg-gray-200 text-gray-700 border-gray-300';

  const texto = tipo === 'producto'
    ? (isDisponible ? 'Disponible' : 'No disponible')
    : (estado === 'activo' ? 'Activo' : 'Inactivo');

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold border rounded-full ${colorClasses}`}>
      {texto}
    </span>
  );
}

StateBadge.propTypes = {
  estado: PropTypes.string.isRequired,
  tipo: PropTypes.oneOf(['tenant', 'producto']),
};

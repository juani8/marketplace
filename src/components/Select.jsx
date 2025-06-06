import PropTypes from 'prop-types';

export default function Select({ label, name, value, onChange, options, hasError, disabled = false }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-3 py-2 rounded ${
          hasError ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100 disabled:text-gray-500`}
      >
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
};

import PropTypes from 'prop-types';

export default function Input({ label, name, value, onChange, hasError, type = 'text', disabled = false }) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-3 py-2 rounded ${hasError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring focus:border-blue-300 disabled:bg-gray-100 disabled:text-gray-500`}
        min={type === 'number' ? 0 : undefined}
        step={type === 'number' && name === 'stock' ? 1 : undefined}
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

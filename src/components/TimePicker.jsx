import PropTypes from 'prop-types';

export default function TimePicker({ value, onChange, disabled, hasError }) {
  const getHours = () => {
    return Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
  };

  const getMinutes = () => {
    return ['00', '30'];
  };

  const handleHourChange = (e) => {
    const [currentHour, currentMinute] = value ? value.split(':') : ['00', '00'];
    const newHour = e.target.value;
    onChange(`${newHour}:${currentMinute}`);
  };

  const handleMinuteChange = (e) => {
    const [currentHour] = value ? value.split(':') : ['00'];
    const newMinute = e.target.value;
    onChange(`${currentHour}:${newMinute}`);
  };

  return (
    <div className="flex items-center space-x-1">
      <select
        disabled={disabled}
        value={value ? value.split(':')[0] : '00'}
        onChange={handleHourChange}
        className={`border px-2 py-1 rounded ${hasError ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
      >
        {getHours().map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        disabled={disabled}
        value={value ? value.split(':')[1] : '00'}
        onChange={handleMinuteChange}
        className={`border px-2 py-1 rounded ${hasError ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
      >
        {getMinutes().map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
}

TimePicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
};

TimePicker.defaultProps = {
  disabled: false,
  hasError: false,
};

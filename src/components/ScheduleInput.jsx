import PropTypes from 'prop-types';
import TimePicker from './TimePicker';

const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

export default function ScheduleInput({ horarios, handleChange, disabled }) {
  const handleHorarioChange = (day, field, value) => {
    const updatedHorarios = { ...horarios };

    if (field === 'activo') {
      updatedHorarios[day] = {
        ...updatedHorarios[day],
        activo: value,
        desde: value ? (horarios[day]?.desde || '12:00') : horarios[day]?.desde,
        hasta: value ? (horarios[day]?.hasta || '22:00') : horarios[day]?.hasta,
      };
    } else {
      updatedHorarios[day] = {
        ...updatedHorarios[day],
        [field]: value,
      };
    }

    handleChange({ target: { name: 'configuracion_operativa.horarios', value: updatedHorarios } });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        <label className="block text-m font-medium text-gray-700 mb-0">Horarios de Atención</label>

        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b pb-2"
          >
            <div className="flex items-center gap-2 w-full md:w-1/4">
              <input
                type="checkbox"
                checked={horarios[day]?.activo || false}
                onChange={(e) => handleHorarioChange(day, 'activo', e.target.checked)}
                disabled={disabled}
              />
              <label className="font-medium capitalize">{day}</label>
            </div>

            <div className="flex gap-2 w-full md:w-3/4">
              <TimePicker
                value={horarios[day]?.desde || '12:00'}
                onChange={(value) => handleHorarioChange(day, 'desde', value)}
                disabled={disabled || !horarios[day]?.activo}
                />
              <span className="text-gray-600 font-semibold">-</span>
              <TimePicker
                value={horarios[day]?.hasta || '22:00'}
                onChange={(value) => handleHorarioChange(day, 'hasta', value)}
                disabled={disabled || !horarios[day]?.activo}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ScheduleInput.propTypes = {
  horarios: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

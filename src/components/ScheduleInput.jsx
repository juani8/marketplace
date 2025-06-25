import PropTypes from 'prop-types';

export default function ScheduleInput({ horarios, onChange }) {
  const dias = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
  ];

  const horas = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutos = ['00', '30'];

  const handleCheck = (dia, checked) => {
    const nuevos = {
      ...horarios,
      [dia]: {
        ...horarios[dia],
        activo: checked,
      },
    };
    onChange(nuevos);
  };

  const handleHorarioChange = (dia, tipo, valor) => {
    const nuevos = {
      ...horarios,
      [dia]: {
        ...horarios[dia],
        [tipo]: valor,
      },
    };
    onChange(nuevos);
  };

  return (
    <div className="mt-6">
      <label className="block font-medium mb-2">Horarios por día</label>
      <div className="space-y-2">
        {dias.map((dia) => (
          <div key={dia} className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={horarios[dia]?.activo || false}
              onChange={(e) => handleCheck(dia, e.target.checked)}
            />
            <span className="capitalize w-24">{dia}</span>

            <select
              disabled={!horarios[dia]?.activo}
              value={horarios[dia]?.desde?.split(':')[0] || '09'}
              onChange={(e) =>
                handleHorarioChange(dia, 'desde', `${e.target.value}:${horarios[dia]?.desde?.split(':')[1] || '00'}`)
              }
              className="border rounded px-2 py-1"
            >
              {horas.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            :
            <select
              disabled={!horarios[dia]?.activo}
              value={horarios[dia]?.desde?.split(':')[1] || '00'}
              onChange={(e) =>
                handleHorarioChange(dia, 'desde', `${horarios[dia]?.desde?.split(':')[0] || '09'}:${e.target.value}`)
              }
              className="border rounded px-2 py-1"
            >
              {minutos.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <span className="mx-2">a</span>

            <select
              disabled={!horarios[dia]?.activo}
              value={horarios[dia]?.hasta?.split(':')[0] || '18'}
              onChange={(e) =>
                handleHorarioChange(dia, 'hasta', `${e.target.value}:${horarios[dia]?.hasta?.split(':')[1] || '00'}`)
              }
              className="border rounded px-2 py-1"
            >
              {horas.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            :
            <select
              disabled={!horarios[dia]?.activo}
              value={horarios[dia]?.hasta?.split(':')[1] || '00'}
              onChange={(e) =>
                handleHorarioChange(dia, 'hasta', `${horarios[dia]?.hasta?.split(':')[0] || '18'}:${e.target.value}`)
              }
              className="border rounded px-2 py-1"
            >
              {minutos.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

ScheduleInput.propTypes = {
  horarios: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
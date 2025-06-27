import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const halfHourOptions = (() => {
  const opciones = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      opciones.push(hora);
    }
  }
  return opciones;
})();

const formatearHora = (hora) => {
  if (!hora) return '';
  return hora.length >= 5 ? hora.slice(0, 5) : hora;
};

export default function ScheduleInput({ horarios, onChange }) {
  const [localHorarios, setLocalHorarios] = useState({});

  useEffect(() => {
    // Formateamos todas las horas al montar o al actualizar `horarios`
    const formateado = {};
    for (const dia of diasSemana) {
      const config = horarios[dia] || {};
      formateado[dia] = {
        activo: config.activo || false,
        desde: formatearHora(config.desde || '10:00'),
        hasta: formatearHora(config.hasta || '20:00'),
      };
    }
    setLocalHorarios(formateado);
  }, [horarios]);

  const handleToggle = (dia) => {
    const yaActivo = localHorarios[dia]?.activo;

    const updated = {
      ...localHorarios,
      [dia]: {
        ...localHorarios[dia],
        activo: !yaActivo,
      },
    };

    setLocalHorarios(updated);
    onChange(updated);
  };

  const handleTimeChange = (dia, campo, valor) => {
    const updated = {
      ...localHorarios,
      [dia]: {
        ...localHorarios[dia],
        [campo]: valor,
      },
    };
    setLocalHorarios(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {diasSemana.map((dia) => {
        const config = localHorarios[dia] || { activo: false, desde: '', hasta: '' };
        return (
          <div key={dia} className="flex items-center gap-4">
            <label className="capitalize w-24">{dia}</label>
            <input
              type="checkbox"
              checked={config.activo}
              onChange={() => handleToggle(dia)}
              className="form-checkbox"
            />
            <select
              value={formatearHora(config.desde)}
              onChange={(e) => handleTimeChange(dia, 'desde', e.target.value)}
              className="border rounded px-2 py-1"
              disabled={!config.activo}
            >
              {halfHourOptions.map((hora) => (
                <option key={`desde-${dia}-${hora}`} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
            <span>a</span>
            <select
              value={formatearHora(config.hasta)}
              onChange={(e) => handleTimeChange(dia, 'hasta', e.target.value)}
              className="border rounded px-2 py-1"
              disabled={!config.activo}
            >
              {halfHourOptions.map((hora) => (
                <option key={`hasta-${dia}-${hora}`} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

ScheduleInput.propTypes = {
  horarios: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

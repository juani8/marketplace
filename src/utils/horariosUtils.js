export const DIAS_NUMEROS = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export function obtenerNombreDia(diaNumero) {
  return Object.prototype.hasOwnProperty.call(DIAS_NUMEROS, diaNumero)
    ? DIAS_NUMEROS[diaNumero]
    : '—';
}

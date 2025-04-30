const mockTenants = [
  {
    tenant_id: 1,
    nombre: 'Pizza Nova',
    razon_social: 'Pizza Nova SRL',
    cuenta_bancaria: '1234567890123456789012',
    datos_contacto: {
      email: 'pizzanova@gmail.com',
      tel: '1144223366',
    },
    posee_direccion: true,
    direccion: 'Av. Santa Fe 1234, CABA',
    configuracion_operativa: {
      horarios: {
        lunes: { activo: true, desde: '12:00', hasta: '22:00' },
        martes: { activo: true, desde: '12:00', hasta: '22:00' },
        miércoles: { activo: true, desde: '12:00', hasta: '22:00' },
        jueves: { activo: true, desde: '12:00', hasta: '22:00' },
        viernes: { activo: true, desde: '12:00', hasta: '22:00' },
        sábado: { activo: true, desde: '12:00', hasta: '22:00' },
        domingo: { activo: false, desde: '12:00', hasta: '22:00' },
      },
      tipo_servicio: 'envio',
    },
    catalogo_id: 'CAT123',
    estado: 'activo',
  },
  {
    tenant_id: 2,
    nombre: 'SushiGo',
    razon_social: 'SushiGo SA',
    cuenta_bancaria: '9876543210987654321098',
    datos_contacto: {
      email: 'sushigo@gmail.com',
      tel: '1166778899',
    },
    posee_direccion: false,
    direccion: '', // 👈 si no posee, string vacío
    configuracion_operativa: {
      horarios: {
        lunes: { activo: false, desde: '12:00', hasta: '22:00' },
        martes: { activo: true, desde: '12:00', hasta: '22:00' },
        miércoles: { activo: true, desde: '12:00', hasta: '22:00' },
        jueves: { activo: true, desde: '12:00', hasta: '22:00' },
        viernes: { activo: true, desde: '12:00', hasta: '22:00' },
        sábado: { activo: false, desde: '12:00', hasta: '22:00' },
        domingo: { activo: false, desde: '12:00', hasta: '22:00' },
      },
      tipo_servicio: 'retiro',
    },
    catalogo_id: 'CAT456',
    estado: 'inactivo',
  },
  {
    tenant_id: 3,
    nombre: 'Café Central',
    razon_social: 'Café Central SA',
    cuenta_bancaria: '8634503240987654321098',
    datos_contacto: {
      email: 'cafecentral@gmail.com',
      tel: '1156776029',
    },
    posee_direccion: true,
    direccion: 'Av. Rivadavia 999, CABA',
    configuracion_operativa: {
      horarios: {
        lunes: { activo: true, desde: '12:00', hasta: '22:00' },
        martes: { activo: true, desde: '12:00', hasta: '22:00' },
        miércoles: { activo: false, desde: '12:00', hasta: '22:00' },
        jueves: { activo: true, desde: '12:00', hasta: '22:00' },
        viernes: { activo: true, desde: '12:00', hasta: '22:00' },
        sábado: { activo: false, desde: '12:00', hasta: '22:00' },
        domingo: { activo: false, desde: '12:00', hasta: '22:00' },
      },
      tipo_servicio: 'retiro',
    },
    catalogo_id: 'CAT777',
    estado: 'activo',
  },
];

export default mockTenants;

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import InputRowGrid from './InputRowGrid';
import Button from './Button';
import ProductTable from './ProductTable';
import { getAllProducts } from '../apis/productsService';

export default function PromotionForm({
  formData,
  handleChange,
  handleSubmit,
  error,
  showErrors,
  setShowErrors,
  isLoading,
  editingPromotionId = null,
}) {
  const [validationErrors, setValidationErrors] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);

  useEffect(() => {
    if (!formData) return;
  
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
  
        const enrichedData = data.map((p) => {
          const promociones = p.promociones || [];
  
          const perteneceAPromoActual = promociones.some(
            (promo) => String(promo.promocion_id) === String(editingPromotionId)
          );
  
          return {
            ...p,
            _forzarMostrar: perteneceAPromoActual,
          };
        });
  
        setProducts(enrichedData);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setIsFetchingProducts(false);
      }
    }
  
    fetchProducts();
  }, [editingPromotionId, formData]);
  

  const validate = () => {
    const errors = [];

    if (!formData.nombre.trim()) errors.push('El campo Nombre es obligatorio.');
    if (!formData.tipo_promocion) errors.push('Debe seleccionar un tipo de promoción.');
    if (!formData.valor_descuento || formData.valor_descuento <= 0) {
      errors.push('El descuento debe ser mayor que 0.');
    }
    if (!formData.fecha_inicio) errors.push('Debe seleccionar una fecha de inicio.');
    if (!formData.fecha_fin) errors.push('Debe seleccionar una fecha de fin.');

    const hoy = new Date().setHours(0, 0, 0, 0);
    const fechaInicio = new Date(formData.fecha_inicio).setHours(0, 0, 0, 0);
    const fechaFin = new Date(formData.fecha_fin).setHours(0, 0, 0, 0);

    if (formData.fecha_inicio && fechaInicio < hoy) {
      errors.push('La fecha de inicio no puede ser anterior a hoy.');
    }

    if (formData.fecha_inicio && formData.fecha_fin && fechaFin <= fechaInicio) {
      errors.push('La fecha de finalización debe ser posterior a la fecha de inicio.');
    }

    if (formData.tipo_promocion === 'porcentaje' && formData.valor_descuento > 100) {
      errors.push('El descuento en porcentaje no puede ser mayor que 100%.');
    }

    if (formData.tipo_promocion === 'monto') {
      const productosExcedidos = products.filter(
        (p) =>
          formData.lista_productos.includes(String(p.producto_id)) &&
          formData.valor_descuento > p.precio
      );

      productosExcedidos.forEach((p) =>
        errors.push(
          `El descuento ($${formData.valor_descuento}) no puede ser mayor que el precio de ID:${p.producto_id} "${p.nombre_producto}" ($${p.precio}).`
        )
      );
    }

    if (formData.lista_productos.length === 0) {
      errors.push('Debe seleccionar al menos un producto.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChangeWrapper = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      const parsed = parseFloat(value);
      if (isNaN(parsed) || parsed < 0) return;

      if (
        name === 'valor_descuento' &&
        formData.tipo_promocion === 'porcentaje' &&
        parsed > 100
      ) {
        return;
      }

      handleChange({ target: { name, value: parsed } });
    } else {
      handleChange(e);
    }
  };

  const toggleProduct = (id) => {
    const idStr = String(id);
    const nuevos = formData.lista_productos.includes(idStr)
      ? formData.lista_productos.filter((p) => p !== idStr)
      : [...formData.lista_productos, idStr];
    handleChange({ target: { name: 'lista_productos', value: nuevos } });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (validate()) handleSubmit(e);
  };

const productosDisponibles = products.filter((p) => {
  if (p._forzarMostrar) return true;
  return !p.promociones || p.promociones.length === 0;
});

  const calcularPrecioConDescuento = (precioOriginal) => {
    const descuento = parseFloat(formData.valor_descuento);
    if (!descuento || descuento < 0) return precioOriginal;
    if (formData.tipo_promocion === 'porcentaje') return precioOriginal * (1 - descuento / 100);
    if (formData.tipo_promocion === 'monto') return Math.max(0, precioOriginal - descuento);
    return precioOriginal;
  };

  return (
    <form
      onSubmit={handleFinalSubmit}
      className="bg-white p-6 rounded shadow space-y-6 w-full max-w-6xl mx-auto"
    >
      {(error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <ul className="list-disc list-inside mt-2">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <InputRowGrid>
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChangeWrapper}
        />
        <Select
          label="Tipo de Promoción"
          name="tipo_promocion"
          value={formData.tipo_promocion}
          onChange={handleChangeWrapper}
          options={[
            { label: '-- Elegir tipo de promoción --', value: '' },
            { label: 'Monto fijo', value: 'monto' },
            { label: 'Porcentaje', value: 'porcentaje' },
          ]}
          hasError={showErrors && !formData.tipo_promocion}
        />
      </InputRowGrid>

      <InputRowGrid>
        <Input
          label="Fecha de inicio"
          name="fecha_inicio"
          type="date"
          value={formData.fecha_inicio}
          onChange={handleChangeWrapper}
          min={new Date().toISOString().split('T')[0]}
        />
        <Input
          label="Fecha de fin"
          name="fecha_fin"
          type="date"
          value={formData.fecha_fin}
          onChange={handleChangeWrapper}
          min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
        />
      </InputRowGrid>

      <Input
        label="Valor del Descuento"
        name="valor_descuento"
        type="number"
        value={formData.valor_descuento}
        onChange={handleChangeWrapper}
        max={
          formData.tipo_promocion === 'porcentaje'
            ? 100
            : Math.min(
                ...products
                  .filter((p) => formData.lista_productos.includes(p.producto_id))
                  .map((p) => p.precio),
                Infinity
              )
        }
        onKeyDown={(e) => {
          if (['-', '+', 'e'].includes(e.key)) {
            e.preventDefault();
          }
        }}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar productos</label>

        {isFetchingProducts ? (
          <div className="flex justify-center items-center py-10 text-gray-600">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
            Cargando productos...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto border p-4 rounded">
            {productosDisponibles.map((p) => (
              <label
                key={p.producto_id}
                className="flex items-start gap-3 border p-3 rounded shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.lista_productos.includes(String(p.producto_id))}
                  onChange={() => toggleProduct(p.producto_id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {p.imagenes?.[0] ? (
                      <img
                        src={p.imagenes[0]}
                        alt={p.nombre}
                        className="w-14 h-14 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-start pl-1 text-xs text-gray-500">
                        Sin imagen
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-400">ID: {p.producto_id}</div>
                      <div className="font-semibold">{p.nombre_producto}</div>
                      <div className="text-sm text-gray-500">
                        {p.categoria?.nombre || 'Sin categoría'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {formData.lista_productos.includes(p.producto_id) ? (
                      <>
                        <span className="line-through text-red-500 mr-2">${p.precio.toFixed(2)}</span>
                        <span className="font-semibold text-green-600">
                          ${calcularPrecioConDescuento(p.precio).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>${p.precio.toFixed(2)}</>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {editingPromotionId ? 'Guardar Cambios' : 'Crear Promoción'}
        </Button>
      </div>
    </form>
  );
}

PromotionForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  showErrors: PropTypes.bool.isRequired,
  setShowErrors: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  editingPromotionId: PropTypes.number,
};

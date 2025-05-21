import PropTypes from 'prop-types';
import { useState } from 'react';
import Step from './Step';
import Input from './Input';
import Select from './Select';
import StepIndicator from './StepIndicator';
import StepNavigation from './StepNavigation';
import InputRowGrid from './InputRowGrid';
import ImageReorderGrid from './ImageReorderGrid';


export default function ProductForm({
  formData,
  handleChange,
  handleSubmit,
  step,
  setStep,
  nextStep,
  prevStep,
  error,
  showErrors,
  setShowErrors,
  isLoading,
}) {
  const [validationErrors, setValidationErrors] = useState([]);

  const validateStep = () => {
    const errors = [];

    if (step === 1) {
      if (!formData.nombre.trim()) errors.push('El campo Nombre es obligatorio.');
      if (!formData.descripcion.trim()) errors.push('El campo Descripción es obligatorio.');
      if (!formData.categoria.trim()) errors.push('El campo Categoría es obligatorio.');
    }

    if (step === 2) {
      if (formData.precio === '' || formData.precio < 0) errors.push('El campo Precio es obligatorio.');
      if (formData.stock === '' || formData.stock < 0) errors.push('El campo Stock es obligatorio.');
      if (formData.oferta === true) {
        if (formData.precio_descuento === '' || formData.precio_descuento < 0) {
          errors.push('El campo Precio con Descuento es obligatorio y no puede ser negativo si el producto está en oferta.');
        } else if (formData.precio_descuento >= formData.precio) {
          errors.push('El Precio con Descuento debe ser menor que el Precio original.');
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChangeWrapper = (e) => {
    const { name, value, type } = e.target;

    if (name === 'estado') return;

    if (type === 'number') {
      let parsedValue = value === '' ? '' : parseFloat(value);
      if (parsedValue < 0 || isNaN(parsedValue)) return;

      if (name === 'stock') {
        parsedValue = parseInt(parsedValue);
        if (!Number.isInteger(parsedValue)) return;
      }

      handleChange({ target: { name, value: parsedValue } });
    } else if (type === 'radio') {
      const booleanValue = value === 'true';
      if (name === 'oferta' && !booleanValue) {
        handleChange({ target: { name: 'precio_descuento', value: '' } });
      }
      handleChange({ target: { name, value: booleanValue } });
    } else {
      handleChange(e);
    }
  };

  const handleNext = () => {
    setShowErrors(true);
    if (validateStep()) {
      setShowErrors(false);
      nextStep();
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (validateStep()) handleSubmit(e);
  };

  const moveImage = (index, direction) => {
    const newImages = [...formData.imagenes];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    handleChange({ target: { name: 'imagenes', value: newImages } });
  };

  return (
    <form onSubmit={handleFinalSubmit} className="bg-white p-6 rounded shadow space-y-6 w-full max-w-5xl mx-auto">
      <StepIndicator
        currentStep={step}
        steps={[
          'Información del Producto',
          'Precios y Stock',
          'Finalización',
        ]}
        onStepClick={(target) => target < step && setStep(target)}
      />

      {(error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <ul className="list-disc list-inside mt-2">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {step === 1 && (
        <>
          <Step title="Información del Producto">
            <InputRowGrid>
              <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChangeWrapper} />
              <Input label="Categoría" name="categoria" value={formData.categoria} onChange={handleChangeWrapper} />
            </InputRowGrid>
            <Input label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChangeWrapper} />
          </Step>
          <StepNavigation nextStep={handleNext} />
        </>
      )}

      {step === 2 && (
        <>
          <Step title="Precios y Stock">
            <InputRowGrid>
              <Input label="Precio" name="precio" type="number" value={formData.precio} onChange={handleChangeWrapper} />
              <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChangeWrapper} />
            </InputRowGrid>

            <InputRowGrid>
              <div className="mb-4">
                <label className="block text-m font-medium text-gray-700 mb-0">¿Está en oferta?</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oferta"
                      value="true"
                      checked={formData.oferta === true}
                      onChange={handleChangeWrapper}
                      className="mr-2"
                    />
                    Sí
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oferta"
                      value="false"
                      checked={formData.oferta === false}
                      onChange={handleChangeWrapper}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.oferta && (
                <Input
                  label="Precio con Descuento"
                  name="precio_descuento"
                  type="number"
                  value={formData.precio_descuento}
                  onChange={handleChangeWrapper}
                />
              )}
            </InputRowGrid>

            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mb-0">¿Es destacado?</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="destacado"
                    value="true"
                    checked={formData.destacado === true}
                    onChange={handleChangeWrapper}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="destacado"
                    value="false"
                    checked={formData.destacado === false}
                    onChange={handleChangeWrapper}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          </Step>
          <StepNavigation nextStep={handleNext} prevStep={prevStep} />
        </>
      )}

      {step === 3 && (
        <>
          <Step title="Finalización">
            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mb-1">Imágenes del producto</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                  const base64Images = await Promise.all(files.map(toBase64));
                  handleChange({
                    target: {
                      name: 'imagenes',
                      value: [...formData.imagenes, ...base64Images],
                    },
                  });
                }}
                className="block w-full"
              />

              {formData.imagenes.length > 0 && (
                <ImageReorderGrid
                  images={formData.imagenes}
                  onReorder={(newImages) =>
                    handleChange({ target: { name: 'imagenes', value: newImages } })
                  }
                  onDelete={(indexToRemove) =>
                    handleChange({
                      target: {
                        name: 'imagenes',
                        value: formData.imagenes.filter((_, i) => i !== indexToRemove),
                      },
                    })
                  }
                />
              )}
            </div>
          </Step>

          <div className="flex justify-between">
            <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
              Anterior
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Finalizar'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

ProductForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  error: PropTypes.string,
  showErrors: PropTypes.bool.isRequired,
  setShowErrors: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
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
  categories,
  isEditing,
}) {
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const initialFormDataRef = useRef(formData);

  useEffect(() => {
    if (isEditing) {
      const igual = isEqual(formData, initialFormDataRef.current);
      setHasChanges(!igual);
    }
  }, [formData, isEditing]);

  const validateStep = () => {
    const errors = [];

    if (step === 1) {
      if (!formData.nombre_producto.trim()) errors.push('El campo Nombre es obligatorio.');
      if (!formData.descripcion.trim()) errors.push('El campo Descripción es obligatorio.');
      if (!formData.categoria_id || isNaN(formData.categoria_id)) errors.push('El campo Categoría es obligatorio.');
    }

    if (step === 2) {
      if (formData.precio === '' || formData.precio < 0) errors.push('El campo Precio es obligatorio.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChangeWrapper = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      let parsedValue = value === '' ? '' : parseFloat(value);
      if (parsedValue < 0 || isNaN(parsedValue)) return;
      handleChange({ target: { name, value: parsedValue } });
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
        steps={['Información del Producto', 'Precio', 'Finalización']}
        onStepClick={(target) => target < step && setStep(target)}
      />

      {(error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-semibold">{error}</p>
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
              <Input label="Nombre" name="nombre_producto" value={formData.nombre_producto} onChange={handleChangeWrapper} />
              <Select
                label="Categoría"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChangeWrapper}
                options={categories}
                hasError={showErrors && !formData.categoria_id}
              />
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
            </InputRowGrid>
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
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  handleChange({
                    target: {
                      name: 'imagenes',
                      value: [...formData.imagenes, ...files],
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

          <div className="flex justify-between items-start mt-6 gap-4 flex-wrap">
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
            >
              Anterior
            </button>
            <div className="flex flex-col items-end gap-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading || (isEditing && !hasChanges)}
              >
                {isLoading ? 'Guardando...' : isEditing ? 'Guardar' : 'Finalizar'}
              </button>
              {isEditing && !hasChanges && (
                <span className="text-sm text-gray-500">Sin cambios realizados</span>
              )}
            </div>
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
  categories: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

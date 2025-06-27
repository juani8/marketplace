import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import Step from './Step';
import Input from './Input';
import StepNavigation from './StepNavigation';
import ScheduleInput from './ScheduleInput';
import StepIndicator from './StepIndicator';
import InputRowGrid from './InputRowGrid';

export default function SellerForm({
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
      if (!formData.nombre?.trim()) errors.push('El campo "Nombre del Comercio" es obligatorio.');
    }

    if (step === 2) {
      if (!formData.calle?.trim()) errors.push('El campo "Calle" es obligatorio.');
      if (!formData.numero?.trim()) errors.push('El campo "Número" es obligatorio.');
      if (!formData.ciudad?.trim()) errors.push('El campo "Ciudad" es obligatorio.');
      if (!formData.provincia?.trim()) errors.push('El campo "Provincia" es obligatorio.');
      if (!formData.codigo_postal?.trim()) errors.push('El campo "Código Postal" es obligatorio.');
    }

    if (step === 3) {
      const horariosObj = formData.configuracion_operativa?.horarios || {};
      const horariosArray = Object.entries(horariosObj);

      const hayAlMenosUno = horariosArray.some(
        ([_, h]) => h.activo && h.desde?.trim() && h.hasta?.trim()
      );
      if (!hayAlMenosUno) {
        errors.push('Debe configurar al menos un día con hora de apertura y cierre.');
      }

      const minutos = (str) => {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
      };

      horariosArray.forEach(([dia, h]) => {
        if (h.activo && h.desde && h.hasta) {
          if (minutos(h.desde) >= minutos(h.hasta)) {
            errors.push(`La hora de apertura debe ser anterior a la de cierre en ${dia}.`);
          }
        }
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
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
    if (validateStep()) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleFinalSubmit}
      className="bg-white p-6 rounded shadow space-y-6 w-full max-w-4xl mx-auto"
    >
      <StepIndicator
        currentStep={step}
        steps={['Datos Básicos', 'Dirección', 'Horarios']}
        onStepClick={(targetStep) => {
          if (targetStep < step) {
            setShowErrors(false);
            setStep(targetStep);
          }
        }}
      />

      {showErrors && (error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <ul className="list-disc list-inside">
            {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            {error && <li>{error}</li>}
          </ul>
        </div>
      )}

      {step === 1 && (
        <>
          <Step title="Datos Básicos">
            <InputRowGrid>
              <Input
                label="Nombre del Comercio"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                hasError={showErrors && !formData.nombre}
              />
            </InputRowGrid>
          </Step>
          <StepNavigation nextStep={handleNext} />
        </>
      )}

      {step === 2 && (
        <>
          <Step title="Dirección del Comercio">
            <InputRowGrid>
              <Input label="Calle" name="calle" value={formData.calle} onChange={handleChange} hasError={showErrors && !formData.calle} />
              <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} hasError={showErrors && !formData.numero} />
              <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} hasError={showErrors && !formData.ciudad} />
              <Input label="Provincia" name="provincia" value={formData.provincia} onChange={handleChange} hasError={showErrors && !formData.provincia} />
            </InputRowGrid>
            <InputRowGrid>
              <Input label="Código Postal" name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} hasError={showErrors && !formData.codigo_postal} />
            </InputRowGrid>
          </Step>
          <StepNavigation nextStep={handleNext} prevStep={prevStep} />
        </>
      )}

      {step === 3 && (
        <>
          <Step title="Horarios del Comercio">
            <ScheduleInput
              horarios={formData.configuracion_operativa?.horarios || {}}
              onChange={(horarios) =>
                handleChange({
                  target: {
                    name: 'configuracion_operativa.horarios',
                    value: horarios,
                  },
                })
              }
            />
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
                {isLoading
                  ? 'Guardando...'
                  : isEditing
                  ? 'Guardar'
                  : 'Finalizar'}
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

SellerForm.propTypes = {
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
  isEditing: PropTypes.bool.isRequired,
};

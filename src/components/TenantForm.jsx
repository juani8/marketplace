import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step from './Step';
import Input from './Input';
import Select from './Select';
import StepNavigation from './StepNavigation';
import ScheduleInput from './ScheduleInput';
import StepIndicator from './StepIndicator'; 

export default function TenantForm({
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

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateCBU = (cbu) => /^\d{22}$/.test(cbu);
  const isInvalidRange = (desde, hasta) => desde && hasta && desde >= hasta;

  const validateStep = () => {
    const errors = [];

    if (step === 1) {
      if (!formData.nombre.trim()) errors.push('El campo Nombre es obligatorio.');
      if (!formData.razon_social.trim()) errors.push('El campo Razón Social es obligatorio.');
      if (!formData.cuenta_bancaria.trim()) {
        errors.push('El campo Cuenta Bancaria es obligatorio.');
      } else if (!validateCBU(formData.cuenta_bancaria)) {
        errors.push('El campo Cuenta Bancaria debe tener exactamente 22 dígitos.');
      }
    }

    if (step === 2) {
      if (!formData.datos_contacto.email.trim()) {
        errors.push('El campo Email es obligatorio.');
      } else if (!validateEmail(formData.datos_contacto.email)) {
        errors.push('El campo Email no es válido.');
      }
      if (!formData.datos_contacto.tel.trim()) errors.push('El campo Teléfono es obligatorio.');
      if (formData.posee_direccion && !formData.direccion.trim()) errors.push('El campo Dirección es obligatorio.');
    }

    if (step === 3) {
      const horarios = formData.configuracion_operativa.horarios;
      const diasActivos = Object.keys(horarios).filter(day => horarios[day].activo);
      if (diasActivos.length === 0) errors.push('Debes configurar al menos un horario de atención.');

      diasActivos.forEach((day) => {
        const { desde, hasta } = horarios[day];
        if (!desde || !hasta) {
          errors.push(`Debes completar ambos horarios para ${day}.`);
        } else if (isInvalidRange(desde, hasta)) {
          errors.push(`La apertura debe ser anterior al cierre en ${day}.`);
        }
      });

      if (!formData.configuracion_operativa.tipo_servicio.trim()) errors.push('El campo Tipo de Servicio es obligatorio.');
      if (!formData.catalogo_id.trim()) errors.push('El campo Catálogo ID es obligatorio.');
      if (!formData.estado.trim()) errors.push('El campo Estado es obligatorio.');
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

  const handlePrev = () => {
    setShowErrors(false);
    prevStep();
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (validateStep()) handleSubmit(e);
  };

  const hasErrors = (fieldName) => {
    if (!showErrors) return false;
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');
      return !formData[parent][child].trim();
    }
    return !formData[fieldName].trim();
  };

  return (
    <form onSubmit={handleFinalSubmit} className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-5xl space-y-6">
      {/* Stepper visual con click para retroceder */}
      <StepIndicator
        currentStep={step}
        onStepClick={(targetStep) => {
          if (targetStep < step) {
            setShowErrors(false);
            setStep(targetStep);
          }
        }}
      />

      {(error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <strong>Corrige los siguientes errores:</strong>
          <ul className="mt-2 list-disc list-inside">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PASO 1 */}
      {step === 1 && (
        <>
          <Step title="Datos Básicos">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              hasError={hasErrors('nombre')}
            />
            <Input
              label="Razón Social"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleChange}
              hasError={hasErrors('razon_social')}
            />
            <Input
              label="Cuenta Bancaria"
              name="cuenta_bancaria"
              value={formData.cuenta_bancaria}
              onChange={handleChange}
              hasError={hasErrors('cuenta_bancaria')}
            />
          </Step>
          <StepNavigation nextStep={handleNext} />
        </>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <>
          <Step title="Contacto y Dirección">
            <Input label="Email" name="datos_contacto.email" value={formData.datos_contacto.email} onChange={handleChange} hasError={hasErrors('datos_contacto.email')} />
            <Input label="Teléfono" name="datos_contacto.tel" value={formData.datos_contacto.tel} onChange={handleChange} hasError={hasErrors('datos_contacto.tel')} />

            <div className="mb-4">
              <label className="block text-m font-medium text-gray-700 mb-0">¿Posee dirección física?</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="posee_direccion"
                    value="true"
                    checked={formData.posee_direccion === true}
                    onChange={() => handleChange({ target: { name: 'posee_direccion', value: true, type: 'radio' } })}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="posee_direccion"
                    value="false"
                    checked={formData.posee_direccion === false}
                    onChange={() => handleChange({ target: { name: 'posee_direccion', value: false, type: 'radio' } })}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {formData.posee_direccion && (
              <Input
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                hasError={hasErrors('direccion')}
              />
            )}
          </Step>
          <StepNavigation nextStep={handleNext} prevStep={handlePrev} />
        </>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <>
          <Step title="Configuración y Finalización">
            <ScheduleInput horarios={formData.configuracion_operativa.horarios} handleChange={handleChange} />
            <div className="grid grid-cols-1 gap-4 mt-6">
              <Select
                label="Tipo de Servicio"
                name="configuracion_operativa.tipo_servicio"
                value={formData.configuracion_operativa.tipo_servicio}
                onChange={handleChange}
                options={['envio', 'retiro', 'ambos']}
                hasError={hasErrors('configuracion_operativa.tipo_servicio')}
              />
              <Input
                label="Catálogo ID"
                name="catalogo_id"
                value={formData.catalogo_id}
                onChange={handleChange}
                hasError={hasErrors('catalogo_id')}
              />
              <Select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                options={['activo', 'inactivo']}
                hasError={hasErrors('estado')}
              />
            </div>
          </Step>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
            >
              Anterior
            </button>

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Cargando
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                'Finalizar'
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

TenantForm.propTypes = {
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

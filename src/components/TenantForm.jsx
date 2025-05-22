import PropTypes from 'prop-types';
import { useState } from 'react';
import Step from './Step';
import Input from './Input';
import Select from './Select';
import StepNavigation from './StepNavigation';
import ScheduleInput from './ScheduleInput';
import StepIndicator from './StepIndicator';
import InputRowGrid from './InputRowGrid'; // nuevo

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
  isEditing,
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
    
      if (!formData.datos_contacto.tel.trim()) {
        errors.push('El campo Teléfono es obligatorio.');
      }
    
      if (!formData.calle.trim()) errors.push('El campo Calle es obligatorio.');
      if (!formData.numero.trim()) errors.push('El campo Número es obligatorio.');
      if (!formData.ciudad.trim()) errors.push('El campo Ciudad es obligatorio.');
      if (!formData.provincia.trim()) errors.push('El campo Provincia es obligatorio.');
      if (!formData.codigo_postal.trim()) errors.push('El campo Código Postal es obligatorio.');
    }
    
    if (step === 3) {
      if (!formData.horario_apertura) {
        errors.push('El campo Horario de Apertura es obligatorio.');
      }
      if (!formData.horario_cierre) {
        errors.push('El campo Horario de Cierre es obligatorio.');
      }
      if (formData.horario_apertura && formData.horario_cierre && formData.horario_apertura >= formData.horario_cierre) {
        errors.push('La hora de apertura debe ser anterior a la de cierre.');
      }
      if (!formData.estado.trim()) {
        errors.push('El campo Estado es obligatorio.');
      }
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
  
    const getValue = (name) => {
      const parts = name.split('.');
      let val = formData;
      for (const part of parts) {
        val = val?.[part];
      }
      return typeof val === 'string' ? val.trim() : val;
    };
  
    const value = getValue(fieldName);
  
    return value === '' || value === undefined || value === null;
  };

  return (
    <form onSubmit={handleFinalSubmit} className="bg-white p-6 rounded shadow space-y-6 w-full max-w-5xl mx-auto">
      <StepIndicator
        currentStep={step}
        steps={[
          'Datos Básicos',
          'Contacto y Dirección',
          'Configuración y Finalización',
        ]}
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
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
            {error && <li>{error}</li>}
          </ul>
        </div>
      )}
      
      {/* PASO 1 */}
      {step === 1 && (
        <>
          <Step title="Datos Básicos">
            <InputRowGrid>
              <Input
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                hasError={hasErrors('nombre')}
                disabled={!isEditing}
              />
              <Input
                label="Razón Social"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                hasError={hasErrors('razon_social')}
                disabled={!isEditing}
              />
            </InputRowGrid>

            <div className="mt-4">
              <Input
                label="Cuenta Bancaria"
                name="cuenta_bancaria"
                value={formData.cuenta_bancaria}
                onChange={handleChange}
                hasError={hasErrors('cuenta_bancaria')}
                disabled={!isEditing}
              />
            </div>
          </Step>
          <StepNavigation nextStep={handleNext} />
        </>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <>
          <Step title="Contacto y Dirección">
            <InputRowGrid>
              <Input
                label="Email"
                name="datos_contacto.email"
                value={formData.datos_contacto.email}
                onChange={handleChange}
                hasError={hasErrors('datos_contacto.email')}
                disabled={!isEditing}
              />
              <Input
                label="Teléfono"
                name="datos_contacto.tel"
                value={formData.datos_contacto.tel}
                onChange={handleChange}
                hasError={hasErrors('datos_contacto.tel')}
                disabled={!isEditing}
              />
            </InputRowGrid>

            <div className="grid grid-cols-1 gap-4 mt-4">
                <InputRowGrid>
                  <Input
                    label="Calle"
                    name="calle"
                    value={formData.calle}
                    onChange={handleChange}
                    hasError={hasErrors('calle')}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Número"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    hasError={hasErrors('numero')}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    hasError={hasErrors('ciudad')}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    hasError={hasErrors('provincia')}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Código Postal"
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleChange}
                    hasError={hasErrors('codigo_postal')}
                    disabled={!isEditing}
                  />
                </InputRowGrid>
            </div>
          </Step>
          <StepNavigation nextStep={handleNext} prevStep={handlePrev} />
        </>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <>
          <Step title="Configuración y Finalización">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
              {/* Columna de Horarios */}
              <InputRowGrid>
                <Input
                  label="Horario de Apertura"
                  name="horario_apertura"
                  type="time"
                  value={formData.horario_apertura}
                  onChange={handleChange}
                  hasError={hasErrors('horario_apertura')}
                  disabled={!isEditing}
                />
                <Input
                  label="Horario de Cierre"
                  name="horario_cierre"
                  type="time"
                  value={formData.horario_cierre}
                  onChange={handleChange}
                  hasError={hasErrors('horario_cierre')}
                  disabled={!isEditing}
                />
              </InputRowGrid>

              {/* Columna de configuración */}
              <div className="space-y-4">
                <Select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  options={['activo', 'inactivo']}
                  hasError={hasErrors('estado')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Step>
          

          <div className="flex justify-start mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
            >
              Anterior
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
  isEditing: PropTypes.bool.isRequired,
};
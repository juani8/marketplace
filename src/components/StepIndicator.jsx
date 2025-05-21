import PropTypes from 'prop-types';

export default function StepIndicator({ currentStep, onStepClick, steps }) {
  return (
    <div className="mb-6">
      {/* Mobile (solo paso actual) */}
      <div className="flex items-center justify-center gap-2 sm:hidden">
        <div className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold bg-blue-600 text-white">
          {currentStep}
        </div>
        <span className="text-sm text-gray-700 font-medium">
          {steps[currentStep - 1]}
        </span>
      </div>

      {/* Desktop (todos los pasos) */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center gap-3">
              <button
                type="button"
                disabled={!isCompleted}
                onClick={() => onStepClick(stepNumber)}
                className={`
                  rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border transition
                  ${isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isCompleted
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 border-gray-300 cursor-default'}
                `}
              >
                {stepNumber}
              </button>
              <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                {label}
              </span>
              {stepNumber < steps.length && <div className="mx-1 text-gray-400">→</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

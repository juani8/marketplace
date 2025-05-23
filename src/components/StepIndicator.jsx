import PropTypes from 'prop-types';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="mb-6">
      {/* Mobile (solo paso actual) */}
      <div className="flex items-center justify-center gap-2 sm:hidden">
        <div className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold bg-primary text-white">
          {currentStep}
        </div>
        <span className="text-sm text-gray-700 font-medium">
          {steps[currentStep - 1]}
        </span>
      </div>

      {/* Desktop (solo destaca el paso actual) */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center gap-3">
              <div
                className={`
                  rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border transition
                  ${isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-300 text-gray-500 border-gray-300'}
                `}
              >
                {stepNumber}
              </div>
              <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {stepNumber < steps.length && <div className="mx-1 text-gray-300">→</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

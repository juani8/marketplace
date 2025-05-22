import PropTypes from 'prop-types';

export default function StepNavigation({ nextStep, prevStep, isLast, handleFinalSubmit, isLoading }) {
  return (
    <div className="flex justify-between mt-6">
      {prevStep ? (
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
          disabled={isLoading}
        >
          Anterior
        </button>
      ) : <div />}

      {isLast ? (
        <button
          type="button"
          onClick={handleFinalSubmit}
          className={`flex justify-center items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Finalizar"
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={nextStep}
          className="bg-gray-300 hover:bg-gray-400 text-neutral py-2 px-4 rounded"
          disabled={isLoading}
        >
          Siguiente
        </button>
      )}
    </div>
  );
}

StepNavigation.propTypes = {
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
  isLast: PropTypes.bool,
  handleFinalSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

import PropTypes from 'prop-types';

export default function InputRowGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

InputRowGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

import PropTypes from 'prop-types';

export default function Step({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">{title}</h2>
      {children}
    </div>
  );
}

Step.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

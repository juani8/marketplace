import PropTypes from 'prop-types';

export default function Step({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-neutral">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

Step.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

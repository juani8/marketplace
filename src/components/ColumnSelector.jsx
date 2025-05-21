import PropTypes from 'prop-types';

export default function ColumnSelector({ allColumns, visibleColumns, onChange, labelMap = {} }) {
  const toggleColumn = (column) => {
    if (visibleColumns.includes(column)) {
      onChange(visibleColumns.filter((col) => col !== column));
    } else {
      onChange([...visibleColumns, column]);
    }
  };

  return (
    <div className="absolute z-10 bg-white border rounded shadow p-3 mt-2 w-64">
      <h3 className="text-sm font-medium mb-2">Columnas visibles</h3>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {allColumns.map((col) => (
          <label key={col} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => toggleColumn(col)}
              className="form-checkbox"
            />
            {labelMap[col] || col}
          </label>
        ))}
      </div>
    </div>
  );
}

ColumnSelector.propTypes = {
  allColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  labelMap: PropTypes.object,
};

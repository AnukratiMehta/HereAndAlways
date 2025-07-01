import PropTypes from "prop-types";

const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto rounded border border-lightGray shadow-sm">
      <table className="min-w-full divide-y divide-lightGray text-sm text-left">
        <thead className="bg-brandRose-light text-brandRose-dark">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lightGray">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default Table;

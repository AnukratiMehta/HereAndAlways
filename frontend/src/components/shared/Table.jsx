import PropTypes from "prop-types";
import { useState } from "react";

const Table = ({ columns, data, renderRow, pageSize }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const pageData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="overflow-x-auto rounded border border-lightGray shadow-sm">
      <table className="min-w-full divide-y divide-lightGray text-sm text-left">
        <thead className="bg-brandRose-light text-brandRose-dark">
  <tr>
    {columns.map((col, index) => (
      <th key={col || index} className="px-4 py-3 font-semibold">
        {col}
      </th>
    ))}
  </tr>
</thead>

        <tbody className="divide-y divide-lightGray">
          {pageData.length > 0 ? (
            pageData.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between p-4 text-sm items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
};

Table.defaultProps = {
  pageSize: 10,
};

export default Table;

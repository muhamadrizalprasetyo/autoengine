import React from 'react';

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-100 border-b border-neutral-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider ${
                  column.align === 'right' ? 'text-right' : ''
                } ${column.align === 'center' ? 'text-center' : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-neutral-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-neutral-700 ${
                    column.align === 'right' ? 'text-right' : ''
                  } ${column.align === 'center' ? 'text-center' : ''}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

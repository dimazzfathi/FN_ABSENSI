import React from 'react';

type DataTableProps<T> = {
  columns: { header: string; accessor: keyof T }[];  // Array objek untuk header dan key data
  data: T[];                                         // Data yang akan ditampilkan
};

const DataTable = <T,>({ columns = [], data = [] }: DataTableProps<T>) => {
  // console.log('Data received:', data); // Tambahkan console log untuk debugging
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default DataTable;

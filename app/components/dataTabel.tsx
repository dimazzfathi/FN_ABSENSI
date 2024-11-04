"use client";
import React, { useState } from "react";
import DropdownMenu from "./dropdown";
import EditForm from "./EditForm"; // Import komponen EditForm

type DataTableProps<T> = {
  columns: { header: string; accessor: keyof T }[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

const DataTable = <T,>({
  columns = [],
  data = [],
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<T | null>(null); // State untuk data yang sedang diedit

  const handleDropdownClick = (rowIndex: number) => {
    setOpenDropdown((prevIndex) => (prevIndex === rowIndex ? null : rowIndex));
  };

  const handleEditClick = (row: T, rowIndex: number) => {
    setOpenDropdown(null); // Tutup dropdown setelah klik edit
    setEditingRow(row); // Set row yang sedang diedit
  };

  const handleDeleteClick = (row: T) => {
    setOpenDropdown(null); // Close dropdown after clicking delete
    onDelete(row);
  };

  const handleUpdate = (updatedRow: T) => {
    console.log("Updating row:", updatedRow);
    if (onEdit) {
      onEdit(updatedRow);
      setEditingRow(null);
    }
  };

  return (
    <div className="w-full lg:w-2/2 ">
      {/* <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border"> */}
      {/* <div className="bg-slate-600 px-2 rounded-xl"> */}
      <div className="overflow-x-auto">
        {/* Tambahkan console.log di sini untuk memeriksa apakah data adalah array */}
        {/* {console.log(Array.isArray(data), data)} */}
        <table className="w-full text-left mt-4 border-collapse">
          <thead>
            <tr className="ml-2">
              <th className=" p-2 sm:p-3 bg-slate-500 text-white">No</th>
              {columns.map((column, index) => (
                <th className="p-2 sm:p-3 bg-slate-500 text-white" key={index}>
                  {column.header}
                </th>
              ))}
              {/* <th className="p-2 sm:p-3 bg-slate-500 text-white">Aksi</th> */}
              {/* Kolom aksi */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="p-3 sm:p-3 text-gray border-b z-50">
                    {rowIndex + 1} {/* Menampilkan nomor urut */}
                  </td>
                  {columns.map((column, colIndex) => (
                    <td className="p-3 sm:p-3 text-gray border-b z-50" key={column.header}>
                    {/* Pastikan column.Cell ada sebelum mengaksesnya */}
                    {typeof column.Cell === 'function' 
                      ? column.Cell({ row }) 
                      : row[column.accessor] ? row[column.accessor] : ''} {/* Menampilkan data atau 'N/A' */}
                  </td>
                  ))}
                  
                  {/* <td className="p-3 sm:p-3 text-gray border-b">
                    <DropdownMenu
                      isOpen={openDropdown === rowIndex}
                      onClick={() => handleDropdownClick(rowIndex)}
                      onEdit={() => handleEditClick(row, rowIndex)}
                      onDelete={() => handleDeleteClick(row)}
                    />
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* Tampilkan form edit jika ada data yang sedang diedit */}
      {editingRow && (
        <EditForm
          initialData={editingRow}
          onUpdate={handleUpdate}
          onCancel={() => setEditingRow(null)} // Fungsi untuk membatalkan edit
        />
      )}
    </div>
  );
};

export default DataTable;

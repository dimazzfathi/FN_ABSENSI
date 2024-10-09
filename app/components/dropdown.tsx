import React from 'react';

type DropdownMenuProps = {
  isOpen: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const DropdownMenu = ({ isOpen, onClick, onEdit, onDelete }: DropdownMenuProps) => {
  return (
    <div className="relative">
      {/* Tombol untuk membuka/menutup dropdown */}
      <button onClick={onClick} className="px-4 py-2 rounded">
        &#8942;
      </button>
      {/* Dropdown muncul hanya jika isOpen true */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
          <button
            onClick={onEdit}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

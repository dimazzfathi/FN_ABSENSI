// app/master_data/nyoba/DropdownMenu.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ isOpen, onClick, onEdit, onDelete, onClose }) => {
  const dropdownRef = useRef(null);

  // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (typeof onClick === 'function') {
        onClick(); // Memanggil fungsi onClose untuk menutup dropdown
      }
    }
  };

  useEffect(() => {
    // Menambahkan event listener untuk menangani klik di luar dropdown jika dropdown terbuka.
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Menghapus event listener ketika dropdown ditutup.
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function untuk menghapus event listener saat komponen di-unmount atau isOpen berubah.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onClick}
        className="p-1 z-40 text-white text-xs sm:text-sm"
      >
        &#8942;
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-24 sm:w-32 bg-slate-600 border rounded-md shadow-lg"
          style={{ left: '-62px', top: '20px' }} // Menggeser dropdown ke kiri
        >
          <button
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
            onClick={() => {
              alert('Detail clicked');
              if (typeof onClose === 'function') {
                onClose(); // Menutup dropdown setelah detail diklik
              }
            }}
          >
            Detail
          </button>
          <button
            onClick={() => {
              onEdit();
              if (typeof onClose === 'function') {
                onClose(); // Menutup dropdown setelah edit diklik
              }
            }}
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              if (typeof onClose === 'function') {
                onClose(); // Menutup dropdown setelah delete diklik
              }
            }}
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

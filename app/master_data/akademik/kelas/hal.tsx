"use client";
import { useState, useEffect } from "react";
import React, { useRef } from 'react';


export default function Kelas() {
  // State untuk menyimpan nilai input
  const [kelasValue, setKelasValue] = useState("");
  const [jurusanValue, setJurusanValue] = useState("");

  // State untuk menyimpan data tabel
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk dropdown dan modals
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableDataKelas")) || [];
    setTableData(savedData);
  }, []);

  // Fungsi untuk menangani perubahan input Kelas
  const handleKelasChange = (e) => {
    setKelasValue(e.target.value);
  };

  // Fungsi untuk menangani perubahan dropdown Jurusan
  const handleJurusanChange = (e) => {
    setJurusanValue(e.target.value);
  };

  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    const newData = [
      ...tableData,
      { no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1, kelas: kelasValue, jurusan: jurusanValue },
    ];
  
    setTableData(newData);
    localStorage.setItem("tableDataKelas", JSON.stringify(newData)); // Simpan ke Local Storage
  
    setKelasValue(""); // Mengosongkan input Kelas setelah disimpan
    setJurusanValue(""); // Mengosongkan dropdown Jurusan setelah disimpan
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setKelasValue(item.kelas);
    setJurusanValue(item.jurusan);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? { ...item, kelas: kelasValue, jurusan: jurusanValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableData", JSON.stringify(updatedData));
    setShowEditModal(false);
    setKelasValue("");
    setJurusanValue("");
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null); // Close dropdown when delete is clicked
  };

  const handleConfirmDelete = () => {
  const filteredData = tableData.filter(
    (item) => item.no !== confirmDelete.id
  );
  const updatedData = filteredData.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
  setTableData(updatedData);
  localStorage.setItem("tableData", JSON.stringify(updatedData));
  setConfirmDelete({ visible: false, id: null });
};

  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handleDropdownClick = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk memfilter data berdasarkan pencarian
  const filteredData = tableData.filter((item) => {
    const kelasMatch = item.kelas ? item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const jurusanMatch = item.jurusan ? item.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return kelasMatch || jurusanMatch;
  });

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // List of jurusan options
  const jurusanOptions = [
    "Teknik Informatika",
    "Sistem Informasi",
    "Teknik Komputer",
    "Manajemen",
  ];

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Kelas</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a
                  href="index.html"
                  className="text-teal-500 hover:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">
                  Master Data
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">
                  Akademik
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-500">Kelas</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <h2 className="text-xl mb-2 sm:text-xl font-bold">Input Kelas</h2>
              <input
                type="text"
                value={kelasValue}
                onChange={handleKelasChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Kelas..."
              />
              <h2 className="text-xl mb-2 sm:text-xl font-bold mt-4">
                Input Jurusan
              </h2>
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveClick}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Table */}
          <div className="w-full lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
             <div className="bg-slate-600 px-2 rounded-xl">
              <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="p-2">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">
                    Tabel Kelas
                  </h2>
                </div>
                <div className="flex lg:flex-row justify-between p-2 items-center">
                <div className="flex items-center pt-2 mb-2 lg:mb-0 space-x-2 lg:order-1">
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="p-2 border border-gray-300 rounded-r-xl rounded-l-xl text-sm sm:text-base"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
                <div className="flex pt-2 items-center space-x-2 lg:order-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-l-xl rounded-r-xl text-sm sm:text-base"
                    placeholder="Cari Kelas atau Jurusan..."
                  />
                </div>
              </div>
              </div>
             
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-xl  bg-slate-500 text-white">No</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Kelas
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Jurusan
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.no}>
                        <td className="p-3 sm:p-3 text-white border-b">{item.no}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jurusan}</td>
                        <td className="p-3 sm:p-3 text-white border-b relative text-center">
                        {/* // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
                        // isOpen: Menentukan apakah dropdown saat ini terbuka berdasarkan nomor item.
                        // onClick: Fungsi untuk menangani aksi klik pada dropdown untuk membuka atau menutupnya.
                        // onDelete: Fungsi untuk memicu proses penghapusan data ketika opsi 'Hapus' dalam dropdown diklik. */}
                         <DropdownMenu
                            isOpen={openDropdown === item.no}
                            onClick={() => handleDropdownClick(item.no)}
                            onDelete={() => handleDeleteClick(item.no)}
                            onEdit={() => handleEditClick(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
               
                <div>
                  <button
                    onClick={handlePreviousClick}
                    className="px-3 py-2 sm:px-3 ml-3 mb-2 sm:py-2 bg-teal-400 text-white rounded-lg text-sm sm:text-base mr-2"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextClick}
                    className="px-3 py-2 sm:px-3  sm:py-2 bg-teal-400 text-white rounded-lg text-sm sm:text-base"
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
</div>
        {/* Modal untuk konfirmasi penghapusan */}
        {confirmDelete.visible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>Apakah Anda yakin ingin menghapus item ini?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-black rounded text-sm sm:text-base mr-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded text-sm sm:text-base"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal untuk mengedit data */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold">Edit Data</h2>
              <input
                type="text"
                value={kelasValue}
                onChange={handleKelasChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Kelas..."
              />
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-black rounded text-sm sm:text-base mr-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}// Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
function DropdownMenu({ isOpen, onClick, onDelete, onEdit }) {

  // Referensi ke elemen dropdown untuk mendeteksi klik di luar elemen tersebut.
  // Digunakan untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  const dropdownRef = useRef(null);

  // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  // Mengecek apakah referensi dropdown saat ini ada dan tidak berisi elemen target dari event klik.
  // Jika benar, fungsi onClick dipanggil untuk menutup dropdown.
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      onClick(); // Close dropdown
    }
  };

  useEffect(() => {
    // Menambahkan event listener untuk mendeteksi klik di luar dropdown
    // ketika dropdown terbuka (isOpen bernilai true).
    // Ini memungkinkan dropdown untuk ditutup jika pengguna mengklik di luar area dropdown.
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Menghapus event listener ketika dropdown ditutup
      document.removeEventListener('mousedown', handleClickOutside);
    }
  
    // Cleanup function untuk menghapus event listener saat komponen di-unmount
    // atau saat `isOpen` berubah, untuk mencegah memory leaks.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Dependensi: useEffect dijalankan ulang ketika nilai isOpen berubah
  

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={onClick}
        className="p-1 z-50 text-white text-xs sm:text-sm"
      >
        &#8942;
      </button>
      

      {isOpen && (
        <div className=" top-full left-0 mt-1 w-24 sm:w-32 bg-slate-600 rounded-md shadow-lg border border-gray-200 z-50">
          <ul>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                alert('Detail clicked');
              }}
            >
              Detail
            </li>
            {/* // Dalam komponen DropdownMenu */}
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                onEdit(); // Tambahkan onEdit di props
              }}
            >
              Edit
            </li>

            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={onDelete}
            >
              Hapus
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
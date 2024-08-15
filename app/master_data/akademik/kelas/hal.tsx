"use client";
import { useState, useEffect, useRef } from 'react';

export default function Hal() {
  // State untuk menyimpan nilai input
  const [kelasValue, setKelasValue] = useState('');
  const [jurusanValue, setJurusanValue] = useState('');

  // State untuk menyimpan data tabel
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk dropdown dan modals
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem('tableData')) || [];
    setTableData(savedData);
  }, []);

  // Fungsi untuk menangani perubahan input Kelas
  const handleKelasChange = (e) => {
    setKelasValue(e.target.value);
  };

  // Fungsi untuk menangani perubahan input Jurusan
  const handleJurusanChange = (e) => {
    setJurusanValue(e.target.value);
  };

  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    const newData = [
      ...tableData,
      { 
        no: tableData.length + 1, 
        kelas: kelasValue, 
        jurusan: jurusanValue
      }
    ];

    setTableData(newData);
    localStorage.setItem('tableData', JSON.stringify(newData)); // Simpan ke Local Storage

    setKelasValue(''); // Mengosongkan input Kelas setelah disimpan
    setJurusanValue(''); // Mengosongkan input Jurusan setelah disimpan
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
    const updatedData = tableData.map(item =>
      item.no === editData.no
        ? { ...item, kelas: kelasValue, jurusan: jurusanValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem('tableData', JSON.stringify(updatedData));
    setShowEditModal(false);
    setKelasValue('');
    setJurusanValue('');
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null); // Close dropdown when delete is clicked
  };

  const handleConfirmDelete = () => {
    const filteredData = tableData.filter(item => item.no !== confirmDelete.id);
    const updatedData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1
    }));
    setTableData(updatedData);
    localStorage.setItem('tableData', JSON.stringify(updatedData));
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
  const filteredData = tableData.filter(item => 
    item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jurusan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className='rounded-lg max-w-full bg-slate-100'>
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Kelas</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline">Home</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">Master Data</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">Akademik</a>
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
              <h2 className="text-xl sm:text-2xl font-bold">Input Kelas</h2>
              <input
                type="text"
                value={kelasValue}
                onChange={handleKelasChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Kelas..."
              />
              <h2 className="text-xl sm:text-2xl font-bold mt-4">Input Jurusan</h2>
              <input
                type="text"
                value={jurusanValue}
                onChange={handleJurusanChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Jurusan..."
              />

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
          
          <div className="w-full   lg:w p-4 lg:p-6">
            <div className=" bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Hasil Inputan</h2>
                <div className="bg-slate-700 p-7 rounded-lg ">

                
            
              <div className="flex justify-between items-center mb-4">
                {/* Dropdown Entries Per Page */}
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="p-1 border border-gray-300 rounded text-sm sm:text-base"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>

                {/* Input Pencarian */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-1/4 p-1 border border-gray-300 rounded text-sm sm:text-base"
                  placeholder="Cari ..."
                />
              </div>
              <div>
                <div className="">
                <table className="min-w-full border-collapse  border-slate-600 text-xs sm:text-sm">
                  <thead>
                    <tr className="   border-slate-600  text-white">
                      <th  className=" rounded-l-lg py-2 bg-slate-600 border-slate-600">No</th>
                      <th  className=" py-2 bg-slate-600 border-slate-600">Kelas</th>
                      <th  className=" py-2 bg-slate-600 border-slate-600">Jurusan</th>
                      <th  className=" rounded-r-lg py-2 py-2 bg-slate-600 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.no} className="border-b text-white border-slate-600">
                        <td className="  border-gray-300">{item.no}</td>
                        <td className="  border-gray-300">{item.kelas}</td>
                        <td className="  border-gray-300">{item.jurusan}</td>
                        <td className=" relative text-center">
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
                <div className="flex justify-end items-center mt-4 lg:mt-6 space-x-2">
                    <button
                        onClick={handlePreviousClick}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextClick}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
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
        </div>
      </div>
      
      {/* Modal Edit */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Edit Data</h3>
            <input
              type="text"
              value={kelasValue}
              onChange={handleKelasChange}
              className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              placeholder="Kelas..."
            />
            <input
              type="text"
              value={jurusanValue}
              onChange={handleJurusanChange}
              className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              placeholder="Jurusan..."
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-2 mr-2 bg-gray-300 text-black rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 bg-teal-400 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {confirmDelete.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-2 mr-2 bg-gray-300 text-black rounded"
              >
                Tidak
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DropdownMenu({ isOpen, onClick, onDelete, onEdit }) {
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      onClick(); // Close dropdown
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={onClick}
        className="p-1 text-gray-600 text-xs sm:text-sm"
      >
        &#8942;
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-24 sm:w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <ul>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                alert('Detail clicked');
              }}
            >
              Detail
            </li>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
              onClick={onEdit}
            >
              Edit
            </li>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
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

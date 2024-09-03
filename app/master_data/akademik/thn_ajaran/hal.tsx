"use client";
import { useState, useEffect, useRef } from 'react';

export default function Hal() {
  const [tahunAjaranValue, setTahunAjaranValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  
  useEffect(() => {
    // Hapus data untuk pengujian
    localStorage.removeItem("tableDataTahunAjaran");
  
    // Muat data dari localStorage
    const savedData = JSON.parse(localStorage.getItem("tableDataTahunAjaran")) || [];
    const sortedData = savedData.map((item, index) => ({ ...item, no: index + 1 }));
    setTableData(sortedData);
  }, []);

  const handleTahunAjaranChange = (e) => {
    setTahunAjaranValue(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const handleSaveClick = () => {
    // Cek apakah tableData kosong
    const newNo = tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1;
  
    const newData = [
      ...tableData,
      { no: newNo, tahunAjaran: tahunAjaranValue, status: statusValue },
    ];
  
    setTableData(newData);
    localStorage.setItem("tableDataTahunAjaran", JSON.stringify(newData));
  
    setTahunAjaranValue("");
    setStatusValue("");
  };
  

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  

  const handleEditClick = (item) => {
    setEditData(item);
    setTahunAjaranValue(item.tahunAjaran);
    setStatusValue(item.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? { ...item, tahunAjaran: tahunAjaranValue, status: statusValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataTahunAjaran", JSON.stringify(updatedData));
    setShowEditModal(false);
    setTahunAjaranValue("");
    setStatusValue("");
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null);
  };

  const handleConfirmDelete = () => {
    const filteredData = tableData.filter(
      (item) => item.no !== confirmDelete.id
    );
    // Menyusun ulang nomor setelah penghapusan
    const updatedData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setTableData(updatedData);
    localStorage.setItem("tableDataTahunAjaran", JSON.stringify(updatedData));
    setConfirmDelete({ visible: false, id: null });
  };
  

  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handleDropdownClick = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = tableData.filter((item) => {
    const tahunAjaranMatch = item.tahunAjaran ? item.tahunAjaran.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const statusMatch = item.status ? item.status.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return tahunAjaranMatch || statusMatch;
  });

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = [
    { value: "Aktif", color: "text-green-500" },
    { value: "Lulus", color: "text-red-500" },
  ];


  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Tahun Ajaran</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline">
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
              <li className="text-gray-500">Tahun Ajaran</li>
            </ol>
          </nav>
        </div>

         {/* Column 1: Input */}
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <h2 className="text-xl mb-2 sm:text-xl font-bold">Input Tahun Ajaran</h2>
              <input
                type="text"
                value={tahunAjaranValue}
                onChange={handleTahunAjaranChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Tahun Ajaran..."
              />
              <h2 className="text-xl mb-2 sm:text-xl font-bold mt-4">
                Input Status
              </h2>
              <select
                value={statusValue}
                onChange={handleStatusChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Status...</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.value}
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
                      Tabel Tahun Ajaran
                    </h2>
                  </div>
                  <div className="flex lg:flex-row justify-between p-2 items-center">
                    <div className="flex items-center pt-2 mb-2 lg:mb-0 space-x-2 lg:order-1">
                    </div>
                    <div className="flex pt-2 items-center space-x-2 lg:order-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-l-xl rounded-r-xl text-sm sm:text-base"
                        placeholder="Cari Tahun Ajaran atau Status..."
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr ml-2>
                        <th className="p-2 sm:p-3 rounded-l-xl  bg-slate-500 text-white">No</th>
                        <th className="p-2 sm:p-3 bg-slate-500 text-white">Tahun Ajaran</th>
                        <th className="p-2 sm:p-3 bg-slate-500 text-white">Status</th>
                        <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item) => (
                        <tr key={item.no}>
                          <td className="p-3 sm:p-3 text-white border-b">{item.no}</td>
                          <td className="p-3 sm:p-3 text-white border-b">
                            {item.tahunAjaran}
                          </td>
                          <td
                            className={`p-3 sm:p-3 text-white border-b ${
                              item.status === "Aktif"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {item.status}
                          </td>
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

                {/* Pagination */}
          <div className="mt-4 flex justify-between items-center pb-4">
              <div className="text-sm text-gray-700 text-white">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-teal-400 text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 border rounded ${
                    currentPage === totalPages ? "bg-gray-300" : "bg-teal-400 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
                
              </div>
            </div>
          </div>

        </div>

        

        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Data</h2>
              <input
                type="text"
                value={tahunAjaranValue}
                onChange={handleTahunAjaranChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Tahun Ajaran..."
              />
              <select
                value={statusValue}
                onChange={handleStatusChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-4"
              >
                <option value="">Pilih Status...</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-teal-400 text-white rounded"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete.visible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
              <p className="mb-4">
                Apakah Anda yakin ingin menghapus data ini?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Hapus
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
function DropdownMenu({ isOpen, onClick, onDelete, onEdit }) {
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      onClick();
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
        className="p-1 z-50 text-white text-xs sm:text-sm"
      >
        &#8942;
      </button>
      {isOpen && (
        <div className="top-full left-0 mt-1 w-24 sm:w-32 bg-slate-600 rounded-md shadow-lg border border-gray-200 z-50">
          <ul>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                alert('Detail clicked');
              }}
            >
              Detail
            </li>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                onEdit();
              }}
            >
              Edit
            </li>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-slate-500 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                onDelete();
              }}
            >
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
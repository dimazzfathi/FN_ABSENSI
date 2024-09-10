"use client";
import React, { useState, useEffect, useRef } from "react";

function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
  const dropdownRef = useRef(null);

  // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (typeof onClose === 'function') {
        onClose();
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
        className="p-1 z-50 text-white text-xs sm:text-sm"
      >
        &#8942;
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-24 sm:w-32 bg-slate-600 border rounded-md shadow-lg">
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
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs text-green-600 sm:text-sm hover:bg-slate-500"
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
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs text-red-600 sm:text-sm hover:bg-slate-500"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

export default function Kelas() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [kelasValue, setKelasValue] = useState("");
  const [jurusanValue, setJurusanValue] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [thnValue, setThnValue] = useState("");
  const [jmlsiswaValue, setJmlSiswaValue] = useState("");
  const [walasValue, setWalasValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [filterThn, setFilterThn] = useState("");
  const [filterWalas, setFilterWalas] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isResettable, setIsResettable] = useState(false);
  
  useEffect(() => {
    const storedJurusan = localStorage.getItem('tableDataJurusan');
    
    // Pastikan data ada di localStorage dan mengonversinya menjadi array
    if (storedJurusan) {
      // Jika data berupa array objek, pastikan akses nilai `jurusan` di setiap objek
      const parsedData = JSON.parse(storedJurusan);
      const jurusanList = parsedData.map((item) => item.jurusan); // Mengambil hanya properti `jurusan`
      setJurusanOptions(jurusanList);
    }
  }, []);

   // useEffect to monitor changes and update isResettable
   useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableDataKelas")) || [];
    setTableData(savedData);
    if (filterKelas || filterJurusan || filterThn || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterKelas, filterJurusan, filterThn, searchTerm]);

  // useEffect(() => {
  //   const savedData = JSON.parse(localStorage.getItem("tableDataKelas")) || [];
  //   setTableData(savedData);
  // }, []);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  // Filter dan pencarian logika
  const filteredData = tableData.filter(item => {
    const nama = typeof item.kelas === 'string' ? item.kelas.toLowerCase() : '';
  const searchLowerCase = searchTerm.toLowerCase();
    return (
      (filterKelas ? item.kelas === filterKelas : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (filterThn ? item.thn === filterThn : true) &&
      (searchTerm ? nama.includes(searchLowerCase) : true)
    );
  });
  
  const handleSaveClick = () => {
    const validTableData = Array.isArray(tableData) ? tableData : [];
  const newData = [
    ...validTableData,
    {
      no: validTableData.length > 0 
        ? Math.max(...validTableData.map((item) => item.no)) + 1 
        : 1,
      kelas: kelasValue,
      jurusan: jurusanValue,
      thn: thnValue,
      walas: walasValue,
      
    }
  ];

    setTableData(newData);
    localStorage.setItem("tableDataKelas", JSON.stringify(newData));

    setKelasValue("");
    setJurusanValue("");
    setThnValue("");
    setJmlSiswaValue("");
    setWalasValue("");
  };
  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
    setFilterKelas('');
    setFilterJurusan('');
    setFilterThn('');
    setSearchTerm('');
    }
  };
  

  const handleEditClick = (item) => {
    setEditData(item);
    setKelasValue(item.kelas);
    setJurusanValue(item.jurusan);
    setThnValue(item.thn);
    setJmlSiswaValue(item.jmlsiswa);
    setWalasValue(item.walas);
    setShowEditModal(true);
  };
  const handleKelasChange = (e) => {
    setKelasValue(e.target.value);
  };
  const handleJurusanChange = (e) => {
    setJurusanValue(e.target.value);
  };
  const handleThnChange = (e) => {
    setThnValue(e.target.value);
  };
  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? {
            ...item,
            kelas: kelasValue,
            jurusan: jurusanValue,
            thn: thnValue,
            jmlsiswa: jmlsiswaValue,
            walas: walasValue,
          }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataKelas", JSON.stringify(updatedData));
    setShowEditModal(false);
    setKelasValue("");
    setJurusanValue("");
    setThnValue("");
    setJmlSiswaValue("");
    setWalasValue("");
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null);
  };

  const handleConfirmDelete = () => {
    const filteredData = tableData.filter((item) => item.no !== confirmDelete.id);
    const updatedData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setTableData(updatedData);
    localStorage.setItem("tableDataKelas", JSON.stringify(updatedData));
    setConfirmDelete({ visible: false, id: null });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    // Logika untuk menangani pembatalan edit
  };

  const handleDropdownClick = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseClick = () => {
    setSelectedItem(null);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const kelasOptions = Array.isArray(tableData) && tableData.length > 0
  ? [...new Set(tableData.map((item) => item.kelas))]
  : [];
  const thnOptions = ["2023/2024", "2024/2025", "2025/2026"];
  const walasOptions = Array.isArray(tableData) && tableData.length > 0
  ? [...new Set(tableData.map((item) => item.walas))]
  : [];
 
  return (
    <>
    <div className="rounded-lg max-w-full bg-slate-100">

      <div className="pt-8 ml-7">
        <h1 className="text-2xl font-bold">Rombel</h1>
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
              <a href="#" className="text-teal-500 hover:underline">Siswa</a>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-500">Rombel</li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <div className="bg-slate-600 p-4 rounded-lg">
            <div className="bg-slate-600 px-2 rounded-xl">
              <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="p-2">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">
                    Tabel Kelas
                  </h2>
                </div>
                {/* <div className="flex lg:flex-row justify-between p-2 items-center">
                  <div className="flex items-center pt-2 mb-2 lg:mb-0 space-x-2 lg:order-1">
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="p-2 border border-gray-300 rounded-r-xl rounded-l-xl text-sm sm:text-base"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  
                </div> */}
              </div>
            </div>
            {/* Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
            <div className="lg:flex-row justify-between items-center">
                  <div className=" items-center lg:mb-0 space-x-2 lg:order-1">
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  
                </div>
              <div>
                <label htmlFor="filterKelas" className="block text-sm font-medium text-gray-700">
                  {/* Filter Kelas */}
                </label>
                <select
                    id="filterKelas"
                    value={filterKelas}
                    onChange={handleFilterChange(setFilterKelas)}
                    className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                >
                  <option value="">Semua Kelas</option>
                  {kelasOptions.map((kelas, index) => (
                    <option key={index} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterJurusan" className="block text-sm font-medium text-gray-700">
                  {/* Filter Jurusan */}
                </label>
                <select
                  id="filterJurusan"
                  value={filterJurusan}
                  onChange={handleFilterChange(setFilterJurusan)}
                  className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                >
                  <option value="">Semua Jurusan</option>
                  {jurusanOptions.map((jurusan, index) => (
                    <option key={index} value={jurusan}>
                      {jurusan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterThn" className="block text-sm font-medium text-gray-700">
                  {/* Filter Tahun Ajaran */}
                </label>
                <select
                  id="filterThn"
                  value={filterThn}
                  onChange={handleFilterChange(setFilterThn)}
                  className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                >
                  <option value="">Semua Tahun Ajaran</option>
                  {thnOptions.map((thn, index) => (
                    <option key={index} value={thn}>
                      {thn}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" items-center lg:mb-0 space-x-2 lg:order-1">
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
              </div>
                  <div className=" items-center lg:mb-0 space-x-2 lg:order-1">
                  <button
              onClick={handleResetClick}
              disabled={!isResettable}
              className={`w-full p-2 rounded text-sm sm:text-base transition   ${
                isResettable
                  ? "text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "text-gray-400 bg-gray-300 cursor-not-allowed"
              } overflow-hidden`}
            >
              <p className="">Reset</p>
            </button >
                  </div>
            </div>
            

            {/* Tabel */}
            <div className="overflow-x-auto">
              <table className="w-full mt-4">
                <thead>
                  <tr className="bg-slate-500 text-white">
                    <th className="p-2 text-left text-sm sm:text-xs rounded-l-lg">No</th>
                    <th className="p-2 text-left text-sm sm:text-xs">Kelas</th>
                    <th className="p-2 text-left text-sm sm:text-xs">Jurusan</th>
                    <th className="p-2 text-left text-sm sm:text-xs">Tahun Ajaran</th>
                    <th className="p-2 text-left text-sm sm:text-xs">Jumlah Siswa</th>
                    <th className="p-2 text-left text-sm sm:text-xs">Wali Kelas</th>
                    <th className="p-2 text-left text-sm sm:text-xs rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => (
                    <tr
                      key={item.no}
                      className="text-center cursor-pointer hover:bg-slate-400"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-4 py-2 text-white border-b text-sm sm:text-xs">{item.no}</td>
                      <td className="px-4 py-2 text-white border-b text-sm sm:text-xs">{item.kelas}</td>
                      <td className="px-4 py-2 text-white text-left border-b text-sm sm:text-xs">{item.jurusan}</td>
                      <td className="px-4 py-2 text-white border-b text-sm sm:text-xs">{item.thn}</td>
                      <td className="px-4 py-2 text-white border-b text-sm sm:text-xs">{item.jmlsiswa}</td>
                      <td className="px-4 py-2 text-white border-b text-sm sm:text-xs">{item.walas}</td>
                      <td className="px-4 py-2 text-white text-left border-b text-sm sm:text-xs" style={{}}>
                        <DropdownMenu
                          isOpen={openDropdown === item.no}
                          onClick={() => handleDropdownClick(item.no)}
                          onEdit={() => handleEditClick(item)}
                          onDelete={() => handleDeleteClick(item.no)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
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

            {/* Delete Confirmation Modal */}
            {confirmDelete.visible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6">
                  <p className="text-sm text-gray-700">
                    Apakah Anda yakin ingin menghapus data ini?
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCancelDelete}
                      className="mr-2 bg-gray-300 px-4 py-2 rounded text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Edit Data Kelas</h2>
                  <div className="mb-4">
                    <label htmlFor="kelasEdit" className="block text-sm font-medium text-gray-700">
                      Kelas
                    </label>
                    <input
                      id="kelasEdit"
                      value={kelasValue}
                      onChange={(e) => setKelasValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="jurusanEdit" className="block text-sm font-medium text-gray-700">
                      Jurusan
                    </label>
                    <input
                      id="jurusanEdit"
                      value={jurusanValue}
                      onChange={(e) => setJurusanValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="thnEdit" className="block text-sm font-medium text-gray-700">
                      Tahun Ajaran
                    </label>
                    <input
                      id="thnEdit"
                      value={thnValue}
                      onChange={(e) => setThnValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="jmlsiswaEdit" className="block text-sm font-medium text-gray-700">
                      Jumlah Siswa
                    </label>
                    <input
                      id="jmlsiswaEdit"
                      value={jmlsiswaValue}
                      onChange={(e) => setJmlSiswaValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="walasEdit" className="block text-sm font-medium text-gray-700">
                      Wali Kelas
                    </label>
                    <input
                      id="walasEdit"
                      value={walasValue}
                      onChange={(e) => setWalasValue(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="mr-2 bg-gray-300 px-4 py-2 rounded text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-teal-400 text-white px-4 py-2 rounded text-sm"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
        {/* tabel inputan */}
      
        <div className="w-full lg:w-1/2 p-4 lg:p-6">
        <div className="rounded-lg shadow-md p-4 lg:p-6 border">
          <h2 className="text-lg font-bold pl-4">Detail siswa</h2>
        {selectedItem && (
        <div className={`mt-4 p-4 bg-gray-100 transition-all duration-500 ease-in-out transform ${
          selectedItem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-lg font-bold">Kelas {selectedItem.kelas} {selectedItem.jurusan} {selectedItem.walas}</h2>
          <div className="overflow-x-auto">
          
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-slate-500 text-white">
            <th className="p-2 text-left text-sm sm:text-xs rounded-l-lg">No</th>
            <th className="p-2 text-left text-sm sm:text-xs rounded-r-lg">Nama</th>
          </tr>
        </thead>
        <tbody>
            <tr className="bg-slate-100 text-black">
              <td className="p-2 border-b text-sm sm:text-xs">1</td>
              <td className="p-2 border-b text-sm sm:text-xs">salim</td>
            </tr>
            <tr className="bg-slate-100 text-black">
              <td className="p-2 border-b text-sm sm:text-xs">2</td>
              <td className="p-2 border-b text-sm sm:text-xs">aziz</td>
            </tr>
        </tbody>
      </table>
    
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleCloseClick}
          >
            Tutup
          </button>
        </div>
      )}
      </div>
        </div>

      </div>
    </div>
    </>
  );
}
  
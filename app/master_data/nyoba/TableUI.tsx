// TableUI.js
import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu'; // Import DropdownMenu

const TableUI = ({
  data,
  totalPages,
  currentPage,
  itemsPerPage,
  handleSaveClick,
  handleEditClick,
  handleDeleteClick,
  handleConfirmDelete,
  handleItemsPerPageChange,
  statusValue,
  thnValue,
  handleSearchChange,
  handleResetClick,
  isResettable,
  handleThnChange,
  thnInputRef,
  handleStatusChange,
  statusSelectRef,
}) => {
  // State untuk melacak dropdown mana yang terbuka
  const [showEditModal, setShowEditModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Fungsi untuk membuka atau menutup dropdown
  const handleDropdownClick = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  const statusOptions = [
    "Aktif",
    "Lulus",
  ];

  return (
    <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Tahun Ajaran</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline hover:text-teal-600">Home</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Master Data</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Akademik</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-500">Tahun Ajaran</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <h2 className="text-sm mb-2 sm:text-sm font-bold"> Tahun Ajaran</h2>
            <input
                type="text"
                value={thnValue}
                onChange={handleThnChange}
                ref={thnInputRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${thnValue === "" ? "border-red-500" : "border-gray-300"}`}
                placeholder="Tahun Ajaran..."
              />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Status</h2>
                <select
                    value={statusValue}
                    onChange={handleStatusChange}
                    ref={statusSelectRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${statusValue === "" ? "border-red-500" : "border-gray-300"}`}
                 >
                    <option value="">Pilih Status...</option>
                        {statusOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                </select>
                <div className="flex m-4 space-x-2">
                  <button
                    onClick={handleSaveClick}
                    className="ml-auto px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white rounded text-sm sm:text-base"
                  >
                    Simpan
                  </button>
                </div>

            </div>
          </div>
          

          {/* Column 2: Table */}
          <div className="w-full  lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
             <div className="bg-slate-600 px-2 rounded-xl">
              <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="p-2">
                  <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                    Tabel Tahun Ajaran
                  </h2>
                </div>          
              </div>
             {/* Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
            <div className="lg:flex-row justify-between items-center">
              <div className=" items-center lg:mb-0 space-x-2 mb-3 lg:order-1">
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
              className={`w-full p-2 rounded text-sm sm:text-base transition z-20 ${
                isResettable
                  ? "text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                  : "text-gray-400 bg-gray-300 cursor-not-allowed"
              }`}
            >
              <p>Reset</p>
            </button >
                  </div>
            </div>
             
              <div className="overflow-x-auto">
                <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>                    
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                       Tahun Ajaran
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Status
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.no}>
                        <td className="p-3 sm:p-3 text-white border-b">{item.no}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.thn}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.status}</td>
                        <td className="p-3 sm:p-3 text-white  border-b "
                        style={{ left: '-500px' }}>
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
              <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700 text-white">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex overflow-hidden m-4 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }  `}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 border rounded ${
                    currentPage === totalPages ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }  `}
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
        <div>
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
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-sm pt-3 sm:text-2xl font-bold">Edit Data</h2>
             
              <input
                type="text"
                value={thnValue}
                onChange={handleThnChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Tahun Ajaran..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Status</h2>
                <select
                    value={statusValue}
                    onChange={handleStatusChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                 >
                    <option value="">Pilih Status...</option>
                        {statusOptions.map((option, index) => (
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
      </div>
      </div>
    
        )}
      </div>
  );
};

export default TableUI;

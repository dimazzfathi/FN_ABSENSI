"use client";
import { useState, useEffect, useRef } from 'react';

export default function Mapel() {
  // State untuk menyimpan nilai input 
  const [mapelValue, setMapelValue] = useState("");
  const [kelasValue, setKelasValue] = useState("");
  const [jurusanValue, setJurusanValue] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [isJurusanAktif, setIsJurusanAktif] = useState(true);
  const [isResettable, setIsResettable] = useState(false);
  const [mapelError, setMapelError] = useState(false);
  const [kelasError, setKelasError] = useState(false);
  const [jurusanError, setJurusanError] = useState(false);

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

  const [filterMapel, setFilterMapel] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

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
    const savedData = JSON.parse(localStorage.getItem("tableDataMapel")) || [];
    setTableData(savedData);
    if (filterMapel || filterKelas || filterJurusan || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterMapel, filterKelas, filterJurusan, searchTerm]);

  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
      setFilterMapel("");
      setFilterKelas("");
      setFilterJurusan("");
      setSearchTerm("");
    }
  };

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableDataMapel")) || [];
    setTableData(savedData);
  }, []);

  const handleToggleJurusan = () => {
    const newIsJurusanAktif = !isJurusanAktif;
    setIsJurusanAktif(newIsJurusanAktif);
  
    if (!newIsJurusanAktif) {
      setJurusanValue(""); // Mengosongkan data di input Jurusan saat toggle dimatikan
    }
  };
  

  const handleMapelChange = (e) => setMapelValue(e.target.value);
  const handleKelasChange = (e) => setKelasValue(e.target.value);
  const handleJurusanChange = (e) => setJurusanValue(e.target.value);

  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    let hasError = false;
  
    if (!mapelValue) {
      setMapelError(true);
      document.getElementById("mapelInput").focus();
      hasError = true;
    } else {
      setMapelError(false);
    }
  
    if (!kelasValue) {
      setKelasError(true);
      if (!hasError) {
        document.getElementById("kelasInput").focus();
        hasError = true;
      }
    } else {
      setKelasError(false);
    }
  
    if (!jurusanValue && isJurusanAktif) {
      setJurusanError(true);
      if (!hasError) {
        document.getElementById("jurusanInput").focus();
      }
    } else {
      setJurusanError(false);
    }
  
    if (hasError) return; // Stop execution if there are errors
  
    const newData = [
      ...tableData,
      {
        no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
        mapel: mapelValue,
        kelas: kelasValue,
        jurusan: jurusanValue || "-",
      },
    ];
  
    setTableData(newData);
    localStorage.setItem("tableDataMapel", JSON.stringify(newData)); // Simpan ke Local Storage
    setMapelValue("");
    setKelasValue(""); // Mengosongkan input Kelas setelah disimpan
    setJurusanValue(""); // Mengosongkan dropdown Jurusan setelah disimpan
  };
  

  const handleDownloadFormatClick = () => {
    // Logika untuk mengunduh file format
    console.log("Unduh format");
  };

  const handleUploadFileClick = () => {
    // Logika untuk mengunggah file
    console.log("Upload file");
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setMapelValue(item.mapel);
    setKelasValue(item.kelas);
    setJurusanValue(item.jurusan);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? {
            ...item,
            mapel: mapelValue,
            kelas: kelasValue,
            jurusan: jurusanValue || "-",
          }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataMapel", JSON.stringify(updatedData));
    setShowEditModal(false);
    setMapelValue("");
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
    localStorage.setItem("tableDataMapel", JSON.stringify(updatedData)); // Update localStorage
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

  

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Filter dan pencarian logika
  const filteredData = tableData.filter(item => {
    const searchLowerCase = searchTerm.toLowerCase();

    return (
      (filterKelas ? item.kelas === filterKelas : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (searchTerm ? (
        (typeof item.nisn === 'string' && item.nisn.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaSiswa === 'string' && item.namaSiswa.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.kelas === 'string' && item.kelas.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jurusan === 'string' && item.jurusan.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jk === 'string' && item.jk.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.mapel === 'string' && item.mapel.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.noWali === 'string' && item.noWali.toLowerCase().includes(searchLowerCase))
      ) : true)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // List of kelasoptions
  const kelasOptions = [
    "10",
    "11",
    "12",
    "10 & 11",
    "10 & 12",
    "10 11 12",
    "11 & 12",
];  
  
  

  return (
    <>
    
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Mapel</h1>
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
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Guru</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-500">Mapel</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Mapel</h2>
              <input
                type="text"
                id="mapelInput"
                value={mapelValue}
                onChange={handleMapelChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  mapelError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Mapel..."
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Kelas</h2>
              <select
                id="kelasInput"
                value={kelasValue}
                onChange={handleKelasChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  kelasError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih Kelas...</option>
                {kelasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Tombol On/Off Geser */}
              <label className="inline-flex mt-4 items-center mb-2">
                <input
                  type="checkbox"
                  checked={isJurusanAktif}
                  onChange={handleToggleJurusan}
                  className="hidden"
                />
                <span
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isJurusanAktif ? "bg-teal-400" : ""
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      isJurusanAktif ? "translate-x-5" : ""
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm">Aktifkan Input Jurusan</span>
              </label>

              <h2 className="text-sm mb-2 sm:text-sm font-bold">Jurusan</h2>
              <select
                id="jurusanInput"
                value={jurusanValue}
                onChange={handleJurusanChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  jurusanError ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!isJurusanAktif}
              >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex justify-between items-center">
                {/* Tombol Unduh Format dan Upload File */}
                <div className="">
                  <button
                    onClick={handleDownloadFormatClick}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 border-slate-500 text-white rounded text-sm sm:text-base"
                  >
                    Unduh Format
                  </button>
                  <button
                    onClick={handleUploadFileClick}
                    className="px-4 py-2 lg:ml-2 md:ml-2 bg-rose-600 hover:bg-rose-700 border-teal-400 text-white rounded text-sm sm:text-base pr-10 mt-1 text-center"
                  >
                    Upload File
                  </button>
                </div>
                {/* Tombol Simpan */}
                <div className="flex m-4 space-x-2">
                  <button
                    onClick={handleSaveClick}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white items-end-end rounded text-sm sm:text-base"
                  >
                    Simpan
                  </button>
                </div>
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
                    Tabel Mapel
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
                        Mapel
                      </th>
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
                        <td className="p-3 sm:p-3 text-white border-b">{item.mapel}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jurusan}</td>
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
                value={mapelValue}
                onChange={handleMapelChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Mapel..."
              /> 
              <select
                value={kelasValue}
                onChange={handleKelasChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Jurusan...</option>
                {kelasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {/* Tombol On/Off Geser */}
        <label className="inline-flex mt-4 items-center mb-2">
          <input
            type="checkbox"
            checked={isJurusanAktif}
            onChange={handleToggleJurusan}
            className="hidden"
          />
          <span
            className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isJurusanAktif ? "bg-teal-400" : ""
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                isJurusanAktif ? "translate-x-5" : ""
              }`}
            />
          </span>
          <span className="ml-2 text-sm">Aktifkan Input Jurusan</span>
        </label>
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                disabled={!isJurusanAktif}
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
      </div>
    </>
  );
}// Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
    const dropdownRef = useRef(null);
  
    // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
    const handleClickOutside = (event) => {
      console.log('Clicked outside'); // Debugging
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('Outside detected'); // Debugging
        if (typeof onClick === 'function') {
          onClick(); // Memanggil fungsi onClose untuk menutup dropdown
        }
      }
    };
  
    useEffect(() => {
      console.log('Effect ran', isOpen); // Debugging
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
        console.log('Cleanup'); // Debugging
      };
    }, [isOpen]);
  
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={onClick}
          className="p-1 z-40  text-white text-xs sm:text-sm"

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
  }
  
function FileUpload() {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    };
  
    const handleClearFile = () => {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input file
      }
    };
  
    return (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full border border-gray-300 rounded-lg mt-4"
          />
        )}
        <button onClick={handleClearFile}>Clear File</button>
      </div>
    );
  }
"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from './components/layout/navbar/page';
import Pw from "../app/administrator/add_user/pass";

const Page = () => {
  // State untuk menyimpan nilai input
  const [ttlValue, setTtlValue] = useState(""); 
  const [namaSiswaValue, setNamaSiswaValue] = useState("");
  const [jkValue, setJkValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [alamatValue, setAlamatValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [noWaliValue, setNoWaliValue] = useState("");
  const [peranValue, setPeranValue] = useState("");
  const [fotoValue, setFotoValue] = useState(null); // State untuk foto
  const [previewURL, setPreviewURL] = useState(""); // State untuk URL preview foto
  const [isResettable, setIsResettable] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);// Untuk pratinjau gambar
  
  // State untuk menyimpan data tabel
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk dropdown dan modals
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [filterPeran, setFilterperan] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  
  // useEffect to monitor changes and update isResettable
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableDataSiswa")) || [];
    setTableData(savedData);
    if (filterPeran || filterJurusan  || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterPeran, filterJurusan , searchTerm]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
    setFilterperan('');
    setFilterJurusan('');
    setSearchTerm('');
    }
  };

  const handleTtlChange = (e) => setTtlValue(e.target.value);
  const handleNamaSiswaChange = (e) => setNamaSiswaValue(e.target.value);
  const handleJkChange = (e) => setJkValue(e.target.value);
  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handleAlamatChange = (e) => setAlamatValue(e.target.value);
  const handleUsernameChange = (e) => setUsernameValue(e.target.value);
  const handlePasswordChange = (e) => setPasswordValue(e.target.value);
  // Fungsi untuk mengganti password dengan simbol asterisk
  const maskPassword = (password) => {
    return '*'.repeat(password.length);
  };
  const handleNoWaliChange = (e) => setNoWaliValue(e.target.value);
  const handlePeranChange = (e) => setPeranValue(e.target.value);

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter dan pencarian logika
  const filteredData = tableData.filter(item => {
    const searchLowerCase = searchTerm.toLowerCase();

    return (
      (filterPeran ? item.peran === filterPeran : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (searchTerm ? (
        (typeof item.kelas === 'string' && item.kelas.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jumlah === 'string' && item.jumlah.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.hadir === 'string' && item.hadir.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.sakit === 'string' && item.sakit.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.izin === 'string' && item.izin.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.alpha === 'string' && item.alpha.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.terlambat === 'string' && item.terlambat.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.walas === 'string' && item.walas.toLowerCase().includes(searchLowerCase))
      ) : true)
    );
  });

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData1 = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //baru##############################
  const [showButtons, setShowButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  // Ambil data dari local storage saat pertama kali komponen dimuat
  const [dataAbsensi, setDataAbsensi] = useState<any[]>([]);
  // Data untuk tabel kedua (data yang sudah dikirim)
  const [dataTerkirim, setDataTerkirim] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState([]);
  // Fungsi untuk menyimpan data ke localStorage
  const saveDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  // Fungsi untuk memuat data dari localStorage
  const loadDataFromLocalStorage = (key) => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : [];
  };
  const dropdownRef = useRef(null); // Referensi untuk dropdown

  const [editItem, setEditItem] = useState(null);
  const [newData, setNewData] = useState({
    nama: '',
    keterangan: '',
    kelas: '',
    jumlah: 0,
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpha: 0,
    terlambat: 0,
    walas: ''
  });

  const handleIzinClick = () => {
    setShowButtons(!showButtons);
  };

  const toggleDropdown = () => {
     setIsOpen(!isOpen);
  };

  const handleButtonClick = () => {
    setShowTable(!showTable); // Toggle the table visibility
  };

  // Fungsi untuk menambah data baru ke tabel absensi
  const handleClick = (status) => {
    const newEntry = {
      id: dataAbsensi.length + 1, // Menambah ID berdasarkan panjang data
      nama: 'John Doe', // Nama contoh, bisa diganti dengan input dinamis
      kelas: 'XII IPA 1', // Kelas contoh, bisa diganti dengan input dinamis
      keterangan: status,
    };

    const updatedData = [...dataAbsensi, newEntry];
    setDataAbsensi(updatedData);
    localStorage.setItem('dataAbsensi', JSON.stringify(updatedData));
  };

  // Memuat data dari localStorage saat komponen pertama kali di-mount
  useEffect(() => {
    const savedDataAbsensi = loadDataFromLocalStorage('dataAbsensi');
    const savedCurrentData = loadDataFromLocalStorage('currentData');
    setDataAbsensi(savedDataAbsensi);
    setCurrentData(savedCurrentData);
  }, []);

  // Fungsi yang dijalankan saat tombol "Kirim" diklik
  const handleKirim = (item) => {
    // Pindahkan item ke currentData
    const newCurrentData = [...currentData, item];
    setCurrentData(newCurrentData);

    // Hapus item dari dataAbsensi
    const newDataAbsensi = dataAbsensi.filter((absensi) => absensi !== item);
    setDataAbsensi(newDataAbsensi);

    // Simpan perubahan ke localStorage
    saveDataToLocalStorage('dataAbsensi', newDataAbsensi);
    saveDataToLocalStorage('currentData', newCurrentData);

    // Menutup dropdown
    setOpenDropdown(null);
  };
  //untuk hapus
  const handleDeleteClick = (id) => {
    console.log("ID yang akan dihapus: ", id); // Debugging
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null);
  };
  
  const handleConfirmDelete = () => {
    console.log("Confirm Delete ID:", confirmDelete.id);

    // Filter currentData berdasarkan ID yang tidak sesuai dengan confirmDelete.id
    const filteredCurrentData = currentData.filter((item) => item.id !== confirmDelete.id);
    console.log("Filtered Current Data:", filteredCurrentData);

    // Update ID pada currentData agar tetap berurutan setelah penghapusan
    const updatedCurrentData = filteredCurrentData.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    // Simpan perubahan ke state dan localStorage
    setCurrentData(updatedCurrentData);
    saveDataToLocalStorage("currentData", updatedCurrentData);
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handleDropdownClick = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id)); // Jika dropdown yang sama diklik, tutup
  };
  //untuk edit
  const handleEditClick = (id) => {
    console.log("Edit Clicked ID:", id); // Pastikan ID diklik
    const itemToEdit = currentData.find((item) => item.id === id);
    console.log("Item to Edit:", itemToEdit); // Pastikan item ditemukan
    
    if (itemToEdit) {
      setEditItem(itemToEdit); // Set item yang akan diedit
      setNewData({
        nama: itemToEdit.nama,
        keterangan: itemToEdit.keterangan,
        kelas: itemToEdit.kelas, 
        jumlah: itemToEdit.jumlah, 
        hadir: itemToEdit.hadir, 
        sakit: itemToEdit.sakit, 
        izin: itemToEdit.izin, 
        alpha: itemToEdit.alpha, 
        terlambat: itemToEdit.terlambat,
        walas: itemToEdit.walas
      });
      console.log("Edit Item Set:", itemToEdit); // Pastikan item sudah di-set
    } else {
      console.error("Item tidak ditemukan untuk ID:", id); // Debug jika tidak ditemukan
    }
  };

  const handleEdit = (id, newData) => {
    console.log("Data yang diedit untuk ID", id, ":", newData); // Debug data yang akan di-update
  
    // Update currentData dengan data baru berdasarkan ID
    const updatedCurrentData = currentData.map((item) =>
      item.id === id ? { ...item, ...newData } : item
    );
    
    setCurrentData(updatedCurrentData); // Update state dengan data terbaru
    console.log("Current Data setelah update:", updatedCurrentData); // Debug data setelah update
  
    saveDataToLocalStorage("currentData", updatedCurrentData); // Simpan ke localStorage
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditSubmit = () => {
    if (editItem) {
      handleEdit(editItem.id, newData);
      console.log("Data yang diedit:", newData); // Debug data yang akan di-update
      console.log("Data Terkirim setelah diedit:", dataTerkirim); // Debug data setelah update
      setEditItem(null); // Tutup form
      setNewData({
        nama: '',
        keterangan: '',
        kelas: '',
        jumlah: 0,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpha: 0,
        terlambat: 0,
        walas: ''
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null); // Tutup dropdown jika klik di luar
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [rowsPerPage, setRowsPerPage] = useState(5); // Default 5 baris

  // Mengambil data dari localStorage saat komponen pertama kali di-render
  useEffect(() => {
    const storedData = localStorage.getItem('dataKey'); // 'dataKey' adalah kunci penyimpanan di localStorage
    if (storedData) {
      setCurrentData(JSON.parse(storedData)); // Parsing data dari localStorage ke array JavaScript
    }
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  const handleRowsChange = (event) => {
    setRowsPerPage(parseInt(event.target.value)); // Mengubah jumlah baris sesuai pilihan
  };
  
  return (
    <>
    <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <div className="flex flex-col items-center justify-center">
                <h1 className="font-bold text-xl text-center">Tombol untuk siswa</h1>
                <button
                  onClick={handleIzinClick}
                  className="bg-blue-500 text-white w-32 px-4 py-2 mt-4 rounded"
                >
                  Izin
                </button>
                {showButtons && (
                  <div className="mt-4">
                    <button className="bg-green-500 w-44 text-white px-4 py-2 mr-2 rounded"
                    onClick={() => handleClick('Sakit')}>
                      Sakit
                    </button>
                    <button className="bg-yellow w-44 text-white px-4 py-2 rounded"
                    onClick={() => handleClick('Keterangan Lain')}>
                      Keterangan Lain
                    </button>
                  </div>
                )} 
              </div>
              <div className="relative inline-block text-left">
                  <div
                    onClick={toggleDropdown}
                    className="text-white px-4 py-2 rounded flex items-center"
                  >
                    <span className="flex items-end text-gray-200">
                      {isOpen ? "<" : ">"}
                      {isOpen && (
                        <div className="absolute left-8 border rounded shadow-lg -mb-2">
                          <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                          onClick={handleButtonClick}>
                            Pulang
                          </button>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
            </div>
            {showTable && (
              <div>
                <h1>Absen untuk yang pulang dulu</h1>
                <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr>
                    <th className="px-3 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">NO</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">NAMA</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">KELAS</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">KETERANGAN</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                {dataAbsensi.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 sm:p-3 ml-5 text-black border-b">{index + 1}</td> {/* Nomor urut yang dinamis */}
                    <td className="px-6 py-4 border-b border-gray-300 text-sm">{item.nama}</td>
                    <td className="px-6 py-4 border-b border-gray-300 text-sm">{item.kelas}</td>
                    <td className="px-6 py-4 border-b border-gray-300 text-sm">{item.keterangan}</td>
                    <td className="px-6 py-4 border-b border-gray-300 text-sm">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleKirim(item)}
                    >
                      Kirim
                    </button>
                    </td>
                  </tr>
                ))}
                  {/* Tambahkan baris lain sesuai kebutuhan */}
                </tbody>
              </table>
              </div>
            )}
          </div>
          {/* Column 2: Table */}
          <div className="w-full  lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
             <div className="bg-slate-600 px-2 rounded-xl">
              <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="p-2">
                  <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                    Tabel
                  </h2>
                </div>          
              </div>
             {/* Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
            <div className="lg:flex-row justify-between items-center">
              <div className=" items-center lg:mb-0 space-x-2 mb-3 lg:order-1">
                    <select
                      onChange={handleRowsChange}
                      value={rowsPerPage}
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
            {/* tabel */}
              <div className="overflow-x-auto">
                <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Kelas
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Jumlah
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        H
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        S
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        I
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        A
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        T
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Walas
                      </th>
                      <th className="p-2 sm:p-3 rounded-r-lg bg-slate-500 text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentData.slice(0, rowsPerPage).map((item, index) => (
                      <tr key={index}>
                        <td className="p-3 sm:p-3 text-white border-b">{index + 1}</td> {/* Nomor urut yang dinamis */}
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jumlah}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.hadir}</td>
                        <td className="p-2 sm:p-3 border-b border-gray-300">{item.sakit}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.izin}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.alpha}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.terlambat}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.walas}</td>
                        <td className="p-3 sm:p-3 text-white border-b text-center">
                        {/* // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
                        // isOpen: Menentukan apakah dropdown saat ini terbuka berdasarkan nomor item.
                        // onClick: Fungsi untuk menangani aksi klik pada dropdown untuk membuka atau menutupnya.
                        // onDelete: Fungsi untuk memicu proses penghapusan data ketika opsi 'Hapus' dalam dropdown diklik. */}
                         <DropdownMenu
                            isOpen={openDropdown === item.id}
                            onClick={() => handleDropdownClick(item.id)}
                            onDelete={() => handleDeleteClick(item.id)}
                            onEdit={() => handleEditClick(item.id)} />
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
              <div className="flex m-4 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 border rounded ${
                    currentPage === totalPages ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }`}
                >
                  Next
                </button>
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
                onClick={() => handleConfirmDelete()}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded text-sm sm:text-base"
                >
                  Hapus
                  </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal untuk mengedit data */}
        {editItem && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg z-50">
              {/* Input Nama */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                  Nama
                </label>
                <input
                  id="nama"
                  type="text"
                  name="nama"
                  value={newData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Kelas */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kelas">
                  Kelas
                </label>
                <input
                  id="kelas"
                  type="text"
                  name="kelas"
                  value={newData.kelas}
                  onChange={handleInputChange}
                  placeholder="Kelas"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Jumlah */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jumlah">
                  Jumlah
                </label>
                <input
                  id="jumlah"
                  type="number"
                  name="jumlah"
                  value={newData.jumlah}
                  onChange={handleInputChange}
                  placeholder="Jumlah"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Hadir (H) */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hadir">
                  Hadir
                </label>
                <input
                  id="hadir"
                  type="number"
                  name="hadir"
                  value={newData.hadir}
                  onChange={handleInputChange}
                  placeholder="Hadir"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Sakit */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sakit">
                  Sakit
                </label>
                <input
                  id="sakit"
                  type="number"
                  name="sakit"
                  value={newData.sakit}
                  onChange={handleInputChange}
                  placeholder="Sakit"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Izin */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="izin">
                  Izin
                </label>
                <input
                  id="izin"
                  type="number"
                  name="izin"
                  value={newData.izin}
                  onChange={handleInputChange}
                  placeholder="Izin"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Alpha (A) */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alpha">
                  Alpha
                </label>
                <input
                  id="alpha"
                  type="number"
                  name="alpha"
                  value={newData.alpha}
                  onChange={handleInputChange}
                  placeholder="Alpha"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Terlambat (T) */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="terlambat">
                  Terlambat
                </label>
                <input
                  id="terlambat"
                  type="number"
                  name="terlambat"
                  value={newData.terlambat}
                  onChange={handleInputChange}
                  placeholder="Terlambat"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Input Walas */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="walas">
                  Wali Kelas (Walas)
                </label>
                <input
                  id="walas"
                  type="text"
                  name="walas"
                  value={newData.walas}
                  onChange={handleInputChange}
                  placeholder="Wali Kelas"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleEditSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditItem(null)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
      if (typeof onClose === 'function') {
        onClose(); // Memanggil fungsi onClose untuk menutup dropdown
      }
    }
  };
  //untuk detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const handleDetailClick = () => {
    setIsModalOpen(true);
    if (typeof onClose === 'function') {
      onClose(); // Menutup dropdown setelah detail diklik
    }
  };
  const handleConfirm = (password) => {
    setConfirmedPassword(password); // Menyimpan password di state
  };
  //detail end

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
            onClick={handleDetailClick}
          >
            Detail
          </button>
          <Pw isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} />
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

export default Page
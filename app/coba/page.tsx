"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '../header';
import Pw from "../administrator/add_user/pass";

const Page = () => { 
  const [isResettable, setIsResettable] = useState(false);
  // State untuk dropdown dan modals
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });

  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
    setFilterperan('');
    setFilterJurusan('');
    setSearchTerm('');
    }
  };

  //baru##############################
  const [showButtons, setShowButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  // const [rowsPerPage, setRowsPerPage] = useState(5); // Jumlah data per halaman
  const [currentData, setCurrentData] = useState([]);// Contoh data awal (bisa diganti dengan fetch dari API/database)
  const [isLoading, setIsLoading] = useState(true);
  
  // Mengambil data saat halaman dibuka
  useEffect(() => {
    // Data awal (menggantikan dummyData)
    const initialData = [
       ({ id: 1, kelas: '10A', jumlah: 30, hadir: 25, sakit: 2, keteranganLain: 1, alpha: 1, terlambat: 1, walas: 'Budi' },
       { id: 2, kelas: '10B', jumlah: 28, hadir: 27, sakit: 1, keteranganLain: 0, alpha: 0, terlambat: 0, walas: 'Ani' },
       { id: 3, kelas: '11A', jumlah: 32, hadir: 30, sakit: 0, keteranganLain: 1, alpha: 1, terlambat: 2, walas: 'Cici' },
       { id: 4, kelas: '11B', jumlah: 29, hadir: 28, sakit: 1, keteranganLain: 0, alpha: 0, terlambat: 1, walas: 'Dodi' },
       { id: 5, kelas: '12A', jumlah: 31, hadir: 29, sakit: 0, keteranganLain: 2, alpha: 0, terlambat: 0, walas: 'Erik' },
       { id: 6, kelas: '12B', jumlah: 27, hadir: 27, sakit: 0, keteranganLain: 0, alpha: 0, terlambat: 0, walas: 'Fani' },
       { id: 7, kelas: '12C', jumlah: 25, hadir: 24, sakit: 1, keteranganLain: 0, alpha: 0, terlambat: 0, walas: 'Giri' },
       { id: 8, kelas: '10C', jumlah: 30, hadir: 28, sakit: 1, keteranganLain: 0, alpha: 1, terlambat: 0, walas: 'Hana' })
    ];

    setTimeout(() => {
      setCurrentData(initialData);
      setIsLoading(false);
    }, 1000); // Simulasi delay
  }, []); // Kosong agar `useEffect` hanya berjalan sekali saat komponen pertama kali dirender

  const [searchTerm, setSearchTerm] = useState(''); // Kata kunci pencarian
  // Ambil data dari local storage saat pertama kali komponen dimuat
  const [dataAbsensi, setDataAbsensi] = useState<any[]>([]);
  // Data untuk tabel kedua (data yang sudah dikirim)
  const [dataTerkirim, setDataTerkirim] = useState<any[]>([]);
  //khusus untuk input barcode
  
  const [barcode, setBarcode] = useState('');
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('dataAbsensi')) || [];
    setDataAbsensi(storedData);
  }, []);
  // Fungsi untuk menangani perubahan input barcode
  
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
    jumlah: '',
    hadir: '',
    sakit: '',
    keteranganLain: '',
    alpha: '',
    terlambat: '',
    walas: ''
  });

  useEffect(() => {
    const loadedDataAbsensi = loadDataFromLocalStorage('dataAbsensi');
    const loadedCurrentData = loadDataFromLocalStorage('currentData');
    
    setDataAbsensi(loadedDataAbsensi);
    setCurrentData(loadedCurrentData);
  }, []);

  // Fungsi untuk cek apakah hari sudah berganti atau akhir bulan
const isNewDay = (lastSaveDate) => {
  const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  return today !== lastSaveDate; // Jika tanggal hari ini tidak sama dengan tanggal penyimpanan terakhir
};

const isEndOfMonth = () => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return today.getDate() === lastDayOfMonth.getDate();
};

const savePreviousData = (currentData) => {
  const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  saveDataToLocalStorage(`previousData_${today}`, currentData);
};

const resetData = (currentData) => {
  savePreviousData(currentData); // Simpan data sebelumnya
  setCurrentData([]); // Reset data saat ini
  saveDataToLocalStorage('currentData', []); // Simpan data kosong ke localStorage
};

useEffect(() => {
  const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const lastSaveDate = loadDataFromLocalStorage('lastSaveDate'); // Tanggal terakhir data disimpan
  
  if (isNewDay(lastSaveDate) || isEndOfMonth()) {
    // Jika hari baru atau akhir bulan, reset data
    const currentData = loadDataFromLocalStorage('currentData'); // Ambil data saat ini sebelum reset
    resetData(currentData); // Reset dan simpan data
    saveDataToLocalStorage('lastSaveDate', today); // Simpan tanggal terakhir
  } else {
    // Jika tidak perlu reset, muat data dari localStorage
    setCurrentData(loadDataFromLocalStorage('currentData'));
  }
}, []);

  

  const handleIzinClick = () => {
    setShowButtons(!showButtons);
  };

  const toggleDropdown = () => {
     setIsOpen(!isOpen);
  };

  const handleButtonClick = () => {
    setShowTable(!showTable); // Toggle the table visibility
  };

  // Fungsi untuk menghandle pagination modal
const handlePreviousPageModal = () => {
  if (currentPageModal > 1) {
    setCurrentPageModal((prev) => prev - 1);
  }
};

const handleNextPageModal = () => {
  if (currentPageModal < totalPagesModal) {
    setCurrentPageModal((prev) => prev + 1);
  }
};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

   // Mengatur fungsi untuk menampilkan modal
   const handleClick = (type) => {
    if (type === 'S') {
      setIsModalOpen(true);
    }
  };

  const filteredData = currentData.filter(item => {
    console.log('Search Term:', searchTerm); // Memeriksa nilai search term
    console.log('Item:', item); // Memeriksa setiap item data
    return (
      (item.kelas && item.kelas.toLowerCase().includes(searchTerm)) ||
      (item.kelas && item.kelas.toLowerCase().includes(searchTerm))
    );
  });

  // Menangani pencarian nama dan kelas
  // const filteredData = data.filter(
  //   (item) =>
  //     item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     item.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Fungsi untuk menambah data baru ke tabel absensi
  // const handleClick = (type) => {
  //   const updatedData = currentData.map(item => {
  //     // Pastikan hadir, sakit, dan keteranganLain tidak undefined
  //     const hadir = item.hadir || 0;
  //     const sakit = item.sakit || 0;
  //     const keteranganLain = item.keteranganLain || 0;
  
  //     if (hadir > 0) { // Hanya kurangi H jika lebih dari 0
  //       if (type === 'S') {
  //         return { ...item, sakit: sakit + 1, hadir: hadir - 1 }; // Tambah 1 di S, kurangi 1 di H
  //       } else if (type === 'I') {
  //         return { ...item, keteranganLain: keteranganLain + 1, hadir: hadir - 1 }; // Tambah 1 di I, kurangi 1 di H
  //       }
  //     }
  //     return item;
  //   });
  
  //   setCurrentData(updatedData); // Update state
  // };
  
  
  

  // Memuat data dari localStorage saat komponen pertama kali di-mount
  useEffect(() => {
    const savedDataAbsensi = loadDataFromLocalStorage('dataAbsensi');
    const savedCurrentData = loadDataFromLocalStorage('currentData');
    setDataAbsensi(savedDataAbsensi);
    setCurrentData(savedCurrentData);
  }, []);

  // Fungsi yang dijalankan saat tombol "Kirim" diklik
  // const handleKirim = (item) => {
  //   // Tentukan nilai default untuk semua kolom jika item belum ada di currentData
  //   const updatedItem = {
  //     sakit: 0,
  //     keteranganLain: 0,
  //     hadir: 0,
  //     alpha: 0,
  //     terlambat: 0,
  //   };
  
  //   // Tentukan nilai berdasarkan keterangan
  //   if (item.keterangan === 'sakit') {
  //     updatedItem.sakit = 1;
  //   } else if (item.keterangan === 'keteranganLain') {
  //     updatedItem.keteranganLain = 1;
  //   } else if (item.keterangan === 'alpha') {
  //     updatedItem.alpha = 1;
  //   } else if (item.keterangan === 'terlambat') {
  //     updatedItem.terlambat = 1;
  //   }
  
  //   // Perbarui atau tambahkan item di currentData
  //   const newCurrentData = currentData.map((data) => {
  //     if (data.id === item.id) {
  //       const totalJumlah = item.jumlah || data.jumlah || 0; // Pastikan jumlah tidak undefined
  //       const sakit = data.sakit + updatedItem.sakit;
  //       const keteranganLain = data.keteranganLain + updatedItem.keteranganLain;
  //       const alpha = data.alpha + updatedItem.alpha;
  //       const hadir = totalJumlah - sakit - keteranganLain - alpha;
  
  //       return {
  //         ...data,
  //         sakit: sakit,
  //         keteranganLain: keteranganLain,
  //         hadir: hadir >= 0 ? hadir : 0, // Pastikan hadir tidak negatif
  //         alpha: alpha,
  //         terlambat: data.terlambat + updatedItem.terlambat,
  //       };
  //     }
  //     return data;
  //   });
  
  //   // Jika item tidak ada di currentData, tambahkan item baru
  //   if (!currentData.some(data => data.id === item.id)) {
  //     const totalJumlah = item.jumlah || 0;
  //     const sakit = updatedItem.sakit;
  //     const keteranganLain = updatedItem.keteranganLain;
  //     const alpha = updatedItem.alpha;
  //     const hadir = totalJumlah - sakit - keteranganLain - alpha;
  
  //     newCurrentData.push({
  //       ...item,
  //       sakit: sakit,
  //       keteranganLain: keteranganLain,
  //       hadir: hadir >= 0 ? hadir : 0, // Pastikan hadir tidak negatif
  //       alpha: alpha,
  //       terlambat: updatedItem.terlambat,
  //     });
  //   }
  
  //   // Hapus item dari tabel pertama
  //   const newDataAbsensi = dataAbsensi.filter((absensi) => absensi.id !== item.id);
  //   setDataAbsensi(newDataAbsensi);
  
  //   // Simpan perubahan ke localStorage
  //   setCurrentData(newCurrentData);
  //   saveDataToLocalStorage('dataAbsensi', newDataAbsensi);
  //   saveDataToLocalStorage('currentData', newCurrentData);
  
  //   // Tutup dropdown
  //   setOpenDropdown(null);
  // };

  // Contoh data dummy
const dummyData = [
  { nama: "Andi", kelas: "10A" },
  { nama: "Budi", kelas: "10B" },
  { nama: "Citra", kelas: "11A" },
  { nama: "Doni", kelas: "11B" },
  { nama: "Eka", kelas: "12A" },
  { nama: "Fani", kelas: "12B" },
  { nama: "Gina", kelas: "10C" },
  { nama: "Hadi", kelas: "10D" },
  { nama: "Ika", kelas: "11C" },
  { nama: "Joko", kelas: "11D" },
  { nama: "Lina", kelas: "12C" },
  { nama: "Maya", kelas: "12D" },
  { nama: "Nina", kelas: "10E" },
  { nama: "Oka", kelas: "10F" },
  { nama: "Pia", kelas: "11E" },
];

// Gunakan displayedData untuk menampilkan data
const [displayedData, setDisplayedData] = useState(dummyData);
// State untuk modal
const [currentPageModal, setCurrentPageModal] = useState(1);
const [itemsPerPageModal, setItemsPerPageModal] = useState(5);
const totalPagesModal = Math.ceil(displayedData.length / itemsPerPageModal);

  const handleSubmit = () => {
    // Misalnya, kita ingin memastikan bahwa input sudah diisi
    if (!searchQuery) {
      alert("Silakan isi kolom pencarian!");
      return;
    }
  
    // Proses data yang ingin dikirim
    const dataToSend = {
      searchQuery,
      itemsPerPage,
      currentPage,
      // Tambahkan data lain yang perlu dikirim
    };
  
    // Contoh mengirim data ke server (gunakan fetch atau axios)
    fetch('/api/your-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Tindakan setelah berhasil mengirim data
      console.log('Data berhasil dikirim:', data);
      // Mungkin tutup modal atau reset form
      setIsModalOpen(false);
      // Reset atau kosongkan input
      setSearchQuery('');
      setItemsPerPage(5); // Misalnya reset ke default
    })
    .catch(error => {
      console.error('Terjadi kesalahan saat mengirim data:', error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    });
  };
  

  const handleBarcodeChange = (e) => {
    setBarcode(e.target.value);
  
    // Clear timer sebelumnya jika ada
    if (timer) {
      clearTimeout(timer);
    }
  
    // Timer untuk menyimpan barcode ke kolom "H" setelah 1 detik
    setTimer(setTimeout(saveBarcodeToH, 100));
  };
  
  const saveBarcodeToH = () => {
    const existingItem = currentData.find(item => item.barcode === barcode);
  
    if (existingItem) {
      const updatedData = currentData.map((item) => {
        if (item.barcode === barcode) {
          // Pastikan hadir tidak undefined
          const hadirCount = (item.hadir || 0) + 1;
          return { ...item, hadir: hadirCount };
        }
        return item;
      });
  
      setCurrentData(updatedData);
    } else {
      const newEntry = {
        id: currentData.length + 1,
        barcode: barcode,
        hadir: 1, // Mulai dengan hadir 1
      };
  
      setCurrentData([...currentData, newEntry]);
    }
  
    setBarcode(''); // Reset input barcode setelah disimpan
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
    setConfirmDelete("")
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
        keteranganLain: itemToEdit.keteranganLain, 
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
      // Hitung nilai hadir berdasarkan total dikurangi sakit, keterangan lain, dan alpha
      const totalJumlah = newData.jumlah || 0;
      const sakit = newData.sakit || 0;
      const keteranganLain = newData.keteranganLain || 0;
      const alpha = newData.alpha || 0;
      const hadir = totalJumlah - sakit - keteranganLain - alpha;
  
      // Update newData dengan nilai hadir yang baru dihitung
      const updatedData = {
        ...newData,
        hadir: hadir,
      };
  
      // Panggil fungsi handleEdit untuk memperbarui data
      handleEdit(editItem.id, updatedData);
  
      // Debug data yang telah diupdate
      console.log("Data yang diedit:", updatedData); // Debug data yang akan di-update
      console.log("Data Terkirim setelah diedit:", dataTerkirim); // Debug data setelah update
  
      // Reset form
      setEditItem(null); // Tutup form
      setNewData({
        nama: '',
        keterangan: '',
        kelas: '',
        jumlah: 0,
        hadir: 0,
        sakit: 0,
        keteranganLain: 0,
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

  useEffect(() => {
    // Mengambil data dari localStorage saat komponen pertama kali di-render
    const storedData = localStorage.getItem('dataKey'); // 'dataKey' adalah kunci penyimpanan di localStorage
    if (storedData) {
      setCurrentData(JSON.parse(storedData)); // Parsing data dari localStorage ke array JavaScript
    }
  }, []);

  const handleRowsChange = (event) => {
    setRowsPerPage(parseInt(event.target.value)); // Mengubah jumlah baris sesuai pilihan
    setCurrentPage(1); // Reset halaman ke 1 saat jumlah baris berubah
  };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage((prev) => prev + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prev) => prev - 1);
  //   }
  // };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Mengubah kata kunci pencarian
    setCurrentPage(1); // Reset halaman ke 1 saat kata kunci berubah
  };

  // Filter data berdasarkan kata kunci pencarian
  

  

  // Hitung data yang ditampilkan berdasarkan halaman saat ini
  // const startIndex = (currentPage - 1) * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;
  // const paginatedData = currentData.slice(startIndex, startIndex + rowsPerPage);


  
  // Hitung total halaman berdasarkan data yang difilter
  // const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  // // Mengecek apakah ada halaman selanjutnya
  // const hasNextPage = currentPage * rowsPerPage < currentData.length;
  
  return (
    <>
    <div>
      <Navbar />
    </div>
    <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-bold text-xl text-center">Tombol untuk siswa</h1>
              <div>
                <button
                  onClick={() => handleClick("S")} 
                  className="bg-green-500 w-44 text-white px-4 py-2 mr-2 rounded"
                >
                  Sakit
                </button>

                {isModalOpen && (
                  <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl">
                      <div className="bg-slate-600 p-2 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <select
                              id="itemsPerPage"
                              value={itemsPerPageModal}
                              onChange={(e) => setItemsPerPageModal(Number(e.target.value))}
                              className="border p-2 w-full"
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={12}>12</option>
                            </select>
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Cari Nama atau Kelas"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="border p-2 w-full"
                            />
                          </div>
                        </div>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="ml-2">
                              <th className="p-2 sm:p-3 text-left rounded-l-lg bg-slate-500 text-white">Nama Siswa</th>
                              <th className="p-2 sm:p-3 text-left rounded-r-lg bg-slate-500 text-white">Kelas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedData.slice((currentPageModal - 1) * itemsPerPageModal, currentPageModal * itemsPerPageModal).map((item, index) => (
                              <tr key={index}>
                                <td className="p-3 sm:p-3 text-white border-b">{item.nama}</td>
                                <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-700 text-white">
                            Halaman {currentPageModal} dari {totalPagesModal}
                          </div>
                          <div className="flex m-4 space-x-2">
                            <button
                              onClick={handlePreviousPageModal}
                              disabled={currentPageModal === 1}
                              className={`px-2 py-1 border rounded ${currentPageModal === 1 ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"}`}
                            >
                              Previous
                            </button>
                            <button
                              onClick={handleNextPageModal}
                              disabled={currentPageModal >= totalPagesModal}
                              className={`px-2 py-1 border rounded ${currentPageModal >= totalPagesModal ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"}`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Tutup
                          </button>
                          <button
                            onClick={handleSubmit} // Pastikan kamu mendefinisikan fungsi handleSubmit
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Kirim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleClick('I')} // Tambah +1 di kolom keterangan lain
                  className="bg-orange-500  text-white w-44 px-4 py-2 rounded"
                >
                  Keterangan Lain
                </button>
              </div>             
            </div>
            <div className="relative inline-block text-left">
              <div onClick={toggleDropdown} className="text-white px-4 py-2 rounded flex items-center">
                <span className="flex items-end text-gray-200">
                  {isOpen ? "<" : ">"}
                  {isOpen && (
                    <div className="absolute left-8 border rounded shadow-lg -mb-2">
                      <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                        onClick={handleButtonClick} // Ketika tombol "Pulang" diklik
                      >
                        Pulang
                      </button>
                    </div>
                  )}
                </span>
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
                    Data Absen
                  </h2>
                </div>          
              </div>
             {/* Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
            <div className="lg:flex-row justify-between items-center">
              
            </div>
              {/* <div className=" items-center lg:mb-0 space-x-2 lg:order-1">
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={handleSearchChange}
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
                  </div> */}
            </div>
            {/* tabel */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <p>Loading data...</p>
              ) : (
                <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg bg-slate-500 text-white">No</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">Kelas</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">Jumlah</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">H</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">S</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">I</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">A</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">T</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">Walas</th>
                      <th className="p-2 sm:p-3 rounded-r-lg bg-slate-500 text-white">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-3 sm:p-3 text-white border-b">{index + 1}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jumlah}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.hadir || 0}</td>
                        <td className="p-2 sm:p-3 text-white border-b">{item.sakit}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.keteranganLain}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.alpha}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.terlambat}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.walas}</td>
                        <td className="p-3 sm:p-3 text-white border-b text-center">
                        <DropdownMenu
                            isOpen={openDropdown === item.no}
                            onClick={() => handleDropdownClick(item.no)}
                            onDelete={() => handleDeleteClick(item.no)}
                            onEdit={() => handleEditClick(item.no)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
              {/* <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700 text-white">
                
              </div>
              <div className="flex m-4 space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className={`px-2 py-1 border rounded ${
                    !hasNextPage ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
              </div> */}
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
                  id="keteranganLain"
                  type="number"
                  name="keteranganLain"
                  value={newData.keteranganLain}
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
    <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Scan Barcode</h2>
             <input 
                type="text" 
                value={barcode} 
                onChange={handleBarcodeChange} 
                placeholder="Scan Barcode" 
              />
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
"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from './header'
import DataTable from './components/dataTabel';
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import {
    addSiswa,
    fetchSiswa,
    deleteSiswa,
    updateSiswa,
    Siswa,
  } from "./api/siswa";
  import {
    addKelas,
    fetchKelas,
    deleteKelas,
    updateKelas,
    Kelas,
  } from "./api/kelas";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Page = () => {
    // State untuk kontrol popup Sakit
    const [isPopupVisibleSakit, setIsPopupVisibleSakit] = useState(false);
    // State untuk menyimpan data sakit yang dipilih
    const [selectedSakit, setSelectedSakit] = useState([]);
    const [tableData, setTableData] = useState([]);
  
  // State untuk pengaturan item per halaman dan halaman saat ini
  const [sakitItemsPerPage, setSakitItemsPerPage] = useState(5);
  const [sakitCurrentPage, setSakitCurrentPage] = useState(1);

  // Data contoh untuk item Sakit
  const sakitItems = [
    { name: 'Aldi', kelas: '1A' },
    { name: 'Budi', kelas: '1B' },
    { name: 'Citra', kelas: '1C' },
    { name: 'Diana', kelas: '1A' },
    { name: 'Eko', kelas: '1B' },
    { name: 'Fani', kelas: '1C' },
    { name: 'Gita', kelas: '2A' },
    { name: 'Hendra', kelas: '2B' },
    { name: 'Ika', kelas: '2C' },
    { name: 'Joko', kelas: '2A' },
    { name: 'Kiki', kelas: '2B' },
    { name: 'Lina', kelas: '2C' },
    { name: 'Maya', kelas: '3A' },
    { name: 'Nia', kelas: '3B' },
    { name: 'Omar', kelas: '3C' },
];
 // Contoh data
  const sakitTotalPages = Math.ceil(sakitItems.length / sakitItemsPerPage);

  // Fungsi untuk mengubah item per halaman
  const handleSakitItemsPerPageChange = (e) => {
    setSakitItemsPerPage(parseInt(e.target.value));
  };

  // Mengambil item Sakit yang ditampilkan berdasarkan halaman saat ini
  const currentItemsSakit = sakitItems.slice(
    (sakitCurrentPage - 1) * sakitItemsPerPage,
    sakitCurrentPage * sakitItemsPerPage
  );

  //Handle untuk ngirim sakit
  const handleSakitSubmit = () => {
    if (selectedSakit) {
        setTableData((prevData) => {
            // Cek apakah kelas dari siswa yang dipilih sudah ada di tableData
            const updatedData = prevData.map((data) => {
                if (data.kelas === selectedSakit.kelas) {
                    // Jika kelas cocok, tambahkan 1 ke kolom "s"
                    return {
                        ...data,
                        s: data.s ? data.s + 1 : 1, // Jika "s" belum ada, mulai dari 1
                    };
                }
                return data; // Jika kelas tidak cocok, biarkan tetap sama
            });

            return updatedData;
        });

        // Reset pilihan setelah kirim
        setSelectedSakit(null);
        togglePopupSakit(); // Tutup popup setelah kirim
    }
  };
  // Fungsi untuk menambahkan siswa yang dipilih ke selectedSakit
  const handleSakitSelect = (item) => {
    setSelectedSakit(item); // Menyimpan item yang dipilih
    setSearchTermSakit(item.name);
  };

  //function untuk search
  const [searchTermSakit, setSearchTermSakit] = useState('');
  const handleSearchSakitChange = (event) => {
    setSearchTermSakit(event.target.value);
  };
  const filteredSakitItems = sakitItems.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchTermSakit.toLowerCase());
    const kelasMatch = item.kelas.toLowerCase().includes(searchTermSakit.toLowerCase());
    return nameMatch || kelasMatch;
  });

  // Fungsi untuk toggle popup Sakit
  const togglePopupSakit = () => {
    if (isPopupVisibleSakit) {
      // Jika popup ditutup, reset kembali items per page, halaman, dan search ke default
      setSakitItemsPerPage(5); // Kembali ke default 5 item per halaman
      setSakitCurrentPage(1); // Kembali ke halaman 1
      setSearchTermSakit(''); // Kosongkan search input
    }
    setIsPopupVisibleSakit(!isPopupVisibleSakit); // Tampilkan atau sembunyikan popup
  };

  // State untuk kontrol popup keterangan lain
  const [isPopupVisibleKeteranganLain, setIsPopupVisibleKeteranganLain] = useState(false);
  
   // State untuk menyimpan data keterangan lain yang dipilih
   const [selectedKeteranganLain, setSelectedKeteranganLain] = useState([]);

  // State untuk pengaturan item per halaman dan halaman saat ini
  const [keteranganItemsPerPage, setKeteranganItemsPerPage] = useState(5);
  const [keteranganCurrentPage, setKeteranganCurrentPage] = useState(1);
  
  // Data contoh untuk item keterangan lain bisa diganti secara dinamis
  const keteranganItems = [
    { name: 'Aldi', kelas: '1A' },
    { name: 'Budi', kelas: '1B' },
    { name: 'Citra', kelas: '1C' },
    { name: 'Diana', kelas: '1A' },
    { name: 'Eko', kelas: '1B' },
    { name: 'Fani', kelas: '1C' },
    { name: 'Gita', kelas: '2A' },
    { name: 'Hendra', kelas: '2B' },
    { name: 'Ika', kelas: '2C' },
    { name: 'Joko', kelas: '2A' },
    { name: 'Kiki', kelas: '2B' },
    { name: 'Lina', kelas: '2C' },
    { name: 'Maya', kelas: '3A' },
    { name: 'Nia', kelas: '3B' },
    { name: 'Omar', kelas: '3C' },
  ];

  //Handle untuk ngirim keterangan lain
  const handleKeteranganLainSubmit = () => {
    if (selectedKeteranganLain) {
        setTableData((prevData) => {
            // Cek apakah kelas dari siswa yang dipilih sudah ada di tableData
            const updatedData = prevData.map((data) => {
                if (data.kelas === selectedKeteranganLain.kelas) {
                    // Jika kelas cocok, tambahkan 1 ke kolom "s"
                    return {
                        ...data,
                        i: data.i ? data.i + 1 : 1, // Jika "s" belum ada, mulai dari 1
                    };
                }
                return data; // Jika kelas tidak cocok, biarkan tetap sama
            });

            return updatedData;
        });

        // Reset pilihan setelah kirim
        setSelectedKeteranganLain(null);
        togglePopupKeteranganLain(); // Tutup popup setelah kirim
    }
  };
     // Fungsi untuk menambahkan siswa yang dipilih ke selectedKeteranganLain
    const handleKeteranganLainSelect = (item) => {
        setSelectedKeteranganLain(item); // Menyimpan item yang dipilih
        setSearchTermKeterangan(item.name);
    };

  // Contoh data
  const keteranganTotalPages = Math.ceil(keteranganItems.length / keteranganItemsPerPage);
  //state input keterangan lain
  const [inputketeranganLain, setInputKeteranganLain] = useState('');
// Fungsi untuk toggle popup Keterangan Lain
  const togglePopupKeteranganLain = () => {
    if (isPopupVisibleKeteranganLain) {
        // Jika popup ditutup, reset kembali items per page, halaman, dan search ke default
        setKeteranganItemsPerPage(5); // Kembali ke default 5 item per halaman
        setKeteranganCurrentPage(1); // Kembali ke halaman 1
        setSearchTermKeterangan(''); // Kosongkan search input
      }
      setIsPopupVisibleKeteranganLain(!isPopupVisibleKeteranganLain); // Tampilkan atau sembunyikan popup
  };

  // Fungsi untuk mengubah item per halaman
  const handleKeteranganItemsPerPageChange = (event) => {
    setKeteranganItemsPerPage(parseInt(event.target.value, 10));
    setKeteranganCurrentPage(1); // Reset ke halaman 1 saat item per page berubah
  };

  //function untuk search
  const [searchTermKeterangan, setSearchTermKeterangan] = useState('');
  const handleKeteranganSearchChange = (event) => {
    setSearchTermKeterangan(event.target.value);
  };
  const filteredKeteranganItems = keteranganItems.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchTermKeterangan.toLowerCase());
    const kelasMatch = item.kelas.toLowerCase().includes(searchTermKeterangan.toLowerCase());
    return nameMatch || kelasMatch;
  });
  
  //function untuk pulang
  const [isOpen, setIsOpen] = useState(false);
  // State untuk kontrol popup pulang
  const [isPopupVisiblePulang, setIsPopupVisiblePulang] = useState(false);
  // State untuk menyimpan data pulang yang dipilih
  const [selectedPulang, setSelectedPulang] = useState([]);
  // State untuk pengaturan item per halaman dan halaman saat ini
  const [pulangItemsPerPage, setPulangItemsPerPage] = useState(5);
  const [pulangCurrentPage, setPulangCurrentPage] = useState(1);
  // Data contoh untuk item pulang bisa diganti secara dinamis
  const pulangItems = [
    { name: 'Aldi', kelas: '1A' },
    { name: 'Budi', kelas: '1B' },
    { name: 'Citra', kelas: '1C' },
    { name: 'Diana', kelas: '1A' },
    { name: 'Eko', kelas: '1B' },
    { name: 'Fani', kelas: '1C' },
    { name: 'Gita', kelas: '2A' },
    { name: 'Hendra', kelas: '2B' },
    { name: 'Ika', kelas: '2C' },
    { name: 'Joko', kelas: '2A' },
    { name: 'Kiki', kelas: '2B' },
    { name: 'Lina', kelas: '2C' },
    { name: 'Maya', kelas: '3A' },
    { name: 'Nia', kelas: '3B' },
    { name: 'Omar', kelas: '3C' },
  ];
  
  //Handle untuk ngirim pulang
  const handlePulangSubmit = () => {
    if (selectedPulang) {
        setTableData((prevData) => {
            // Cek apakah kelas dari siswa yang dipilih sudah ada di tableData
            const updatedData = prevData.map((data) => {
                if (data.kelas === selectedPulang.kelas) {
                    // Jika kelas cocok, tambahkan 1 ke kolom "s"
                    return {
                        ...data,
                        i: data.i ? data.i + 1 : 1, // Jika "s" belum ada, mulai dari 1
                    };
                }
                return data; // Jika kelas tidak cocok, biarkan tetap sama
            });

            return updatedData;
        });

        // Reset pilihan setelah kirim
        setSelectedPulang(null);
        togglePopupPulang(); // Tutup popup setelah kirim
    }
  };

  // Fungsi untuk menambahkan siswa yang dipilih ke selectedPulang
  const handlePulangSelect = (item) => {
    setSelectedPulang(item); // Menyimpan item yang dipilih
    setSearchTermPulang(item.name);
  };

  // Contoh data
  const pulangTotalPages = Math.ceil(pulangItems.length / pulangItemsPerPage);
  
  //state input keterangan lain
  const [inputPulang, setInputPulang] = useState('');

  // Handler untuk membuka/tutup dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Fungsi untuk toggle popup pulang
  const togglePopupPulang = () => {
    if (isPopupVisiblePulang) {
        // Jika popup ditutup, reset kembali items per page, halaman, dan search ke default
        setPulangItemsPerPage(5); // Kembali ke default 5 item per halaman
        setPulangCurrentPage(1); // Kembali ke halaman 1
        setSearchTermPulang(''); // Kosongkan search input
      }
      setIsPopupVisiblePulang(!isPopupVisiblePulang); // Tampilkan atau sembunyikan popup
  };

  // Fungsi untuk mengubah item per halaman
  const handlePulangItemsPerPageChange = (event) => {
    setPulangItemsPerPage(parseInt(event.target.value, 10));
    setPulangCurrentPage(1); // Reset ke halaman 1 saat item per page berubah
  };

  //function untuk search
  const [searchTermPulang, setSearchTermPulang] = useState('');
  const handlePulangSearchChange = (event) => {
    setSearchTermPulang(event.target.value);
  };
  const filteredPulangItems = pulangItems.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(searchTermPulang.toLowerCase());
    const kelasMatch = item.kelas.toLowerCase().includes(searchTermPulang.toLowerCase());
    return nameMatch || kelasMatch;
  });

  // data untuk tabel absensi 
//   const [tableData, setTableData] = useState([
//     { no: 1, kelas: '1 A', jumlah: 30, h: 0, s: 0, i: 0, a: 0, t: 0, walas: 'Mr. A', barcode: ['(242)501013', '(242)501069'] },
//     { no: 2, kelas: '1 B', jumlah: 28, h: 0, s: 0, i: 0, a: 0, t: 0, walas: 'Ms. B', barcode: ['(242)501006', '(242)501084'] },
//     { no: 3, kelas: '11 D', jumlah: 25, h: 0, s: 0, i: 0, a: 0, t: 0, walas: 'Dimaz', barcode: ['(K242501029)', '(242)501039'] }
// ]);
const [kelas, setKelas] = useState<Kelas[]>([]);
const fetchKelasSiswaTotal = async () => {
    try {
      const response = await axios.get(`${baseUrl}/joinNonMaster/KelasSiswaTotal`);
      setKelas(response.data); // Menyimpan data ke state kelas
    } catch (error) {
      console.error("Fetch error:", error); // Menangani kesalahan
    }
  };

  useEffect(() => {
    fetchKelasSiswaTotal(); // Panggil fungsi fetch saat komponen di-mount
  }, []);
const tableColumns = [
    
    { header: 'Kelas', accessor: 'kelas' as keyof Kelas },
    { header: 'Jumlah siswa', accessor: 'jumlah siswa' as keyof Siswa },
    { header: 'H', accessor: 'h' as keyof Siswa },
    { header: 'S', accessor: 's' as keyof Siswa },
    { header: 'I', accessor: 'i' as keyof Siswa },
    { header: 'A', accessor: 'a' as keyof Siswa },
    { header: 'T', accessor: 't' as keyof Siswa },
    { header: 'Walas', accessor: 'walas' as keyof Siswa },
    { header: 'Barcode', accessor: 'barcode' as keyof Siswa },
    
  ];


  //variabel  dan function untuk barcode 
  const [barcode, setBarcode] = useState('');
  const [timer, setTimer] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const normalizeBarcode = (barcode) => {
    // Menghilangkan tanda kurung `)` yang berlebihan
    const cleanedBarcode = barcode.replace(/\)/g, '');
    // Menghilangkan tanda kurung `(` yang tidak perlu jika ada
    const finalBarcode = cleanedBarcode.replace(/\(/g, '');
    return `(${finalBarcode})`; // Menyusun ulang barcode dengan format yang benar
};

// Gunakan di `handleBarcodeChange`
const handleBarcodeChange = (e) => {
    const normalizedBarcode = normalizeBarcode(e.target.value);
    setBarcode(normalizedBarcode);

    console.log("Barcode setelah dinormalisasi:", normalizedBarcode);

    if (timer) {
        clearTimeout(timer);
    }

    setTimer(setTimeout(saveBarcodeToH, 500));
};



    //state untuk inputan terhidden dan mengarah ke crusor
    const barcodeInputRef = useRef(null);
    useEffect(() => {
        // Mengarahkan fokus ke input saat komponen dimuat
        if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        }
    }, []);

    const saveBarcodeToH = () => {
        const today = new Date().toLocaleDateString(); // Mengambil tanggal hari ini
    
        console.log("Barcode yang dipindai:", barcode);
    
        // Cari item di tableData yang memiliki barcode yang sesuai
        const existingItem = tableColumns.find(item => {
            console.log(`Memeriksa barcodes di kelas ${item.kelas}:`, item.barcode);
            return item.barcode.includes(barcode);
        });
    
        console.log("Item ditemukan:", existingItem);
    
        if (existingItem) {
            // Cek jika item sudah absen pada hari ini
            if (existingItem.lastAbsen === today) {
                showPopup(`Sudah absen: ${existingItem.walas}, kelas ${existingItem.kelas}`);
            } else {
                const updatedData = tableColumns.map((item) => {
                    if (item.barcode.includes(barcode)) {
                        const hadirCount = (item.h || 0) + 1;
                        return { 
                            ...item, 
                            h: hadirCount, 
                            lastAbsen: today // Update tanggal absen terakhir
                        };
                    }
                    return item;
                });
    
                setTableData(updatedData);
                showPopup(`Absen berhasil: ${existingItem.walas}, kelas ${existingItem.kelas}`);
            }
        } else {
            if (!barcode.trim()) {
                showPopup('ID tidak boleh kosong');
            } else {
                showPopup('ID tidak terdaftar');
            }
        }
    
        setBarcode(''); // Reset input barcode setelah disimpan
    };
    
    
    const showPopup = (message) => {
        setPopupMessage(message);
        setTimeout(() => {
            setPopupMessage('');
        }, 1500);
    };
  
    //state untuk dropdown aksi
    const [openDropdown, setOpenDropdown] = useState(null);
    const handleDropdownClick = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
      };
    //state edit  

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
                    <div className="flex space-x-4">
                        <button
                            className="bg-blue-500 w-44 text-white px-4 py-2 mr-2 rounded"
                            onClick={togglePopupSakit}
                        >
                            Sakit
                        </button>
                        {isPopupVisibleSakit && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                <div className="bg-white p-3 rounded shadow-md">
                                    <div className="bg-slate-600 p-2 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <select
                                                className="border border-gray-300 rounded px-2 py-1"
                                                value={sakitItemsPerPage}
                                                onChange={handleSakitItemsPerPageChange}
                                            >
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="12">12</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="border border-gray-300 rounded px-2 py-1"
                                                value={searchTermSakit}
                                                onChange={handleSearchSakitChange} // Tambahkan handler untuk pencarian
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <table className="min-w-full  border-gray-300">
                                                <thead>
                                                    <tr className="bg-slate-500 text-left">
                                                        <th className=" rounded-l-lg text-white px-4 py-2">Nama</th>
                                                        <th className=" rounded-r-lg text-white px-4 py-2">Kelas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredSakitItems
                                                        .slice((sakitCurrentPage - 1) * sakitItemsPerPage, sakitCurrentPage * sakitItemsPerPage)
                                                        .map((item, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b hover:bg-slate-400 hover:rounded cursor-pointer "
                                                                onClick={() => handleSakitSelect(item)} // Pilih item yang sakit
                                                            >
                                                                <td className=" text-white   px-4 py-2">{item.name}</td>
                                                                <td className=" text-white  px-4 py-2">{item.kelas}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>

                                            </table>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button
                                                className={`px-2 py-1 rounded ${sakitTotalPages === 0 || sakitCurrentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                                                disabled={sakitTotalPages === 0 || sakitCurrentPage === 1}
                                                onClick={() => setSakitCurrentPage(sakitCurrentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            <span className='text-white'>
                                                Page {sakitItems.length > 0 ? sakitCurrentPage : 0} of {sakitTotalPages}
                                            </span>
                                            <button
                                                className={`px-2 py-1 rounded ${sakitTotalPages === 0 || sakitCurrentPage === sakitTotalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                                                disabled={sakitTotalPages === 0 || sakitCurrentPage === sakitTotalPages}
                                                onClick={() => setSakitCurrentPage(sakitCurrentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                onClick={togglePopupSakit}
                                            >
                                                Close
                                            </button>
                                            <button 
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                                                onClick={handleSakitSubmit}
                                            >
                                                Kirim
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button 
                            className="bg-orange-500 w-44 text-white px-4 py-2 mr-2 rounded"
                            onClick={togglePopupKeteranganLain} // Panggil fungsi untuk toggle pop-up
                        >
                            Keterangan Lain
                        </button>
                        {isPopupVisibleKeteranganLain && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                <div className="bg-white p-3 rounded shadow-md">
                                    <div className="bg-slate-600 p-2 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <select
                                                className="border border-gray-300 rounded px-2 py-1"
                                                value={keteranganItemsPerPage} // Ganti dengan state yang sesuai
                                                onChange={handleKeteranganItemsPerPageChange} // Ganti dengan handler yang sesuai
                                            >
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="12">12</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="border border-gray-300 rounded px-2 py-1"
                                                onChange={handleKeteranganSearchChange} // Handler pencarian untuk keterangan
                                            />
                                        </div>

                                        {/* Input untuk mengisi keterangan lain */}
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                placeholder="Alasannya..."
                                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                                value={inputketeranganLain} // State untuk menyimpan nilai input keterangan lain
                                                onChange={(e) => setInputKeteranganLain(e.target.value)} // Handler untuk mengubah state keterangan lain
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr 
                                                    className="bg-slate-500"
                                                    onClick={() => handleKeteranganLainSelect(item)}
                                                    >
                                                        <th className="text-white text-left rounded-l-lg px-4 py-2">Nama</th>
                                                        <th className="text-white text-left rounded-r-lg px-4 py-2">Kelas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredKeteranganItems // Ganti dengan daftar yang sesuai
                                                        .slice((keteranganCurrentPage - 1) * keteranganItemsPerPage, keteranganCurrentPage * keteranganItemsPerPage)
                                                        .map((item, index) => (
                                                            <tr 
                                                                key={index}
                                                                className='border-b hover:bg-slate-300 cursor-pointer" // Tambahkan hover dan cursor'
                                                                onClick={() => handleKeteranganLainSelect(item)} // Pilih item yang ket lain

                                                            >
                                                                <td className="border-b text-white px-4 py-2">{item.name}</td>
                                                                <td className="border-b text-white px-4 py-2">{item.kelas}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button
                                                className={`px-2 py-1 rounded ${keteranganTotalPages === 0 || keteranganCurrentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                                                disabled={keteranganTotalPages === 0 || keteranganCurrentPage === 1}
                                                onClick={() => setKeteranganCurrentPage(keteranganCurrentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            <span className='text-white'>
                                                Page {filteredKeteranganItems.length > 0 ? keteranganCurrentPage : 0} of {keteranganTotalPages}
                                            </span>
                                            <button
                                                className={`px-2 py-1 rounded ${keteranganTotalPages === 0 || keteranganCurrentPage === keteranganTotalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                                                disabled={keteranganTotalPages === 0 || keteranganCurrentPage === keteranganTotalPages}
                                                onClick={() => setKeteranganCurrentPage(keteranganCurrentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                onClick={togglePopupKeteranganLain} // Fungsi untuk menutup pop-up
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                onClick={handleKeteranganLainSubmit} // Fungsi untuk kirim jika diperlukan
                                            >
                                                Kirim
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
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
            onClick={togglePopupPulang} // Ketika tombol "Pulang" diklik, buka pop-up
          >
            Pulang
          </button>
        </div>
      )}
    </span>
  </div>
            </div>
            {isPopupVisiblePulang && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-3 rounded shadow-md">
                <div className="bg-slate-600 p-2 rounded-lg">
                    <div className="flex items-center space-x-4">
                    <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={pulangItemsPerPage} // Ganti dengan state yang sesuai
                        onChange={handlePulangItemsPerPageChange} // Ganti dengan handler yang sesuai
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded px-2 py-1"
                        onChange={handlePulangSearchChange} // Handler pencarian untuk pulang
                    />
                    </div>

                    {/* Input untuk mengisi alasan pulang */}
                    <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Alasan pulang..."
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={inputPulang} // State untuk menyimpan nilai input alasan pulang
                        onChange={(e) => setInputPulang(e.target.value)} // Handler untuk mengubah state alasan pulang
                    />
                    </div>

                    <div className="mt-4">
                    <table className="min-w-full">
                        <thead>
                        <tr 
                            className="bg-slate-500"
                            onClick={() => handlePulangSelect(item)}
                        >
                            <th className="text-white text-left rounded-l-lg px-4 py-2">Nama</th>
                            <th className="text-white text-left rounded-r-lg px-4 py-2">Kelas</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPulangItems // Ganti dengan daftar yang sesuai
                            .slice((pulangCurrentPage - 1) * pulangItemsPerPage, pulangCurrentPage * pulangItemsPerPage)
                            .map((item, index) => (
                            <tr 
                                key={index}
                                className="border-b hover:bg-slate-300 cursor-pointer"
                                onClick={() => handlePulangSelect(item)} // Pilih item pulang
                            >
                                <td className="border-b text-white px-4 py-2">{item.name}</td>
                                <td className="border-b text-white px-4 py-2">{item.kelas}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>

                    <div className="flex justify-between mt-4">
                    <button
                        className={`px-2 py-1 rounded ${pulangTotalPages === 0 || pulangCurrentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                        disabled={pulangTotalPages === 0 || pulangCurrentPage === 1}
                        onClick={() => setPulangCurrentPage(pulangCurrentPage - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-white">
                        Page {filteredPulangItems.length > 0 ? pulangCurrentPage : 0} of {pulangTotalPages}
                    </span>
                    <button
                        className={`px-2 py-1 rounded ${pulangTotalPages === 0 || pulangCurrentPage === pulangTotalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'}`}
                        disabled={pulangTotalPages === 0 || pulangCurrentPage === pulangTotalPages}
                        onClick={() => setPulangCurrentPage(pulangCurrentPage + 1)}
                    >
                        Next
                    </button>
                    </div>

                    <div className="flex justify-between">
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={togglePopupPulang} // Fungsi untuk menutup pop-up
                    >
                        Close
                    </button>
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handlePulangSubmit} // Fungsi untuk kirim jika diperlukan
                    >
                        Kirim
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

        </div>
        
      </div>
        {/* Column 2: Table */}  
        <div className="w-full  lg:w-2/3 p-4 lg:p-6">          
            <div className="bg-white p-3 rounded shadow-md">
                <div className="bg-slate-600 p-2 rounded-lg">
                    <div className="p-2">
                        <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                            Data Absen
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={tableColumns}
                            data={kelas}
                        />
                        {/* <table className="w-full text-left mt-4 border-collapse">
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
                            {tableData.map((item, index) => (
                                <tr key={index} className="border-b">
                                <td className="p-2 sm:p-3 text-white">{item.no}</td>
                                <td className="p-2 sm:p-3 text-white">{item.kelas}</td>
                                <td className="p-2 sm:p-3 text-white">{item.jumlah}</td>
                                <td className="p-2 sm:p-3 text-white">{item.h}</td>
                                <td className="p-2 sm:p-3 text-white">{item.s}</td>
                                <td className="p-2 sm:p-3 text-white">{item.i}</td>
                                <td className="p-2 sm:p-3 text-white">{item.a}</td>
                                <td className="p-2 sm:p-3 text-white">{item.t}</td>
                                <td className="p-2 sm:p-3 text-white">{item.walas}</td>
                                <td className="p-2 sm:p-3 text-white">
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
                        </table>                   */}
                    </div>
                </div>             
            </div>
        </div>    
    </div>

    {/* scan barcode */}
    <div className="p-4">
            
            {popupMessage && (
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto max-w-xs bg-green-500 text-white p-4 rounded shadow-md transition-all duration-300 ${
                popupMessage.includes('Absen berhasil') ? 'bg-green-500' : 'bg-red-500'
                }`}
            >
                {popupMessage}
            </div>
            
            )}
            <input 
                ref={barcodeInputRef}
                type="text" 
                value={barcode} 
                onChange={handleBarcodeChange} 
                placeholder="Scan Barcode"
                className=" pointer-events-none" // Menyembunyikan input
            />
        </div>
    </>
  )
}
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
export default Page

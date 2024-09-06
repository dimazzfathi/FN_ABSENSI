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
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableDataSiswa")) || [];
    setTableData(savedData);

    const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    setImagePreview(savedImage);
  }
  }, []);

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
  
  // Fungsi untuk menangani perubahan gambar profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); // Menyimpan data URL gambar untuk pratayang
          setFotoValue(reader.result); // Menyimpan data URL gambar untuk digunakan nanti
        };
        reader.readAsDataURL(file);
    }
};
  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    const newData = [
      ...tableData,
      { no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
        namaSiswa: namaSiswaValue,
        ttl: ttlValue,
        jk: jkValue,
        alamat: alamatValue,
        email: emailValue,
        username: usernameValue,
        password: passwordValue,
        noWali: noWaliValue,
        foto: fotoValue || "", // Handle file URL
        peran: peranValue,
        },
    ];

    setTableData(newData);
    localStorage.setItem("tableDataSiswa", JSON.stringify(newData)); // Simpan ke Local Storage
  
    setPeranValue(""); // Mengosongkan input peran setelah disimpan
    setNoWaliValue("");
    setUsernameValue("");
    setPasswordValue("");
    setFotoValue(null);
    setAlamatValue("");
    setEmailValue("");
    setJkValue("");
    setNamaSiswaValue("");
    setTtlValue("");
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setPeranValue(item.peran);
    setNoWaliValue(item.noWali);
    setUsernameValue(item.username);
    setPasswordValue(item.password);
    setPreviewURL(item.imagePreview); // Set preview URL for the edit modal
    setAlamatValue(item.alamat);
    setEmailValue(item.email);
    setJkValue(item.jk);
    setNamaSiswaValue(item.namaSiswa);
    setTtlValue(item.ttl);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? { ...item,
            namaSiswa: namaSiswaValue,
            ttl: ttlValue,
            jk: jkValue,
            alamat: alamatValue,
            email: emailValue,
            username: usernameValue,
            password: passwordValue,
            noWali: noWaliValue,
            foto: fotoValue || "", // Handle file URL
            peran: peranValue,
             }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataSiswa", JSON.stringify(updatedData));

    setShowEditModal(false);
    setPeranValue("");
    setNoWaliValue("");
    setUsernameValue("");
    setPasswordValue("");
    setFotoValue(null);
    setAlamatValue("");
    setJkValue("");
    setNamaSiswaValue("");
    setTtlValue("");
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
    localStorage.setItem("tableDataSiswa", JSON.stringify(updatedData)); // Update localStorage
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

  // Filter dan pencarian logika
  const filteredData = tableData.filter(item => {
    const searchLowerCase = searchTerm.toLowerCase();

    return (
      (filterPeran ? item.peran === filterPeran : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (searchTerm ? (
        (typeof item.ttl === 'string' && item.ttl.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaSiswa === 'string' && item.namaSiswa.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.peran === 'string' && item.peran.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jurusan === 'string' && item.jurusan.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jk === 'string' && item.jk.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.email === 'string' && item.email.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.noWali === 'string' && item.noWali.toLowerCase().includes(searchLowerCase))
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
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //baru
  const [showButtons, setShowButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  // Ambil data dari local storage saat pertama kali komponen dimuat
  const [dataAbsensi, setDataAbsensi] = useState<any[]>([]);
  // Data untuk tabel kedua (data yang sudah dikirim)
  const [dataTerkirim, setDataTerkirim] = useState<any[]>([]);

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

  // Fungsi untuk menangani pengiriman data
  const handleKirim = (item) => {
    // Hapus item dari dataAbsensi
    const updatedDataAbsensi = dataAbsensi.filter(data => data.id !== item.id);
    setDataAbsensi(updatedDataAbsensi);

    // Tambahkan item ke dataTerkirim
    const updatedDataTerkirim = [...dataTerkirim, item];
    setDataTerkirim(updatedDataTerkirim);

    // Update local storage
    localStorage.setItem('dataAbsensi', JSON.stringify(updatedDataAbsensi));
    localStorage.setItem('dataTerkirim', JSON.stringify(updatedDataTerkirim));
  };

  useEffect(() => {
    const savedData = localStorage.getItem('dataAbsensi');
    const parsedData = savedData ? JSON.parse(savedData) : [];
    setDataAbsensi(parsedData);
  }, []);

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('dataAbsensi');
    const parsedData = savedData ? JSON.parse(savedData) : [];
    setDataAbsensi(parsedData);
  }
}, []);

  useEffect(() => {
    localStorage.setItem('dataAbsensi', JSON.stringify(dataAbsensi));
  }, [dataAbsensi]);
  
  useEffect(() => {
    localStorage.setItem('dataTerkirim', JSON.stringify(dataTerkirim));
  }, [dataTerkirim]);
  
  
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
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">NO</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">NAMA</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">KELAS</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">KETERANGAN</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                {dataAbsensi.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b border-gray-300 text-sm">{index.id}</td>
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
                  {dataTerkirim.map((item, index) => (
                      <tr key={index}>
                        <td className="p-3 sm:p-3 text-white border-b">{item.id}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jumlah}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.H}</td>
                        <td className="p-2 sm:p-3 border-b border-gray-300">{item.keterangan === 'Sakit' ? '1' : '-'}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.I}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.A}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.T}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.walas}</td>
                        <td className="p-3 sm:p-3 text-white border-b text-center">
                        {/* // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
                        // isOpen: Menentukan apakah dropdown saat ini terbuka berdasarkan nomor item.
                        // onClick: Fungsi untuk menangani aksi klik pada dropdown untuk membuka atau menutupnya.
                        // onDelete: Fungsi untuk memicu proses penghapusan data ketika opsi 'Hapus' dalam dropdown diklik. */}
                         {/* <DropdownMenu
                            isOpen={openDropdown === item.id}
                            onClick={() => handleDropdownClick(item.id)}
                            onDelete={() => handleDeleteClick(item.id)}
                            onEdit={() => handleEditClick(item.id)} /> */}
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
    </div>
    </>

    
  );
}// Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
// function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
//   const dropdownRef = useRef(null);

//   // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
//   const handleClickOutside = (event) => {
//     console.log('Clicked outside'); // Debugging
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       console.log('Outside detected'); // Debugging
//       if (typeof onClose === 'function') {
//         onClose(); // Memanggil fungsi onClose untuk menutup dropdown
//       }
//     }
//   };
//   //untuk detail
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmedPassword, setConfirmedPassword] = useState('');

//   const handleDetailClick = () => {
//     setIsModalOpen(true);
//     if (typeof onClose === 'function') {
//       onClose(); // Menutup dropdown setelah detail diklik
//     }
//   };
//   const handleConfirm = (password) => {
//     setConfirmedPassword(password); // Menyimpan password di state
//   };
//   //detail end

//   useEffect(() => {
//     console.log('Effect ran', isOpen); // Debugging
//     // Menambahkan event listener untuk menangani klik di luar dropdown jika dropdown terbuka.
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       // Menghapus event listener ketika dropdown ditutup.
//       document.removeEventListener('mousedown', handleClickOutside);
//     }

//     // Cleanup function untuk menghapus event listener saat komponen di-unmount atau isOpen berubah.
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       console.log('Cleanup'); // Debugging
//     };
//   }, [isOpen]);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={onClick}
//         className="p-1 z-40 text-white text-xs sm:text-sm"
//       >
//         &#8942;
//       </button>
//       {isOpen && (
//         <div
//           className="absolute z-50 mt-1 w-24 sm:w-32 bg-slate-600 border rounded-md shadow-lg"
//           style={{ left: '-62px', top: '20px' }} // Menggeser dropdown ke kiri
//         >
//           <button
//             className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//             onClick={handleDetailClick}
//           >
//             Detail
//           </button>
//           <Pw isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} />
//           <button
//             onClick={() => {
//               onEdit();
//               if (typeof onClose === 'function') {
//                 onClose(); // Menutup dropdown setelah edit diklik
//               }
//             }}
//             className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => {
//               onDelete();
//               if (typeof onClose === 'function') {
//                 onClose(); // Menutup dropdown setelah delete diklik
//               }
//             }}
//             className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//           >
//             Hapus
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

export default Page
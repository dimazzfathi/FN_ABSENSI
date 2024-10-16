"use client";
import { useState, useEffect, useRef } from "react";
import DataTable from "../../../components/dataTabel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter } from "next/navigation";
import {
  addKelas,
  fetchKelas,
  deleteKelas,
  updateKelas,
  Kelas,
} from "../../../api/kelas";
import { fetchAdmins, Admin } from "../../../api/admin";

export default function _Kelas() {
  const [isKelasValid, setIsKelasValid] = useState(true);
  const [isJurusanValid, setIsJurusanValid] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    //   const token = Cookies.get('token');
    //   console.log(token)
    // if (!token) {
    //   router.push('../../../login');
    //   return;
    // }

    // axios.defaults.headers.common['Authorization'] = token;
    const loadKelas = async () => {
      const response = await fetchKelas();
      console.log("API Kelas:", response); // Debugging tambahan
      const data = response.data;
      setKelas(data);
    };
    loadKelas();
  }, []);

  useEffect(() => {
    //   const token = Cookies.get('token');
    //   console.log(token)
    // if (!token) {
    //   router.push('../../../login');
    //   return;
    // }

    // axios.defaults.headers.common['Authorization'] = token;
    const loadKelas = async () => {
      const response = await fetchKelas();
      console.log("API Kelas:", response); // Debugging tambahan
      const data = response.data;
      setKelas(data);
    };
    loadKelas();
  }, []);

  const kelasColumns = [
    // { header: "No", accessor: (_: any, index: number) => index + 1 },
    // { header: "Admin", accessor: "id_admin" as keyof Admin },
    { header: "jurusan", accessor: "kelas" as keyof Kelas },
  ];

  const [kelasData, setKelasData] = useState({
    id_admin: "",
    kelas: "",
  });

  const handleKelasChange = (e) => {
    const { name, value } = e.target;
    setKelasData({
      ...kelasData,
      [name]: value,
    });
  };

  const handleKelasSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Pastikan semua field tidak kosong
    if (!kelasData.kelas) {
      toast.error("Data kelas tidak boleh kosong");
      return;
    }

    try {
      const response = await addKelas(kelasData);
      console.log("API response:", response);
      // Cek status respon
      if (response?.data?.exists) {
        // Gantilah dengan logika yang sesuai
        toast.error("Data sudah ada!"); // Menampilkan pesan jika data sudah ada
      } else {
        toast.success("Tahun kelas berhasil ditambahkan!"); // Menampilkan pesan sukses
        setKelasData({
          id_admin: "",
          kelas: "",
        });
      }
    } catch (error) {
      // Tangani kesalahan di sini
      console.error("Error adding kelas:", error);
      
      // Cek apakah error berasal dari response API
      if (error.response) {
          // Anda bisa menambahkan logika khusus di sini berdasarkan error dari API
          toast.error("Terjadi kesalahan saat menambah kelas: " + error.response.data.message);
      } else {
          toast.error("Terjadi kesalahan saat menambah kelas");
      }
  }
  };
  const handleEdit = async (updatedRow) => {
    try {
      // Pastikan updatedRow memiliki id_kelas
      if (!updatedRow.id_kelas) {
        throw new Error("ID Kelas tidak ditemukan");
      }

      // Update state di frontend
      setKelas((prevKelas) =>
        prevKelas.map((kelas) =>
          kelas.id_kelas === updatedRow.id_kelas ? updatedRow : kelas
        )
      );

      // Kirim request ke backend dengan id yang benar
      const updatedKelas = await updateKelas(updatedRow.id_kelas, updatedRow);
      toast.success("Data berhasil diperbarui!");
    } catch (error) {
      // Tampilkan lebih banyak detail error dari response server
      console.error(
        "Gagal memperbarui data di backend:",
        error.response?.data || error.message
      );
      toast.error(
        `Gagal memperbarui data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDelete = async (deletedRow) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kelas ${
        (deletedRow.id_admin, deletedRow.kelas)
      }?`
    );
    if (confirmed) {
      try {
        // Panggil fungsi delete kelas untuk menghapus di backend
        await deleteKelas(deletedRow.id_kelas);

        // Setelah sukses, update state di frontend
        setKelas((prevKelas) =>
          prevKelas.filter((Kelas) => Kelas.id_kelas !== deletedRow.id_kelas)
        );
        toast.success("kelas berhasil dihapus");
      } catch (error) {
        console.error("Error deleting kelas:", error);
        // Anda bisa menambahkan notifikasi atau pesan error di sini
      }
    }
  };
  //tombol untuk filter, pindah halaman, search dan reset
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default value is 5
  const [currentPage, setCurrentPage] = useState(1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); //  Reset ke halaman pertama saat jumlah item per halaman berubah
  };

  // Memfilter data berdasarkan searchTerm
  const filteredData = kelas.filter((item) => {
    // Asumsikan 'kelas' memiliki properti 'kelas' untuk dicari
    return (
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase())
      // item.id_admin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Menghitung pagination
  const totalData = filteredData.length; // Total item setelah difilter
  const startIndex = (currentPage - 1) * itemsPerPage; // Indeks awal untuk pagination
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  ); // Data yang akan ditampilkan
  const totalPages = Math.ceil(totalData / itemsPerPage); // Total halaman

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Fungsi untuk mengatur ulang pencarian
  const handleResetClick = () => {
    setSearchTerm(""); // Reset search term
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const isResettable = searchTerm.length > 0; // Tombol reset aktif jika ada input pencarian

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
                  className="text-teal-500 hover:underline hover:text-teal-600"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-500 hover:text-teal-600 hover:underline"
                >
                  Master Data
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-500 hover:text-teal-600 hover:underline"
                >
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
          <div className="w-full lg:w-1/2 p-4 lg:p-6">
            <form
              onSubmit={handleKelasSubmit}
              className="bg-white rounded-lg shadow-md p-4 lg:p-6 border"
            >
              <h2 className="text-sm mb-2 sm:text-sm font-bold"></h2>
              <h2 className="text-sm mb-2 sm:text-sm font-bold"> Kelas</h2>
              <input
                type="text"
                name="kelas"
                value={kelasData.kelas}
                onChange={handleKelasChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  isKelasValid ? "border-gray-300" : "border-red-500"
                }`}
                placeholder="Kelas"
              />
              {/* <select
                name="kelas"
                value={kelasData.kelas}
                onChange={handleKelasChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  isJurusanValid ? "border-gray-300" : "border-red-500"
                }`}
              >
                <option value="">Pilih Kelas</option>
                <option value="TKJ">Teknik Komputer Jaringan</option>
                <option value="DKV">Desain Komunikasi Visual</option>
                <option value="BD">Bisnis Digital</option>
                <option value="SIJA">Sistem Informasi Jaringan Aplikasi</option>
                <option value="TSM">Teknik Sepeda Motor</option>
              </select> */}
              <div className="flex m-4 space-x-2">
                <button
                  type="submit"
                  className="ml-auto px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </form>
            <ToastContainer className="mt-14" />
          </div>

          {/* Column 2: Table */}
          <div className="w-full  lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <div className="bg-slate-600 px-2 rounded-xl">
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div className="p-2">
                    <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                      Tabel Kelas
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
                    </button>
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <DataTable
                    columns={kelasColumns}
                    data={paginatedData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-700 text-white">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex overflow-hidden m-4 space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`px-2 py-1 border rounded ${
                        currentPage === 1
                          ? "bg-gray-300"
                          : "bg-teal-400 hover:bg-teal-600 text-white"
                      }  `}
                    >
                      Previous
                    </button>
                    <button
                      disabled={
                        currentPage === totalPages || paginatedData.length === 0
                      } // Disable tombol 'Next' jika sudah di halaman terakhir atau tidak ada data yang ditampilkan
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`px-2 py-1 border rounded ${
                        currentPage === totalPages
                          ? "bg-gray-300"
                          : "bg-teal-400 hover:bg-teal-600 text-white"
                      }  `}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
          {/* Modal untuk konfirmasi penghapusan
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
        )} */}
          {/* Modal untuk mengedit data */}
          {/* {showEditModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-sm pt-3 sm:text-2xl font-bold">Edit Data</h2>
             
              <input
                type="text"
                value={editKelasValue}
                onChange={(e) => setEditKelasValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Kelas..."
              />
              <select
                value={editJurusanOptions}
                onChange={(e) => setEditJurusanOptions(e.target.value)}
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
        )} */}
        </div>
      </div>
    </>
  );
} // Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
// function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
//     const dropdownRef = useRef(null);

//     // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
//     const handleClickOutside = (event) => {
//       console.log('Clicked outside'); // Debugging
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         console.log('Outside detected'); // Debugging
//         if (typeof onClick === 'function') {
//           onClick(); // Memanggil fungsi onClose untuk menutup dropdown
//         }
//       }
//     };

//     useEffect(() => {
//       console.log('Effect ran', isOpen); // Debugging
//       // Menambahkan event listener untuk menangani klik di luar dropdown jika dropdown terbuka.
//       if (isOpen) {
//         document.addEventListener('mousedown', handleClickOutside);
//       } else {
//         // Menghapus event listener ketika dropdown ditutup.
//         document.removeEventListener('mousedown', handleClickOutside);
//       }

//       // Cleanup function untuk menghapus event listener saat komponen di-unmount atau isOpen berubah.
//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//         console.log('Cleanup'); // Debugging
//       };
//     }, [isOpen]);

//     return (
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={onClick}
//           className="p-1 z-40  text-white text-xs sm:text-sm"

//         >
//           &#8942;
//         </button>
//         {isOpen && (
//           <div
//             className="absolute z-50 mt-1 w-24 sm:w-32 bg-slate-600 border rounded-md shadow-lg"
//             style={{ left: '-62px', top: '20px' }} // Menggeser dropdown ke kiri
//           >
//             <button
//               className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//               onClick={() => {
//                 alert('Detail clicked');
//                 if (typeof onClose === 'function') {
//                   onClose(); // Menutup dropdown setelah detail diklik
//                 }
//               }}
//             >
//               Detail
//             </button>
//             <button
//               onClick={() => {
//                 onEdit();
//                 if (typeof onClose === 'function') {
//                   onClose(); // Menutup dropdown setelah edit diklik
//                 }
//               }}
//               className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => {
//                 onDelete();
//                 if (typeof onClose === 'function') {
//                   onClose(); // Menutup dropdown setelah delete diklik
//                 }
//               }}
//               className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//             >
//               Hapus
//             </button>
//           </div>
//         )}
//       </div>
//     );
// }

// function FileUpload() {
//     const [file, setFile] = useState(null);
//     const fileInputRef = useRef(null);

//     const handleFileChange = (event) => {
//       const selectedFile = event.target.files[0];
//       setFile(selectedFile);
//     };

//     const handleClearFile = () => {
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''; // Reset input file
//       }
//     };

//     return (
//       <div>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2"
//         />
//         {file && (
//           <img
//             src={URL.createObjectURL(file)}
//             alt="Preview"
//             className="w-full border border-gray-300 rounded-lg mt-4"
//           />
//         )}
//         <button onClick={handleClearFile}>Clear File</button>
//       </div>
//     );
//   }

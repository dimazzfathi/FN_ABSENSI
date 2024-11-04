"use client";
import { useState, useEffect, useRef } from "react";
import { updateTahunAjaran, deleteTahunAjaran } from "../../../api/tahunAjaran";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addTahunAjaran,
  fetchTahunAjaran,
  TahunAjaran,
} from "../../../api/tahunAjaran";
import DataTable from "../../../components/dataTabel";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import Swal from "sweetalert2";
import useUserInfo from "@/app/components/useUserInfo";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function Tahun_Ajaran() {
  const [statusValue, setStatusValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>([]);
  const [isTahunAjaranValid, setIsTahunAjaranValid] = useState(true);
  const [editData, setEditData] = useState<TahunAjaran | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // Menyimpan ID baris yang dropdown-nya terbuka
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [selectedRow, setSelectedRow] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { namaAdmin, status, idAdmin } = useUserInfo();
  const [admins, setAdmins] = useState<{ id_admin: string; nama_admin: string }[]>([]);

  useEffect(() => {
    const fetchAdmin = async () => {
    try{
      const response = await axios.get(`${baseUrl}/admin/all-Admin`); // Ganti dengan endpoint Anda
      console.log("admin", response);
      setAdmins(response.data.data); // Simpan semua admin ke dalam state
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
    };
    fetchAdmin();
  }, []);
  useEffect(() => {
    const loadTahunAjaran = async () => {
      const response = await fetchTahunAjaran();
      console.log("Tahun ajaran:", response); // Debugging tambahan
      const data = response.data;
      setTahunAjaran(data);
    };
    loadTahunAjaran();
  }, []);

  const tahunAjaranColumns = [
    // { header: "No", accessor: "id_tahun_pelajaran" as keyof TahunAjaran },
    // { header: "Admin", accessor: "id_admin" as keyof TahunAjaran },
    { header: "Tahun Ajaran", accessor: "tahun" as keyof TahunAjaran },
    { header: "Status", accessor: "aktif" as keyof TahunAjaran },
    {
      header: "Aksi",
      Cell: ({ row }: { row: TahunAjaran }) => {
        return (
          <div>
            <button
              className="px-4 py-2 rounded"
              onClick={() => handleToggleDropdown(row.id_tahun_pelajaran)}
            >
              &#8942; {/* Simbol menu */}
            </button>
            {openDropdownId === row.id_tahun_pelajaran && ( // Hanya tampilkan dropdown jika id_tahun_pelajaran sesuai
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-md">
                <button
                  onClick={() => handleEditClick(row)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(row)}
                  className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-200"
                >
                  Hapus
                </button>
                <button
                  onClick={() => handleDetailClick(row)}
                  className="block w-full px-4 py-2 text-left text-sm text-black-700 hover:bg-gray-200"
                >
                  Detail
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];
  const handleDetailClick = (row: TahunAjaran) => {
    const admin = admins.find(admin => admin.id_admin === row.id_admin); // Cari admin berdasarkan id_admin
    console.log("id admin", admin)
    const namaAdmin = admin ? admin.nama_admin : "Tidak ada"; // Jika ditemukan, ambil nama_admin
    console.log("iki admin", namaAdmin)
    Swal.fire({
      html: `
        <div style="text-align: center;">
          <p>Tahun ajaran: ${JSON.stringify(row.tahun) || "Tidak ada"}</p>
          <p>Ditambah oleh: ${namaAdmin || "Tidak ada"}</p>
        </div>
      `,
      icon: "info",
      iconColor: "#009688",
      confirmButtonText: "Tutup",
      width: "400px", // Mengatur lebar popup agar lebih kecil
      confirmButtonColor: "#38b2ac", // Mengatur warna tombol OK (gunakan kode warna yang diinginkan)
    });
    setOpenDropdownId(null); // Tutup dropdown setelah melihat detail
  };
  const handleToggleDropdown = (id_tahun_pelajaran: string) => {
    setOpenDropdownId(
      openDropdownId === id_tahun_pelajaran ? null : id_tahun_pelajaran
    ); // Toggle dropdown
  };
  //.......untuk add data
  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    id_admin: idAdmin || "",
    tahun: "",
    aktif: "",
  });
  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    if (idAdmin) {
      setFormData((prevData) => ({
        ...prevData,
        id_admin: idAdmin,
      }));
    }
  }, [idAdmin]);
  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form data:", formData); // Log data yang dikirim

    // Validasi: Pastikan 'aktif' tidak kosong
    if (!formData.aktif.trim() || !formData.tahun.trim()) {
      toast.error("Data tidak boleh kosong"); // Menampilkan pesan error
      return; // Tidak melanjutkan jika 'aktif' kosong
    }

    try {
      // Memanggil fungsi untuk menambah data dan mendapatkan respon
      const response = await addTahunAjaran(formData);
      console.log("API response:", response);
      // Misalnya, fungsi addTahunAjaran mengembalikan objek yang berisi informasi tentang keberhasilan
      if (response?.data?.exists) {
        // Gantilah dengan logika yang sesuai
        toast.error("Data sudah ada!"); // Menampilkan pesan jika data sudah ada
      } else {
        toast.success("Tahun ajaran berhasil ditambahkan!"); // Menampilkan pesan sukses
        setTahunAjaran((prevTahunAjaran) => [
          ...prevTahunAjaran,
          response.data,
        ]);
        // Reset form setelah submit
        setFormData({
          id_admin: idAdmin,
          tahun: "",
          aktif: "",
        });
      }
    } catch (error) {
      // Tangani kesalahan di sini
      console.error("Error adding kelas:", error);

      // Cek apakah error berasal dari response API
      if (error.response) {
        // Anda bisa menambahkan logika khusus di sini berdasarkan error dari API
        toast.error(
          "Terjadi kesalahan saat menambah kelas: " +
            error.response.data.message
        );
      } else {
        toast.error("Terjadi kesalahan saat menambah kelas");
      }
    }
  };
  //handle hapus
  const handleDeleteClick = (row) => {
    setSelectedRow(row); // Simpan data yang ingin dihapus
    setIsConfirmOpen(true); // Buka modal
  };
  const handleConfirmDelete = async () => {
    try {
      // Panggil fungsi delete tahun ajaran untuk menghapus di backend
      await deleteTahunAjaran(selectedRow.id_tahun_pelajaran);

      // Setelah sukses, update state di frontend
      setTahunAjaran((prevTahunAjaran) =>
        prevTahunAjaran.filter(
          (tahunAjaran) =>
            tahunAjaran.id_tahun_pelajaran !== selectedRow.id_tahun_pelajaran
        )
      );
      toast.success(`Tahun ajaran ${selectedRow.tahun} berhasil dihapus`);
      setIsConfirmOpen(false); // Tutup modal
      setSelectedRow(null); // Reset selectedRow
    } catch (error) {
      console.error("Error deleting tahun ajaran:", error);
      toast.error("Gagal menghapus tahun ajaran");
    }
  };
  const handleCancel = () => {
    setIsConfirmOpen(false); // Tutup modal tanpa hapus
    setSelectedRow(null); // Reset selectedRow
  };
  // Fungsi untuk handle klik edit
  const handleEditClick = (row: TahunAjaran) => {
    setEditData(row); // Set data yang dipilih ke form edit
    setIsModalOpen(true); // Buka modal saat tombol edit diklik
  };
  // Handle perubahan input pada form edit
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // Handle update data setelah form edit disubmit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editData) {
      // Validasi sebelum mengupdate
      if (editData.id_tahun_pelajaran.trim() === "") {
        setIsTahunAjaranValid(false);
        return;
      }

      // Cek apakah ada perubahan
      const existingTahun = tahunAjaran.find(tahun => tahun.id_tahun_pelajaran === editData.id_tahun_pelajaran);
      if (existingTahun && existingTahun.aktif === editData.aktif) {
        toast.error("Tidak ada perubahan data yang dilakukan.");
        return;
      }

      try {
        await updateTahunAjaran(editData.id_tahun_pelajaran, editData);
        setTahunAjaran((prev) =>
          prev.map((tahun) =>
            tahun.id_tahun_pelajaran === editData.id_tahun_pelajaran
              ? { ...tahun, aktif: editData.aktif } // Update tahun dan aktif
              : tahun
          )
        );
        toast.success("Data berhasil diperbarui!");
        setIsModalOpen(false); // Tutup modal setelah sukses
        setOpenDropdownId(null); // Menutup dropdown setelah edit
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengedit data");
      }
    }
  };
  //tombol untuk filter, pindah halaman, search dan reset
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default value is 5
  const [currentPage, setCurrentPage] = useState(1);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };
  // Memfilter data berdasarkan searchTerm
  const filteredData = tahunAjaran.filter((item) => {
    // Asumsikan 'kelas' memiliki properti 'kelas' untuk dicari
    return (
      item.tahun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aktif.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold">Tahun Ajaran</h1>
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
              <li className="text-gray-500">Tahun Ajaran</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-4 lg:p-6 border"
            >
              <label
                name="id_admin"
                value={formData.id_admin}
                onChange={handleChange}
                hidden="none"
              >
                id_admin
              </label>
              <label
                htmlFor="id_tahun_pelajaran"
                className="block text-sm mb-2 sm:text-sm font-bold"
              >
                Tahun Ajaran
              </label>
              <input
                type="text"
                id="tahun"
                name="tahun"
                value={formData.tahun}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Tahun ajaran..."
              />
              <label
                className="block text-sm pt-3 mb-2 sm:text-sm font-bold"
              >
                Status
              </label>
              <select
                id="aktif"
                name="aktif"
                value={formData.aktif}
                onChange={handleChange}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  statusValue === "" ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Lulus">Lulus</option>
              </select>
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
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <DataTable
                    columns={tahunAjaranColumns}
                    data={paginatedData}
                    // onEdit={handleEdit}
                    // onDelete={handleDelete}
                  />
                  {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded p-4 shadow-lg">
                        <h3 className="pb-2">Edit Data Tahun Ajaran</h3>
                        <form onSubmit={handleEditSubmit}>
                          {/* Input untuk Tahun Ajaran */}
                          <input
                            type="text"
                            name="tahun"
                            value={editData ? editData.tahun : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2 "
                            placeholder="Tahun Ajaran..."
                          />

                          {/* Dropdown untuk Aktif */}
                          <div className="mb-2">
                            <label className="block text-sm sm:text-base">
                              Status Aktif
                            </label>
                            <select
                              name="aktif"
                              value={editData ? editData.aktif : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base"
                            >
                              <option value="">Pilih Status</option>
                              <option value="Aktif">Aktif</option>
                              <option value="Lulus">Lulus</option>
                            </select>
                          </div>

                          {/* Tombol Edit dan Tutup */}
                          <button
                            type="submit"
                            className="py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white rounded text-sm sm:text-base"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsModalOpen(false); // Tutup modal
                              setOpenDropdownId(null); // Tutup dropdown juga
                            }}
                            className="ml-2 py-2 sm:px-4 sm:py-2 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm sm:text-base"
                          >
                            Tutup
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                  {isConfirmOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-md">
                          <p>Apakah kamu yakin ingin menghapus item ini?</p>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={handleCancel}
                              className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                              Batal
                            </button>
                            <button
                              onClick={handleConfirmDelete}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center pb-4">
                  <div className="text-sm text-gray-700 text-white">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`px-2 py-1 border rounded ${
                        currentPage === 1
                          ? "bg-gray-300"
                          : "bg-teal-400 text-white"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      disabled={
                        currentPage === totalPages || paginatedData.length === 0
                      }
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`px-2 py-1 border rounded ${
                        currentPage === totalPages
                          ? "bg-gray-300"
                          : "bg-teal-400 text-white"
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
        {/* Modal untuk konfirmasi penghapusan */}
        {/* {confirmDelete.visible && (
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
        {/* {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Data</h2>
              <input
                type="text"
                value={editThnValue}
                onChange={(e) => setEditThnValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Tahun Ajaran..."
              />
              <select
                value={editStatusValue}
                onChange={(e) => setEditStatusValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-4"
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
        )} */}
      </div>
    </>
  );
} // Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
// function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
//   const dropdownRef = useRef(null);

//   // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
//   const handleClickOutside = (event) => {
//     console.log("Clicked outside"); // Debugging
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       console.log("Outside detected"); // Debugging
//       if (typeof onClick === "function") {
//         onClick(); // Memanggil fungsi onClose untuk menutup dropdown
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("Effect ran", isOpen); // Debugging
//     // Menambahkan event listener untuk menangani klik di luar dropdown jika dropdown terbuka.
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       // Menghapus event listener ketika dropdown ditutup.
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup function untuk menghapus event listener saat komponen di-unmount atau isOpen berubah.
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       console.log("Cleanup"); // Debugging
//     };
//   }, [isOpen]);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={onClick}
//         className="p-1 z-40  text-white text-xs sm:text-sm"
//       >
//         &#8942;
//       </button>
//       {isOpen && (
//         <div
//           className="absolute z-50 mt-1 w-24 sm:w-32 bg-slate-600 border rounded-md shadow-lg"
//           style={{ left: "-62px", top: "20px" }} // Menggeser dropdown ke kiri
//         >
//           <button
//             className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
//             onClick={() => {
//               alert("Detail clicked");
//               if (typeof onClose === "function") {
//                 onClose(); // Menutup dropdown setelah detail diklik
//               }
//             }}
//           >
//             Detail
//           </button>
//           <button
//             onClick={() => {
//               onEdit();
//               if (typeof onClose === "function") {
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
//               if (typeof onClose === "function") {
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

// function FileUpload() {
//   const [file, setFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleClearFile = () => {
//     setFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""; // Reset input file
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2"
//       />
//       {file && (
//         <img
//           src={URL.createObjectURL(file)}
//           alt="Preview"
//           className="w-full border border-gray-300 rounded-lg mt-4"
//         />
//       )}
//       <button onClick={handleClearFile}>Clear File</button>
//     </div>
//   );
// }

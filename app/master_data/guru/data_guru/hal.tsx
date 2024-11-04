"use client";
import React, { useState, useEffect, useRef } from "react";
import DataTable from "@/app/components/dataTabel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter } from "next/navigation";
import {
  addGuru,
  fetchGuru,
  deleteGuru,
  updateGuru,
  Guru,
} from "@/app/api/guru";

export default function DataGuru() {
  const handleDownloadFormatClick = () => {
    // Logika untuk mengunduh file format
    console.log("Unduh format");
  };
  const handleUploadFileClick = () => {
    // Logika untuk mengunggah file
    console.log("Upload file");
  };
  const [guru, setGuru] = useState<Guru[]>([]);
  const [editData, setEditData] = useState<Guru | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // Menyimpan ID baris yang dropdown-nya terbuka
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [selectedRow, setSelectedRow] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const [isGuruValid, setIsGuruValid] = useState(true);
  const [dataGuru, setDataGuru] = useState<Siswa[]>([]);
  const handleToggleDropdown = (id_guru: string) => {
    setOpenDropdownId(openDropdownId === id_guru ? null : id_guru); // Toggle dropdown
  };
  useEffect(() => {
    //   const token = Cookies.get('token');
    //   console.log(token)
    // if (!token) {
    //   router.push('../../../login');
    //   return;
    // }

    // axios.defaults.headers.common['Authorization'] = token;
    const loadGuru = async () => {
      const response = await fetchGuru();
      console.log("API Guru:", response); // Debugging tambahan
      const data = response.data;
      setGuru(data);
    };
    loadGuru();
  }, []);
  const guruColumns = [
    //adalah istilah yang digunakan dalam konteks tabel, terutama saat menggunakan pustaka seperti React Table, untuk menunjukkan kunci atau nama properti dalam data yang akan diambil dan ditampilkan di kolom tabel tertentu
    // { header: "No", accessor: (_: any, index: number) => index + 1 },
    // { header: "Guru", accessor: "id_guru" as keyof Guru },
    { header: "Admin", accessor: "id_admin" as keyof Guru },
    { header: "nip", accessor: "nip" as keyof Guru },
    { header: "Guru", accessor: "nama_guru" as keyof Guru },
    { header: "Jk", accessor: "jenis_kelamin" as keyof Guru },
    { header: "Mapel", accessor: "id_mapel" as keyof Guru },
    { header: "Email", accessor: "email" as keyof Guru },
    { header: "Pass", accessor: "pass" as keyof Guru },
    { header: "Foto", accessor: "foto" as keyof Guru },
    { header: "Walas", accessor: "walas" as keyof Guru },
    { header: "Barcode", accessor: "barcode" as keyof Guru },
    { header: "Kelas", accessor: "id_kelas" as keyof Guru },
    { header: "Rombel", accessor: "rombel" as keyof Guru },
    { header: "No", accessor: "no_telp" as keyof Guru },
    {
      header: "Aksi",
      Cell: ({ row }: { row: Guru }) => {
        return (
          <div>
            <button
              className="px-4 py-2 rounded"
              onClick={() => handleToggleDropdown(row.id_guru)}
            >
              &#8942; {/* Simbol menu */}
            </button>
            {openDropdownId === row.id_guru && ( // Hanya tampilkan dropdown jika id_guru sesuai
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-md">
                <button
                  onClick={() => handleEditClick(row)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClickk(row)}
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
  const [guruData, setGuruData] = useState({
    id_guru: "",
    id_admin: "",
    nip: "",
    nama_guru: "",
    jenis_kelamin: "",
    id_mapel: "",
    email: "",
    pass: "",
    foto: "",
    walas: "",
    barcode: "",
    id_kelas: [],
    rombel: "",
    no_telp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuruData({
      ...guruData,
      [name]: value,
    });
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setGuruData((prevData) => {
      const id_kelas = checked
        ? [...prevData.id_kelas, value] // Tambahkan kelas yang dipilih
        : prevData.id_kelas.filter((kelas) => kelas !== value); // Hapus kelas yang tidak dipilih
      return { ...prevData, id_kelas };
    });
  };
  const handleEditCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setEditData((prevData) => {
      // Pastikan prevData.id_kelas adalah array
      const currentKelas = Array.isArray(prevData.id_kelas)
        ? prevData.id_kelas
        : [];

      const updatedKelas = checked
        ? [...currentKelas, value] // Tambahkan kelas jika checked
        : currentKelas.filter((kelas) => kelas !== value); // Hapus kelas jika unchecked

      return {
        ...prevData,
        id_kelas: updatedKelas,
      };
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Ambil file pertama yang dipilih

    // Perbarui `editData` dengan file tersebut
    setEditData((prevData) => ({
      ...prevData,
      foto: file, // Simpan file ke dalam `foto`
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi: Pastikan semua field tidak kosong
    if (!guruData.nama_guru) {
      toast.error("Data kelas tidak boleh kosong");
      return;
    }

    try {
      const response = await addGuru(guruData);
      console.log("API response:", response);
      // Cek status respon
      if (response?.data?.exists) {
        // Gantilah dengan logika yang sesuai
        toast.error("Data sudah ada!"); // Menampilkan pesan jika data sudah ada
      } else {
        toast.success("Tahun Guru berhasil ditambahkan!"); // Menampilkan pesan sukses
        // Tambahkan Guru baru ke dalam GuruList
        setGuru((prevGuruList) => [...prevGuruList, response.data]);

        // Reset form
        setGuruData({
          id_guru: "",
          id_admin: "",
          nip: "",
          nama_guru: "",
          jenis_kelamin: "",
          id_mapel: "",
          email: "",
          pass: "",
          foto: "",
          walas: "",
          barcode: "",
          id_kelas: [],
          rombel: "",
          no_telp: "",
        });
      }
    } catch (error) {
      // Tangani kesalahan di sini
      console.error("Error adding Guru:", error);

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
  // Fungsi untuk handle klik edit
  const handleEditClick = (row: guru) => {
    setEditData(row); // Set data yang dipilih ke form edit
    setIsModalOpen(true); // Buka modal saat tombol edit diklik
  };
  // Handle perubahan input pada form edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Update hanya field yang diedit dalam `editData`
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Handle update data setelah form edit disubmit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      const formData = new FormData();

      // Tambahkan data lain ke formData
      formData.append("id_guru", editData.id_guru);
      formData.append("id_admin", editData.id_admin);
      formData.append("nip", editData.nip);
      formData.append("nama_guru", editData.nama_guru);
      formData.append("jenis_kelamin", editData.jenis_kelamin);
      formData.append("id_mapel", editData.id_mapel);
      formData.append("email", editData.email);
      formData.append("pass", editData.pass);
      formData.append("walas", editData.walas);
      formData.append("barcode", editData.barcode);
      formData.append("id_kelas", editData.id_kelas.join(",")); // Pastikan id_kelas array diubah menjadi string
      formData.append("rombel", editData.rombel);
      formData.append("no_telp", editData.no_telp);

      // Tambahkan file foto jika ada
      if (editData.foto) {
        formData.append("foto", editData.foto);
      }

      try {
        // Panggil fungsi updateGuru dengan id_guru dan nip
        await updateGuru(editData.id_guru, editData.nip, editData);

        // Update data guru di state utama jika berhasil
        setGuru((prev) =>
          prev.map((guru) =>
            guru.id_guru === editData.id_guru ? { ...guru, ...editData } : guru
          )
        );
        toast.success("Data berhasil diperbarui!");
        setIsModalOpen(false);
        setOpenDropdownId(null);
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengedit data");
      }
    }
  };
  //handle hapus
  const handleDeleteClickk = (row) => {
    setSelectedRow(row); // Simpan data yang ingin dihapus
    setIsConfirmOpen(true); // Buka modal
  };
  const handleConfirmDelete = async () => {
    try {
      // Panggil fungsi delete kelas untuk menghapus di backend
      await deleteGuru(selectedRow.id_guru);

      // Setelah sukses, update state di frontend
      setGuru((prevGuru) =>
        prevGuru.filter((guru) => guru.id_guru !== selectedRow.id_guru)
      );
      toast.success(`guru ${selectedRow.guru} berhasil dihapus`);
      setIsConfirmOpen(false); // Tutup modal
      setSelectedRow(null); // Reset selectedRow
    } catch (error) {
      console.error("Error deleting guru:", error);
      toast.error("Gagal menghapus guru");
    }
  };
  const handleCancel = () => {
    setIsConfirmOpen(false); // Tutup modal tanpa hapus
    setSelectedRow(null); // Reset selectedRow
  };
  //tombol untuk filter, pindah halaman, search dan reset
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default value is 5
  const [currentPage, setCurrentPage] = useState(1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); //  Reset ke halaman pertama saat jumlah item per halaman berubah
  };

  // Memfilter data berdasarkan searchTerm
  const filteredData = guru.filter((item) => {
    // Asumsikan 'kelas' memiliki properti 'kelas' untuk dicari
    return (
      item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis_kelamin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.walas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rombel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.no_telp.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold">Data Guru</h1>
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
                  Siswa
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-500">Data Guru</li>
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
              <label>
                ID Guru:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="id_guru"
                  value={guruData.id_guru}
                  onChange={handleChange}
                />
              </label>
              <label>
                ID Admin:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="id_admin"
                  value={guruData.id_admin}
                  onChange={handleChange}
                />
              </label>
              <label>
                NIP:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="nip"
                  value={guruData.nip}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nama Guru:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="nama_guru"
                  value={guruData.nama_guru}
                  onChange={handleChange}
                />
              </label>
              <label>
                Jenis Kelamin:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="jenis_kelamin"
                  value={guruData.jenis_kelamin}
                  onChange={handleChange}
                />
              </label>
              <label>
                ID Mapel:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="id_mapel"
                  value={guruData.id_mapel}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="email"
                  value={guruData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="pass"
                  value={guruData.pass}
                  onChange={handleChange}
                />
              </label>
              <label>
                Foto:
                <input
                  type="file"
                  name="foto"
                  onChange={handleFileChange} // Ganti event handler khusus untuk file
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  placeholder="Pilih file foto..."
                />
              </label>
              <label>
                Walas:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="walas"
                  value={guruData.walas}
                  onChange={handleChange}
                />
              </label>
              <label>
                Barcode:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="barcode"
                  value={guruData.barcode}
                  onChange={handleChange}
                />
              </label>
              <label>
                ID Kelas:
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="10"
                      checked={guruData.id_kelas.includes("10")}
                      onChange={handleCheckboxChange}
                    />
                    Kelas 10
                  </label>
                  <label className="mx-5">
                    <input
                      type="checkbox"
                      value="11"
                      checked={guruData.id_kelas.includes("11")}
                      onChange={handleCheckboxChange}
                    />
                    Kelas 11
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="12"
                      checked={guruData.id_kelas.includes("12")}
                      onChange={handleCheckboxChange}
                    />
                    Kelas 12
                  </label>
                  {/* Tambahkan lebih banyak kelas sesuai kebutuhan */}
                </div>
              </label>
              <label>
                Rombel:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="rombel"
                  value={guruData.rombel}
                  onChange={handleChange}
                />
              </label>
              <label>
                No. Telepon:
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                  name="no_telp"
                  value={guruData.no_telp}
                  onChange={handleChange}
                />
              </label>

              <div className="mt-4">
                {/* Tombol Simpan */}
                <div className="flex justify-end m-4 space-x-2 lg:mt-0 md:mt-0 mt-24 ">
                  <button
                    type="submit"
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white items-end rounded text-sm sm:text-base lg:w-24 md:w-24 w-full"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
            {/* Tombol Unduh Format dan Upload File */}
            <div className="lg:absolute md:absolute flex flex-col lg:flex-row lg:ml-6 md:flex-row md:ml-5 lg:-mt-20 md:-mt-20 -mt-40 lg:w-full md:w-full w-64 ml-7 ">
              <button
                onClick={handleDownloadFormatClick}
                className="flex-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 border-slate-500 text-white rounded text-sm sm:text-base mb-2 lg:mb-0 lg:mr-2 md:mr-2"
              >
                Unduh Format
              </button>
              <button
                onClick={handleUploadFileClick}
                className="flex-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 border-teal-400 text-white rounded text-sm sm:text-base mb-2 lg:mb-0"
              >
                Upload File
              </button>
              {/* Input file yang disembunyikan */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Column 2: Table */}
          <div className="w-full lg:mt-0 md:mt-0 mt-16 lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <div className="bg-slate-600 px-2 rounded-xl">
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div className="p-2">
                    <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                      Tabel Guru
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
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>
                  {/* <div className="">
                    <label
                      htmlFor="filterKelas"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                    <label
                      htmlFor="filterJurusan"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                  </div> */}

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
                  <DataTable columns={guruColumns} data={paginatedData} />
                  <ToastContainer className="mt-14" />
                  {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded p-4 shadow-lg space-y-4">
                        <h3 className="pb-2 text-lg font-semibold">
                          Edit Data Guru
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                          <label>
                            ID Guru:
                            <input
                              type="text"
                              name="id_guru"
                              value={editData ? editData.id_guru : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="ID Guru..."
                            />
                          </label>
                          <label>
                            ID Admin:
                            <input
                              type="text"
                              name="id_admin"
                              value={editData ? editData.id_admin : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="id_admin..."
                            />
                          </label>
                          <label>
                            Nip:
                            <input
                              type="text"
                              name="nip"
                              value={editData ? editData.nip : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="nip..."
                            />
                          </label>
                          <label>
                            Nama Guru:
                            <input
                              type="text"
                              name="nama_guru"
                              value={editData ? editData.nama_guru : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Nama Guru..."
                            />
                          </label>
                          <label>
                            Jenis Kelamin:
                            <input
                              type="text"
                              name="jenis_kelamin"
                              value={editData ? editData.jenis_kelamin : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Jenis Kelamin..."
                            />
                          </label>
                          <label>
                            ID Mapel:
                            <input
                              type="text"
                              name="id_mapel"
                              value={editData ? editData.id_mapel : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="id_mapel..."
                            />
                          </label>
                          <label>
                            Email:
                            <input
                              type="email"
                              name="email"
                              value={editData ? editData.email : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Email..."
                            />
                          </label>
                          <label>
                            Password:
                            <input
                              type="pass"
                              name="pass"
                              value={editData ? editData.pass : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="pass..."
                            />
                          </label>
                          <label>
                            Foto:
                            <input
                              type="file"
                              name="foto"
                              onChange={handleFileChange} // Handler untuk menangani file
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Pilih file foto..."
                            />
                          </label>
                          <label>
                            Walas:
                            <input
                              type="text"
                              name="walas"
                              value={editData ? editData.walas : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Walas..."
                            />
                          </label>
                          <label>
                            Barcode:
                            <input
                              type="text"
                              name="barcode"
                              value={editData ? editData.barcode : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Barcode..."
                            />
                          </label>
                          <label>
                            ID Kelas:
                            <div className="flex space-x-4">
                              <label>
                                <input
                                  type="checkbox"
                                  value="10"
                                  checked={editData.id_kelas?.includes("10")}
                                  onChange={handleEditCheckboxChange}
                                />
                                Kelas 10
                              </label>
                              <label>
                                <input
                                  type="checkbox"
                                  value="11"
                                  checked={editData.id_kelas?.includes("11")}
                                  onChange={handleEditCheckboxChange}
                                  className="ml-2"
                                />
                                Kelas 11
                              </label>
                              <label>
                                <input
                                  type="checkbox"
                                  value="12"
                                  checked={editData.id_kelas?.includes("12")}
                                  onChange={handleEditCheckboxChange}
                                  className="ml-2"
                                />
                                Kelas 12
                              </label>
                              {/* Tambahkan lebih banyak kelas sesuai kebutuhan */}
                            </div>
                          </label>
                          <label>
                            Rombel:
                            <input
                              type="text"
                              name="rombel"
                              value={editData ? editData.rombel : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="Rombel..."
                            />
                          </label>
                          <label>
                            No. Telepon:
                            <input
                              type="text"
                              name="no_telp"
                              value={editData ? editData.no_telp : ""}
                              onChange={handleEditChange}
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              placeholder="No. Telepon..."
                            />
                          </label>
                          <div className="flex justify-end space-x-2">
                            <button
                              type="submit"
                              className="py-2 px-4 bg-teal-400 hover:bg-teal-500 text-white rounded text-sm sm:text-base"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm sm:text-base"
                            >
                              Tutup
                            </button>
                          </div>
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

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-white">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex m-4 space-x-2">
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
        </div>
      </div>
    </>
  );
}

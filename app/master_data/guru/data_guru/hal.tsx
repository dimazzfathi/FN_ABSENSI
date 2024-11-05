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
import useUserInfo from "@/app/components/useUserInfo";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DataGuru() {
  const handleDownloadFormatClick = () => {
    // Data yang akan diisikan ke dalam file Excel untuk Mapel
    const data = [
      {
        id_guru: "",
        id_admin: "",
        nip: "",
        nama_guru: "",
        jenis_kelamin: "",
        // id_mapel: "",
        // email: "",
        // pass: "",
        // foto: "",
        // walas: "",
        // barcode: "",
        // id_kelas: "",
        // rombel: "",
        no_telp: "",
      },
    ];

    // Definisikan header file Excel
    const headers = [
      "id_guru",
      "id_admin",
      "nip",
      "nama_guru",
      "jenis_kelamin",
      // "id_mapel",
      // "email",
      // "pass",
      // "foto",
      // "walas",
      // "barcode",
      // "id_kelas",
      // "rombel",
      "no_telp",
    ];

    // Membuat worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

    // Membuat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guru");

    // Menghasilkan file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Membuat Blob untuk mengunduh
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Membuat link download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "format_guru.xlsx"; // Nama file yang diunduh
    link.click();
  };
  const handleUploadFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger input file secara manual
    }
  };

  const handleFileUploadChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet).map((row) => ({
            id_guru: row.id_guru || "default_value",
            id_admin: row.id_admin || "default_value",
            nip: row.nip || "default_value",
            nama_guru: row.nama_guru || "default_value",
            jenis_kelamin: row.jenis_kelamin || "default_value",
            // id_mapel: row.id_mapel || "default_value",
            // email: row.email || "default_value",
            // pass: row.pass || "default_value",
            // foto: row.foto || "default_value",
            // walas: row.walas || "default_value",
            // barcode: row.barcode || "default_value",
            // id_kelas: row.id_kelas || "default_value",
            // rombel: row.rombel || "default_value",
            no_telp: row.no_telp || "default_value",
          }));

          console.log("Data dari Excel:", jsonData); // Log data dari Excel
          setDataGuru(jsonData); // Simpan data ke state

          // Lakukan pengiriman data ke server setelah file diproses
          const response = await fetch(
            "http://localhost:3005/guru/add-guru",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsonData),
            }
          );

          const result = await response.json();

          if (response.ok) {
            console.log("Data berhasil dikirim", result);
          } else {
            console.error(
              "Gagal mengirim data:",
              result.error || response.statusText
            );
          }
        } catch (error) {
          console.error("Error membaca file Excel atau mengirim data:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
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
  const [dataGuru, setDataGuru] = useState<Guru[]>([]);
  const handleToggleDropdown = (id_guru: string) => {
    setOpenDropdownId(openDropdownId === id_guru ? null : id_guru); // Toggle dropdown
  };
  const [rombelList, setRombelList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [isWalasEnabled, setIsWalasEnabled] = useState(false); // State untuk kontrol on/off
  const { idAdmin } = useUserInfo();
  const [admins, setAdmins] = useState<
    { id_admin: string; nama_admin: string }[]
  >([]);
  const handleToggle = () => {
    setIsWalasEnabled(!isWalasEnabled); // Toggle nilai isWalasEnabled
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
  // Ambil data rombel dari backend saat komponen dimuat
  useEffect(() => {
    const fetchRombel = async () => {
      try {
        const response = await axios.get(`${baseUrl}/rombel/all-rombel`);
        console.log("Data rombel yang diterima:", response.data); // Lihat data yang diterima
        if (Array.isArray(response.data.data)) {
          setRombelList(response.data.data); // Pastikan data adalah array
        } else {
          console.error("Data tidak dalam format array");
        }
      } catch (error) {
        console.error("Error fetching rombel data:", error);
      }
    };
    fetchRombel();
  }, []);
  // Ambil data Mapel dari backend saat komponen dimuat
  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const response = await axios.get(`${baseUrl}/mapel/all-mapel`);
        console.log("Data Mapel yang diterima:", response.data); // Lihat data yang diterima
        if (Array.isArray(response.data.data)) {
          setMapelList(response.data.data); // Pastikan data adalah array
        } else {
          console.error("Data tidak dalam format array");
        }
      } catch (error) {
        console.error("Error fetching Mapel data:", error);
      }
    };
    fetchMapel();
  }, []);
  // Mengambil data admins dari API
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
    if (idAdmin) {
      setGuruData((prevData) => ({
        ...prevData,
        id_admin: idAdmin,
      }));
    }
  }, [idAdmin]);

  const handleDetailClick = (row: Guru) => {
    const admin = admins.find((admin) => admin.id_admin === row.id_admin); // Cari admin berdasarkan id_admin
    console.log("id admin", admin);
    const namaAdmin = admin ? admin.nama_admin : "Tidak ada"; // Jika ditemukan, ambil nama_admin
    console.log("iki admin", namaAdmin);
    Swal.fire({
      html: `
        <div style="text-align: center;">
          <p>${JSON.stringify(row.nama_guru) || "Tidak ada"}</p>
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
  const guruColumns = [
    //adalah istilah yang digunakan dalam konteks tabel, terutama saat menggunakan pustaka seperti React Table, untuk menunjukkan kunci atau nama properti dalam data yang akan diambil dan ditampilkan di kolom tabel tertentu
    // { header: "No", accessor: (_: any, index: number) => index + 1 },
    // { header: "Guru", accessor: "id_guru" as keyof Guru },
    { header: "Admin",
      accessor: "id_admin" as keyof Guru,
      Cell: ({ row }: { row: Guru }) => {
        const admin = admins.find((admin) => admin.id_admin === row.id_admin);
        return admin ? admin.nama_admin : "Tidak Diketahui";
      }, },
    { header: "Nip", accessor: "nip" as keyof Guru },
    { header: "Guru", accessor: "nama_guru" as keyof Guru },
    { header: "Jk", accessor: "jenis_kelamin" as keyof Guru },
    { header: "Mapel", accessor: "id_mapel" as keyof Guru },
    { header: "Email", accessor: "email" as keyof Guru },
    // { header: "Pass", accessor: "pass" as keyof Guru },
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
              <div className="absolute mt-2 bg-white border rounded shadow-md lg:-ml-2 md:-ml-96">
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
    id_admin: idAdmin || "",
    nip: "",
    nama_guru: "",
    jenis_kelamin: "",
    // id_mapel: [],
    // email: "",
    // pass: "",
    // foto: "",
    // walas: "",
    // barcode: "",
    // id_kelas: [],
    // rombel: [],
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
  const handleJurusanChange = (e) => {
    const { value, checked } = e.target;
    setGuruData((prevData) => {
      if (checked) {
        // Tambahkan rombel yang dipilih
        return {
          ...prevData,
          rombel: [...prevData.rombel, value],
        };
      } else {
        // Hapus rombel yang tidak dipilih
        return {
          ...prevData,
          rombel: prevData.rombel.filter((rombel) => rombel !== value),
        };
      }
    });
  };
  // Fungsi untuk menangani perubahan checkbox
  const handleMapelChange = (e) => {
    const { value, checked } = e.target;
    setGuruData((prevData) => {
      if (checked) {
        // Tambahkan mapel yang dipilih
        return {
          ...prevData,
          id_mapel: [...prevData.id_mapel, value],
        };
      } else {
        // Hapus id_mapel yang tidak dipilih
        return {
          ...prevData,
          id_mapel: prevData.id_mapel.filter((mapel) => mapel !== value),
        };
      }
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
  const handleMapelCheckboxChange = (event) => {
    const { value } = event.target;
    setGuruData((prevData) => {
      const isChecked = prevData.id_mapel.includes(value);
      const updatedMapel = isChecked
        ? prevData.id_mapel.filter((id) => id !== value)
        : [...prevData.id_mapel, value];
      console.log("Updated id_mapel:", updatedMapel); // Tambahkan ini untuk cek
      return { ...prevData, id_mapel: updatedMapel };
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
      toast.error("Data guru tidak boleh kosong");
      return;
    }

    try {
      const response = await addGuru(guruData);
      console.log("API response:", response);
      console.log("Data yang dikirim ke backend:", guruData);
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
          id_admin: idAdmin,
          nip: "",
          nama_guru: "",
          jenis_kelamin: "",
          // id_mapel: [],
          // email: "",
          // pass: "",
          // foto: "",
          // walas: "",
          // barcode: "",
          // id_kelas: [],
          // rombel: [],
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
      // formData.append("id_mapel", editData.id_mapel);
      // formData.append("email", editData.email);
      // formData.append("pass", editData.pass);
      // formData.append("walas", editData.walas);
      // formData.append("barcode", editData.barcode);
      // formData.append("id_kelas", Array.isArray(editData.id_kelas) ? editData.id_kelas.join(",") : ""); // Pastikan id_kelas array diubah menjadi string
      // formData.append("rombel", editData.rombel);
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
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="id_guru"
                value={guruData.id_guru}
                onChange={handleChange}
                hidden="none"
              />
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="id_admin"
                value={guruData.id_admin}
                onChange={handleChange}
                hidden="none"
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">NIP</h2>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="nip"
                value={guruData.nip}
                onChange={handleChange}
                placeholder="Nip..."
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Nama Guru</h2>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="nama_guru"
                value={guruData.nama_guru}
                onChange={handleChange}
                placeholder="Nama Guru..."
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">
                Jenis Kelamin
              </h2>
              <select
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="jenis_kelamin"
                value={guruData.jenis_kelamin}
                onChange={handleChange}
              >
                <option value="">Pilih Jenis Kelamin...</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Email</h2>
              <input
                type="email"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="email"
                value={guruData.email}
                onChange={handleChange}
                placeholder="Email..."
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Password</h2>
              <input
                type="password"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="pass"
                value={guruData.pass}
                onChange={handleChange}
                placeholder="Password..."
              />
              {/* <h2 className="text-sm mb-2 sm:text-sm font-bold">Mapel</h2>
              <div className="mb-2 lg:flex lg:flex-wrap md:flex md:flex-wrap">
                {" "}
                {mapelList.length > 0 ? (
                  mapelList.map((mapel) => (
                    <label
                      key={mapel.id_mapel} // Pastikan id_mapel ada di data mapel
                      className="flex items-center space-x-2 md:w-1/4 mb-2"
                    >
                      <input
                        type="checkbox"
                        name="mapel"
                        value={mapel.nama_mapel} // Ganti dengan nama kolom yang sesuai dari database
                        checked={guruData.id_mapel.includes(mapel.nama_mapel)} // Cek apakah mapel sudah dipilih
                        onChange={handleMapelChange} // Panggil fungsi untuk mengubah state
                        className="form-checkbox text-blue-600"
                      />
                      <span className="text-sm sm:text-base">
                        {mapel.nama_mapel}
                      </span>
                    </label>
                  ))
                ) : (
                  <p>Tidak ada data mata pelajaran.</p> // Tampilkan pesan jika tidak ada data
                )}
              </div>
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Kelas</h2>
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
              </div>
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Jurusan</h2>
              <div className="flex flex-wrap space-x-4 mb-2">
                {rombelList.length > 0 ? (
                  rombelList.map((rombel) => (
                    <label
                      key={rombel.id_rombel}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <input
                        type="checkbox"
                        name="rombel"
                        value={rombel.nama_rombel}
                        checked={guruData.rombel.includes(rombel.nama_rombel)}
                        onChange={handleJurusanChange}
                        className="form-checkbox text-blue-600"
                      />
                      <span className="text-sm sm:text-base">
                        {rombel.nama_rombel}
                      </span>
                    </label>
                  ))
                ) : (
                  <p>Tidak ada data rombel.</p> // Tampilkan pesan jika tidak ada data
                )}
              </div> */}
              <h2 className="text-sm sm:text-sm font-bold">Mapel</h2>
              <div className="lg:flex lg:flex-wrap md:flex md:flex-wrap">
                <label className="flex items-center space-x-2 md:w-1/4">
                  <input
                    type="checkbox"
                    name="mapel"
                    value="Matematika"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">Matematika</span>
                </label>
                <label className="flex items-center space-x-2 md:w-1/4">
                  <input
                    type="checkbox"
                    name="mapel"
                    value="Bahasa Indonesia"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">Bahasa Indonesia</span>
                </label>
                <label className="flex items-center space-x-2 md:w-1/4">
                  <input
                    type="checkbox"
                    name="mapel"
                    value="Bahasa Inggris"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">Bahasa Inggris</span>
                </label>
                <label className="flex items-center space-x-2 md:w-1/4">
                  <input
                    type="checkbox"
                    name="mapel"
                    value="Ilmu Pengetahuan Alam"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">
                    Ilmu Pengetahuan Alam
                  </span>
                </label>
              </div>
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Kelas</h2>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="10"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2">Kelas 10</span>
                </label>
                <label className="mx-5">
                  <input
                    type="checkbox"
                    value="11"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2">Kelas 11</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="12"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2">Kelas 12</span>
                </label>
              </div>
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Jurusan</h2>
              <div className="flex flex-wrap space-x-4 mb-2">
                <label className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    name="jurusan"
                    value="IPA"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">IPA</span>
                </label>
                <label className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    name="jurusan"
                    value="IPS"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">IPS</span>
                </label>
                <label className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    name="jurusan"
                    value="Bahasa"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">Bahasa</span>
                </label>
                <label className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    name="jurusan"
                    value="Teknik"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-sm sm:text-base">Teknik</span>
                </label>
              </div>

              <label className="inline-flex items-center">
                <h2 className="text-sm mb-2 sm:text-sm font-bold pr-2 pt-1">
                  Walas
                </h2>
                <input
                  type="checkbox"
                  checked={isWalasEnabled}
                  onChange={handleToggle}
                  className="hidden"
                />
                <span
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isWalasEnabled ? "bg-teal-400" : ""
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      isWalasEnabled ? "translate-x-5" : ""
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm"></span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="walas"
                value={guruData.walas}
                onChange={handleChange}
                placeholder="Wali Kelas..."
                disabled={!isWalasEnabled} // Disable input jika isWalasEnabled false
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">No. Telepon</h2>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="no_telp"
                value={guruData.no_telp}
                onChange={handleChange}
                placeholder="Nomor telepon..."
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Barcode</h2>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                name="barcode"
                value={guruData.barcode}
                onChange={handleChange}
              />
              <h2 className="text-sm mb-2 sm:text-sm font-bold">Foto</h2>
              <input
                type="file"
                name="foto"
                onChange={handleFileChange} // Ganti event handler khusus untuk file
                className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                placeholder="Pilih file foto..."
              />
              <div className="mt-4">
                {/* Tombol Simpan */}
                <div className="flex justify-end m-4 space-x-2 lg:mt-0 md:mt-0 md:z-50">
                  <button
                    type="submit"
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white items-end rounded text-sm sm:text-base lg:w-24 md:w-24"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
            {/* Tombol Unduh Format dan Upload File */}
            <div className="absolute -mt-20 ml-6">
              <button
                onClick={handleDownloadFormatClick}
                className="flex-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 border-slate-500 text-white rounded text-sm sm:text-base mb-2 lg:mb-0 lg:mr-2 md:mr-2"
              >
                Unduh Format
              </button>
              <button
                onClick={handleUploadFileClick}
                className="flex-2 lg:inline-block md:inline-block block px-4 py-2 bg-rose-600 hover:bg-rose-700 border-teal-400 text-white rounded text-sm sm:text-base mb-2 lg:mb-0"
              >
                Upload File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileUploadChange}
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
                      <div className="bg-white rounded p-4 shadow-lg space-y-4  max-h-screen overflow-y-auto">
                        <h3 className="pb-2 text-lg font-semibold">
                          Edit Data Guru
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                          <input
                            type="text"
                            name="id_guru"
                            value={editData ? editData.id_guru : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="ID Guru..."
                            hidden="none"
                          />
                          <input
                            type="text"
                            name="id_admin"
                            value={editData ? editData.id_admin : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="id_admin..."
                            hidden="none"
                          />
                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Nip
                          </h2>
                          <input
                            type="text"
                            name="nip"
                            value={editData ? editData.nip : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="nip..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Nama Guru
                          </h2>
                          <input
                            type="text"
                            name="nama_guru"
                            value={editData ? editData.nama_guru : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Nama Guru..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Jenis Kelamin
                          </h2>
                          <select
                            name="jenis_kelamin"
                            value={editData ? editData.jenis_kelamin : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                          >
                            <option value="">Pilih Jenis Kelamin...</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Email
                          </h2>
                          <input
                            type="email"
                            name="email"
                            value={editData ? editData.email : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Email..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Password
                          </h2>
                          <input
                            type="pass"
                            name="pass"
                            value={editData ? editData.pass : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="pass..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Mapel
                          </h2>
                          <div className="lg:flex lg:flex-wrap md:flex md:flex-wrap">
                            <label className="flex items-center space-x-2 md:w-1/4">
                              <input
                                type="checkbox"
                                name="mapel"
                                value="Matematika"
                                className="form-checkbox text-blue-600"
                              />
                              <span className="text-sm sm:text-base">
                                Matematika
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 md:w-1/4">
                              <input
                                type="checkbox"
                                name="mapel"
                                value="Bahasa Indonesia"
                                className="form-checkbox text-blue-600"
                              />
                              <span className="text-sm sm:text-base">
                                Bahasa Indonesia
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 md:w-1/4">
                              <input
                                type="checkbox"
                                name="mapel"
                                value="Bahasa Inggris"
                                className="form-checkbox text-blue-600"
                              />
                              <span className="text-sm sm:text-base">
                                Bahasa Inggris
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 md:w-1/4">
                              <input
                                type="checkbox"
                                name="mapel"
                                value="Ilmu Pengetahuan Alam"
                                className="form-checkbox text-blue-600"
                              />
                              <span className="text-sm sm:text-base">
                                Ilmu Pengetahuan Alam
                              </span>
                            </label>
                          </div>
                          {/* <div className="mb-2 lg:flex lg:flex-wrap md:flex md:flex-wrap">
                            {mapelList.length > 0 ? (
                              mapelList.map((mapel) => (
                                <label
                                  key={mapel.id_mapel}
                                  className="flex items-center space-x-2 md:w-1/4 mb-2"
                                >
                                  <input
                                    type="checkbox"
                                    name="mapel"
                                    value={mapel.id_mapel}
                                    checked={guruData.id_mapel.includes(
                                      mapel.id_mapel
                                    )}
                                    onChange={handleMapelCheckboxChange}
                                    className="form-checkbox text-blue-600"
                                  />
                                  <span className="text-sm sm:text-base">
                                    {mapel.nama_mapel}
                                  </span>
                                </label>
                              ))
                            ) : (
                              <p>Tidak ada data mata pelajaran.</p>
                            )}
                          </div> */}

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Kelas
                          </h2>
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

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Jurusan
                          </h2>
                          <input
                            type="text"
                            name="rombel"
                            value={editData ? editData.rombel : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Rombel..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Walas
                          </h2>
                          <input
                            type="text"
                            name="walas"
                            value={editData ? editData.walas : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Walas..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            No. Telepon
                          </h2>
                          <input
                            type="text"
                            name="no_telp"
                            value={editData ? editData.no_telp : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="No. Telepon..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Barcode
                          </h2>
                          <input
                            type="text"
                            name="barcode"
                            value={editData ? editData.barcode : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Barcode..."
                          />

                          <h2 className="text-sm mb-2 sm:text-sm font-bold">
                            Foto
                          </h2>
                          <input
                            type="file"
                            name="foto"
                            onChange={handleFileChange} // Handler untuk menangani file
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Pilih file foto..."
                          />

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

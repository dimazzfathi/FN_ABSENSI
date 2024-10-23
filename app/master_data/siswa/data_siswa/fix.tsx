"use client";
import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addSiswa,
  fetchSiswa,
  deleteSiswa,
  updateSiswa,
  Siswa,
} from "../../../api/siswa";
import DataTable from '../../../components/dataTabel';
import * as XLSX from 'xlsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import imageCompression from 'browser-image-compression';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function DataSiswa() {

  
  const [searchTerm, setSearchTerm] = useState("");
  const [isIdSiswaValid, setIsIdSiswaValid] = useState(true);
  const [tahunPelajaran, setTahunPelajaran] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState('');
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [rombel, setRombel] = useState([]);
  const [selectedRombel, setSelectedRombel] = useState('');
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [formData, setFormData] = useState({
    id_siswa: '',
    id_admin: '',
    nis: '',
    nama_siswa: '',
    jenis_kelamin: '',
    id_tahun_pelajaran: '',
    id_kelas: '',
    id_rombel: '',
    email: '',
    pass: '',
    foto: null,
    barcode: '',
    nama_wali: '',
    nomor_wali: '',
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);


  //stet untuk fecth siswa
  useEffect(() => {
    const loadSiswa = async () => {
      const response = await fetchSiswa();
      // console.log('API siswa:', response); // Debugging tambahan
      const data = response.data; 
      setDataSiswa(data);
    };
    loadSiswa();
  }, []);

  useEffect(() => {
    const fetchTahunPelajaran = async () => {
        try {
            const response = await axios.get('http://localhost:3005/tahun-pelajaran/all-tahun-pelajaran'); // Sesuaikan dengan URL API Anda
            setTahunPelajaran(response.data.data);
            console.log('data berhasil di fetch', response);
        } catch (error) {
            console.error('Error fetching tahun pelajaran:', error);
        }
    };

    fetchTahunPelajaran();
}, []);

const handleTahunChange = (event) => {
  const value = event.target.value;
  setSelectedTahun(value);
  setFormData((prevData) => ({
      ...prevData,
      id_tahun_pelajaran: value // Memperbarui formData
  }));
};

useEffect(() => {
  const fetchKelas = async () => {
      try {
          const response = await axios.get('http://localhost:3005/kelas/all-kelas'); // Sesuaikan dengan URL API Anda
          setKelas(response.data.data);
          console.log('data berhasil di fetch', response);
      } catch (error) {
          console.error('Error fetching tahun pelajaran:', error);
      }
  };

  fetchKelas();
}, []);

const handleKelasChange = (event) => {
  const value = event.target.value;
  setSelectedKelas(value);
  setFormData((prevData) => ({
      ...prevData,
      id_kelas: value // Memperbarui formData
  }));
};

useEffect(() => {
  const fetchRombel = async () => {
      try {
          const response = await axios.get('http://localhost:3005/rombel/all-rombel'); // Sesuaikan dengan URL API Anda
          setRombel(response.data.data);
          console.log('data berhasil di fetch', response);
      } catch (error) {
          console.error('Error fetching tahun pelajaran:', error);
      }
  };

  fetchRombel();
}, []);

const handleRombelChange = (event) => {
  const value = event.target.value;
  setSelectedRombel(value);
  setFormData((prevData) => ({
      ...prevData,
      id_rombel: value // Memperbarui formData
  }));
};

  // fields untuk DataTabel
  const siswaColumns = [
    { header: 'ID', accessor: 'id_siswa' as keyof Siswa },
    { header: 'Foto', accessor: 'foto' as keyof Siswa },
    { header: 'Nis', accessor: 'nis' as keyof Siswa },
    { header: 'Nama', accessor: 'nama_siswa' as keyof Siswa },
    { header: 'JK', accessor: 'jenis_kelamin' as keyof Siswa },
    { header: 'Tahun Ajaran', accessor: 'id_tahun_pelajaran' as keyof Siswa },
    { header: 'Kelas', accessor: 'id_kelas' as keyof Siswa },
    { header: 'Jurusan', accessor: 'id_rombel' as keyof Siswa },
    { header: 'Email', accessor: 'email' as keyof Siswa },
    { header: 'Password', accessor: 'pass' as keyof Siswa },
    { header: 'Barcode', accessor: 'barcode' as keyof Siswa },
    { header: 'Nama Wali', accessor: 'nama_wali' as keyof Siswa },
    { header: 'No Wali', accessor: 'nomor_wali' as keyof Siswa },
  ];

  //state untuk menghandle input
   // Handler umum untuk input teks
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler khusus untuk input foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] }); // Simpan file foto di formData
      setFotoPreview(URL.createObjectURL(e.target.files[0])); // Untuk menampilkan preview
    }
  };
  
  

  //state untuk simpan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validasi jika ada input yang kosong
    // if (
    //   !formData.id_siswa ||
    //   !formData.nis ||
    //   !formData.nama_siswa ||
    //   !formData.jenis_kelamin ||
    //   // !formData.foto ||
    //   !formData.id_tahun_pelajaran ||
    //   !formData.id_kelas ||
    //   !formData.id_rombel ||
    //   !formData.nama_wali ||
    //   !formData.nomor_wali 
    // ) {
    //   toast.error('Data tidak boleh kosong');
    //   return;
    // }
  
    try {
      const response = await addSiswa(formData);
      console.log('API response:', response);
      
      // Cek apakah data sudah ada berdasarkan respons dari server
      if (response?.data?.exists) { // Asumsikan response.data.exists bernilai true jika data sudah ada
        toast.error('Data sudah ada!');
      } else {
        toast.success('Siswa berhasil ditambahkan!');
        // Reset form data setelah berhasil
        setFormData({
          id_siswa: '',
          id_admin: '',
          nis: '',
          nama_siswa: '',
          jenis_kelamin: '',
          id_tahun_pelajaran: '',
          id_kelas: '',
          id_rombel: '',
          email: '',
          pass: '',
          foto: null,
          barcode: '',
          nama_wali: '',
          nomor_wali: '',
        });
        setFotoPreview(null);
      }
    } catch (error) {
      console.error('Error adding siswa:', error);
  
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
        if (error.response) {
          // Tampilkan pesan error spesifik dari server jika ada
          const errorMessage = error.response.data.message || 'Terjadi kesalahan pada server';
          toast.error(`Error: ${error.response.status} - ${errorMessage}`);
        } else {
          toast.error('Tidak dapat terhubung ke server. Periksa koneksi Anda atau coba lagi nanti.');
        }
      } else {
        toast.error('Terjadi kesalahan saat menambah data');
      }
    }
  };
  

  // Fungsi untuk menangani edit
  const handleEdit = async (updatedRow: Siswa) => {
  try {
    // Pastikan updatedRow memiliki id_siswa dan nis
    if (!updatedRow.id_siswa || !updatedRow.nis) {
      throw new Error('ID Siswa atau NIS tidak ditemukan');
    }

    // Update state di frontend
    setDataSiswa((prevSiswa) =>
      prevSiswa.map((siswa) =>
        siswa.id_siswa === updatedRow.id_siswa ? updatedRow : siswa
      )
    );
    // Kirim request ke backend dengan id dan nis yang benar
    const updatedSiswa = await updateSiswa(updatedRow.id_siswa, updatedRow.nis, updatedRow);
    toast.success('Data siswa berhasil diperbarui!');
  } catch (error) {
    // Tampilkan lebih banyak detail error dari response server
    console.error('Gagal memperbarui data di backend:', error.response?.data || error.message);
    toast.error(`Gagal memperbarui data: ${error.response?.data?.message || error.message}`);
  }
};

const handleDelete = async (deletedRow) => {
  const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus siswa ${deletedRow.nama_siswa}?`);
  if (confirmed) {
      try {
          // Panggil fungsi deleteTahunAjaran untuk menghapus di backend
          await deleteSiswa(deletedRow.id_siswa);

          // Setelah sukses, update state di frontend
          setDataSiswa((prevSiswa) =>
              prevSiswa.filter((siswa) => siswa.id_siswa !== deletedRow.id_siswa)
          );
          
          toast.success(' siswa berhasil dihapus');
      } catch (error) {
          console.error('Error deleting Siswa:', error);
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
  const filteredData = dataSiswa.filter((item) => {
    return (
      (item.nis?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.nama_siswa?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.jenis_kelamin?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.id_kelas?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.id_rombel?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.nama_wali?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (item.nomor_wali?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
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

  const handleDownloadFormatClick = () => {
    // Data yang akan diisikan ke dalam file Excel
    const data = [
      {
        id_siswa: "",
        nis: "",
        nama_siswa: "",
        jenis_kelamin: "",
        tahun_ajaran: "",
        kelas: "",
        rombel: "",
        email: "",
        pass: "",
        foto: "",
        barcode: "",
        nama_wali: "",
        nomor_wali: "",
      },
    ];
  
    // Definisikan header file Excel
    const headers = [
      "id_siswa",
      "nis",
      "nama_siswa",
      "jenis_kelamin",
      "tahun_ajaran",
      "kelas",
      "rombel",
      "email",
      "pass",
      "foto",
      "barcode",
      "nama_wali",
      "nomor_wali",
    ];
  
    // Membuat worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
  
    // Membuat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");
  
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
    link.download = "dasis.xlsx"; // Nama file yang diunduh
    link.click();
  };
  
  const handleUploadFileClick = () => {
    // Memicu klik pada elemen input file
    fileInputRef.current.click();
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
        const formattedData = jsonData
          .slice(1)
          .map((row, index) => ({
            no: dataSiswa.length + index + 1,
            foto: "",
            idSiswa: row[0] || "",
            nisn: row[1] || "",
            namaSiswa: row[2] || "",
            jk: row[3] || "",
            kelas: row[5] || "",
            jurusan: row[6] || "",
            namaWali: row[11] || "",
            noWali: row[12] || "",
          }))
          .filter((item) =>
            Object.values(item).some((value) => typeof value === "string" && value.trim() !== "")
          );
  
        if (formattedData.length > 0) {
          // Kirim data ke server
          try {
            const response = await axios.post(`${baseUrl}/siswa/add-siswa`, formattedData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
  
            if (response.ok) {
              console.log('Data berhasil disimpan ke database');
              setDataSiswa((prevData) => [...prevData, ...formattedData]);
            } else {
              console.error('Gagal menyimpan data', response.statusText);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        } else {
          console.log("Tidak ada data valid yang dimasukkan.");
        }
      };
  
      reader.readAsArrayBuffer(file);
    }
  };
  
  

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Data Siswa</h1>
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
              <li className="text-gray-500">Data Siswa</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <div>
                <label className="block text-sm font-medium">ID Siswa</label>
                <input
                  type="text"
                  name="id_siswa"
                  value={formData.id_siswa}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium">NIS</label>
                <input
                  type="text"
                  name="nis"
                  value={formData.nis}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nama Siswa</label>
                <input
                  type="text"
                  name="nama_siswa"
                  value={formData.nama_siswa}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                >
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label htmlFor="id_tahun_pelajaran" className="block text-sm font-medium">Tahun Pelajaran:</label>
                  <select
                      name="id_tahun_pelajaran"
                      value={selectedTahun}
                      onChange={handleTahunChange}
                      className="mt-1 p-2 border rounded-md w-full"
                  >
                      <option>Pilih Tahun Pelajaran</option>
                      {tahunPelajaran.map((tahun) => (
                          <option key={tahun.id_tahun_pelajaran} value={tahun.tahun}>
                              {tahun.tahun}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
              <label htmlFor="id_kelas" className="block text-sm font-medium">Tahun Pelajaran:</label>
                  <select
                      name="id_kelas"
                      value={selectedKelas}
                      onChange={handleKelasChange}
                      className="mt-1 p-2 border rounded-md w-full"
                  >
                      <option>Pilih Kelas</option>
                      {kelas.map((kelas) => (
                          <option key={kelas.id_kelas} value={kelas.kelas}>
                              {kelas.kelas}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
              <label htmlFor="id_rombel" className="block text-sm font-medium">Tahun Pelajaran:</label>
                  <select
                      name="id_rombel"
                      value={selectedRombel}
                      onChange={handleRombelChange}
                      className="mt-1 p-2 border rounded-md w-full"
                  >
                      <option>Pilih Rombel</option>
                      {rombel.map((rombel) => (
                          <option key={rombel.id_rombel} value={rombel.nama_rombel}>
                              {rombel.nama_rombel}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="pass"
                  value={formData.pass}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Foto</label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="mt-1 p-2 border rounded-md w-full"
                />
                {fotoPreview && <img src={fotoPreview} alt="Preview Foto" className="mt-2 h-20 w-20" />}
              </div>
              <div>
                <label className="block text-sm font-medium">Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nama Wali</label>
                <input
                  type="text"
                  name="nama_wali"
                  value={formData.nama_wali}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nomor Wali</label>
                <input
                  type="text"
                  name="nomor_wali"
                  value={formData.nomor_wali}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  
                />
              </div>
              <div className="mt-6 ">
                {/* Tombol Unduh Format dan Upload File */}
                
                {/* Tombol Simpan */}
                <div className="flex justify-end m-5 space-x-2">
                <button
                  type="submit"
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white items-end-end rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
                </div>
              </div>                
            </form>
            <div className="absolute -mt-20 ml-6">
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
            
            <ToastContainer className="mt-14" />
          </div>

          {/* Column 2: Table */}
          <div className="w-full  lg:w-2/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <div className="bg-slate-600 px-2 rounded-xl">
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div className="p-2">
                    <h2 className="text-sm pt-3 sm:text-2xl text-white font-bold">
                      Tabel Siswa
                    </h2>
                  </div>
                </div>
                {/* Filter Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-4">
                  <div className="lg:flex-row justify-between items-center">
                    <div className=" items-center lg:mb-0 space-x-2 mb-3 lg:order-1">
                      <select
                        value={itemsPerPage}
                        onChange={(e) =>
                          setItemsPerPage(Number(e.target.value))
                        }
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
                      Filter Kelas
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
                      Filter Jurusan
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
                  </div>
                  <div className=" items-center lg:mb-0 space-x-2 lg:order-1">
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div> */}
            </div>      
              <div className="overflow-x-auto">
                <DataTable 
                  columns={siswaColumns}
                  data={paginatedData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-white">
                    Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
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
//       if (typeof onClose === "function") {
//         onClose(); // Memanggil fungsi onClose untuk menutup dropdown
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
//         className="p-1 z-40 text-white text-xs sm:text-sm"
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

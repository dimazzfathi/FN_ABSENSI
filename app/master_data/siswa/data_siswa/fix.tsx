"use client";
import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"
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
import useUserInfo from "@/app/components/useUserInfo";
import Swal from "sweetalert2";
import { FaWhatsapp } from 'react-icons/fa';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function DataSiswa() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // Toggle state
  };
  const [admins, setAdmins] = useState<{ id_admin: string; nama_admin: string }[]>([]);
  const { namaAdmin, status, idAdmin } = useUserInfo();
  const [editData, setEditData] = useState<Siswa | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // Menyimpan ID baris yang dropdown-nya terbuka
  const [isSiswaValid, setIsSiswaValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [selectedRow, setSelectedRow] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isIdSiswaValid, setIsIdSiswaValid] = useState(true);
  const [tahunPelajaran, setTahunPelajaran] = useState([]);
  const [tahunEditPelajaran, setTahunEditPelajaran] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState('');
  const [selectedEditTahun, setSelectedEditTahun] = useState('');
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedEditKelas, setSelectedEditKelas] = useState('');
  const [rombel, setRombel] = useState([]);
  const [selectedRombel, setSelectedRombel] = useState('');
  const [selectedEditRombel, setSelectedEditRombel] = useState('');
  const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
  const [foto, setFoto] = useState(null);
  const [formData, setFormData] = useState({
    id_siswa:'',
    id_admin: '',
    nis: '',
    nama_siswa: '',
    jenis_kelamin: '',
    id_tahun_pelajaran: '',
    id_kelas: '',
    id_rombel: '',
    nama_wali: '',
    nomor_wali: '',
    email: '',
    pass: '',
    foto:'',
    barcode: '',
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
            const response = await axios.get(`${baseUrl}/tahun-pelajaran/all-tahun-pelajaran`); // Sesuaikan dengan URL API Anda
            setTahunPelajaran(response.data.data);
            console.log('data berhasil di fetch', response);
        } catch (error) {
            console.error('Error fetching tahun pelajaran:', error);
        }
    };

    fetchTahunPelajaran();
}, []);
    useEffect(() => {
      const fetchTahunPelajaran = async () => {
          try {
              const response = await axios.get(`${baseUrl}/tahun-pelajaran/all-tahun-pelajaran`); // Sesuaikan dengan URL API Anda
              setTahunEditPelajaran(response.data.data);
              console.log('data berhasil di fetch', response);
          } catch (error) {
              console.error('Error fetching tahun pelajaran:', error);
          }
      };

      fetchTahunPelajaran();
    }, []);

const handleTahunChange = (event) => {
  const value = event.target.value;
   // Log ID yang dipilih untuk memastikan
   console.log('ID Tahun Pelajaran yang dipilih:', value);
  setSelectedTahun(value);
  setFormData((prevData) => ({
      ...prevData,
      id_tahun_pelajaran: value // Memperbarui formData
  }));
};

const handleEditTahunChange = (e) => {
  const { value } = e.target;
  console.log('ID Tahun Pelajaran yang dipilih:', value);
  setSelectedEditTahun(value); // Update state untuk dropdown tahun ajaran
  setEditData((prev) => ({ ...prev, id_tahun_pelajaran: value })); // Update id_tahun_pelajaran di editData
};


useEffect(() => {
  const fetchKelas = async () => {
      try {
          const response = await axios.get(`${baseUrl}/kelas/all-kelas`); // Sesuaikan dengan URL API Anda
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
  console.log('ID Kelas yang dipilih:', value);
  setSelectedKelas(value);
  setFormData((prevData) => ({
      ...prevData,
      id_kelas: value // Memperbarui formData
  }));
};

const handleEditKelasChange = (e) => {
  const { value } = e.target;
  console.log('ID Rombel yang dipilih:', value);
  setSelectedEditKelas(value); // Update state untuk dropdown kelas
  setEditData((prev) => ({ ...prev, id_kelas: value })); // Update id_kelas di editData
};


useEffect(() => {
  const fetchRombel = async () => {
      try {
          const response = await axios.get(`${baseUrl}/rombel/all-rombel`); // Sesuaikan dengan URL API Anda
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
  console.log('ID Rombel yang dipilih:', value);
  setSelectedRombel(value);
  setFormData((prevData) => ({
      ...prevData,
      id_rombel: value // Memperbarui formData
  }));
};

const handleEditRombelChange = (e) => {
  const { value } = e.target;
  console.log('ID Rombel yang dipilih:', value);
  setSelectedEditRombel(value); // Update state untuk dropdown rombel
  setEditData((prev) => ({ ...prev, id_rombel: value })); // Update id_rombel di editData
};




  // fields untuk DataTabel
  const siswaColumns = [
    
    { header: 'Foto', accessor: 'foto' as keyof Siswa },
    { header: 'Nis', accessor: 'nis' as keyof Siswa },
    { header: 'Nama', accessor: 'nama_siswa' as keyof Siswa },
    { header: 'JK', accessor: 'jenis_kelamin' as keyof Siswa },
    { header: 'Tahun Ajaran', accessor: 'tahun' as keyof Siswa },
    { header: 'Kelas', accessor: 'kelas' as keyof Siswa },
    { header: 'Jurusan', accessor: 'nama_rombel' as keyof Siswa },
    { header: 'Email', accessor: 'email' as keyof Siswa },
    { header: 'Barcode', accessor: 'barcode' as keyof Siswa },
    { header: 'Nama Wali', accessor: 'nama_wali' as keyof Siswa },
    {
      header: 'No Wali',
      accessor: 'nomor_wali', // Ini untuk akses ke kolom nomor_wali dalam data
      Cell: ({ row }: any) => {
        const nomorWali = row.nomor_wali; // Ambil nomor_wali langsung dari row.original
        if (!nomorWali) return null; // Pastikan nomor_wali ada
        return (
          <a
            href={`https://wa.me/${nomorWali}`} // Gantikan nomor_wali dengan nomor yang diambil dari baris data
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} color="#25D366" /> {/* Ikon WhatsApp */}
          </a>
        );
      },
    },
    {
      header: "Aksi",
      Cell: ({ row }: { row: Siswa }) => {
        return (
          <div className="relative">
            <button
              className="px-4 py-2 rounded"
              onClick={() => handleToggleDropdown(row.id_siswa)}
            >
              &#8942; {/* Simbol menu */}
            </button>
            {openDropdownId === row.id_siswa && ( // Hanya tampilkan dropdown jika id_siswa sesuai
              <div className="absolute -ml-64 mt-2 w-48 bg-white border rounded shadow-md">
                <button
                  onClick={() => handleEditClick(row)}
                  className="block w-full  px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200"
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
                  className="block px-4 py-2 text-black"
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
      setFormData((prevData) => ({
        ...prevData,
        id_admin: idAdmin,
      }));
    }
  }, [idAdmin]);

  const handleDetailClick = (row: Siswa) => {
    const admin = admins.find(admin => admin.id_admin === row.id_admin); // Cari admin berdasarkan id_admin
    console.log("id admin", admin)
    const namaAdmin = admin ? admin.nama_admin : "Tidak ada"; // Jika ditemukan, ambil nama_admin
    console.log("iki admin", namaAdmin)
    Swal.fire({
      html: `
        <div style="text-align: center;">
          <p>Nama Siswa: ${JSON.stringify(row.nama_siswa) || "Tidak ada"}</p>
          <p>Ditambah oleh: ${namaAdmin  || "Tidak ada"}</p>
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

  const handleToggleDropdown = (id_siswa: string) => {
    setOpenDropdownId(openDropdownId === id_siswa ? null : id_siswa); // Toggle dropdown
  };

  // Fungsi untuk handle klik edit
  const handleEditClick = (row: Siswa) => {
    setEditData(row);
    setIsModalOpen(true);
    
    // Mengatur nilai dropdown untuk kelas, jurusan, dan tahun ajaran
    setSelectedEditKelas(row.id_kelas);
    setSelectedEditTahun(row.id_tahun_pelajaran);
    setSelectedEditRombel(row.id_rombel);
};
  // Handle perubahan input pada form edit
const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  if (editData) {
    const { name, value } = e.target;

    // Update editData berdasarkan input yang berubah
    setEditData(prev => (prev ? { ...prev, [name]: value } : null));
  }
};

// Fungsi untuk submit data yang sudah diedit
const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Mencegah refresh halaman

  if (!editData) {
    toast('Data siswa tidak ditemukan.');
    return;
  }

  try {
    // Memanggil fungsi API untuk mengupdate data siswa
    const updatedSiswa = await updateSiswa([editData]);
    console.log('Data siswa berhasil diperbarui:', updatedSiswa);
    setIsModalOpen(false);

    // Menampilkan notifikasi setelah sukses
    toast('Data siswa berhasil diperbarui!');
  } catch (error) {
    // Menangani error dengan informasi yang lebih baik
    console.error('Gagal memperbarui data siswa:', error.response?.data || error.message);
    toast('Terjadi kesalahan saat memperbarui data siswa.');
  }
};




  const handleDeleteClickk = (row) => {
    setSelectedRow(row); // Simpan data yang ingin dihapus
    setIsConfirmOpen(true); // Buka modal
  };

  const handleConfirmDelete = async () => {
    try {
      // Panggil fungsi delete untuk menghapus data siswa di backend
      await deleteSiswa(selectedRow.id_siswa);
  
      // Setelah sukses, update state di frontend
      setDataSiswa((prevSiswa) => {
        const updatedSiswa = prevSiswa.filter((siswa) => siswa.id_siswa !== selectedRow.id_siswa);
  
        // Periksa apakah data di halaman saat ini masih cukup, jika tidak arahkan ke halaman sebelumnya
        const totalItems = updatedSiswa.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
  
        // Jika currentPage melebihi total halaman baru, arahkan ke halaman sebelumnya
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
  
        return updatedSiswa;
      });
  
      toast.success(`Siswa ${selectedRow.nama_siswa} berhasil dihapus`);
      setIsConfirmOpen(false); // Tutup modal
      setSelectedRow(null); // Reset selectedRow
    } catch (error) {
      console.error("Error deleting siswa:", error);
      toast.error("Gagal menghapus siswa");
    }
  };
  
  const handleCancel = () => {
    setIsConfirmOpen(false); // Tutup modal tanpa hapus
    setSelectedRow(null); // Reset selectedRow
  };
  

 

  //state untuk menghandle input
   // Handler umum untuk input teks
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nis" && !/^\d*$/.test(value)) {
      return; // Jika bukan angka, jangan update state
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  // Handler khusus untuk input foto
  const handleEditFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] }); // Simpan file foto di formData
      setFotoPreview(URL.createObjectURL(e.target.files[0])); // Untuk menampilkan preview
    }
  };

  // Handler khusus untuk input foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);// Simpan file foto di formData
      setFotoPreview(URL.createObjectURL(e.target.files[0])); // Untuk menampilkan preview
    }
  };
  
  //state untuk simpan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Gantikan dengan URL server Anda
      const response = await axios.post(`${baseUrl}/siswa/add-siswa`, [formData]);
      console.log('add respon', response);
      if (response.data.success) {
        toast.success(`Siswa ${formData.nama_siswa} berhasil ditambah!`);
        
         // Menambahkan data siswa yang baru ke state dataSiswa
      setDataSiswa((prevData) => [
        ...prevData,
        {
          ...formData, // Data siswa yang baru ditambahkan
          id_siswa: response.data.id_siswa, // Gunakan id_siswa dari response jika diperlukan
        },
      ]);

        // Kosongkan form setelah submit berhasil
        setFormData({
          id_siswa:'',
          id_admin: '',
          nis: '',
          nama_siswa: '',
          jenis_kelamin: '',
          id_tahun_pelajaran: '',
          id_kelas: '',
          id_rombel: '',
          nama_wali: '',
          nomor_wali: '',
          email: '',
          pass: '',
          foto:'',
          barcode: '',
        });
      } else {
        toast.error('Gagal menambahkan data siswa');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menambahkan data siswa');
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
    console.log('Response from backend:', updatedSiswa);
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
  const [itemsPerPage, setItemsPerPage] = useState(5); // Atur ke angka default
  const [currentPage, setCurrentPage] = useState(1);

  // Memfilter data berdasarkan searchTerm
  const filteredData = dataSiswa.filter((item) => {
    return (
      (item.nis?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (item.nama_siswa ? item.nama_siswa.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (item.jenis_kelamin ? item.jenis_kelamin.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (item.id_kelas ? item.id_kelas.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (item.id_rombel ? item.id_rombel.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false)
    );
  });

  // Fungsi untuk mengurutkan data berdasarkan nama secara alfabetis
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.nama_siswa < b.nama_siswa) return -1; // Urutkan dari A ke Z
    if (a.nama_siswa > b.nama_siswa) return 1;
    return 0;
  });

  // Menghitung pagination
  const totalData = sortedData.length; // Total item setelah difilter
  const totalPages = Math.ceil(totalData / itemsPerPage); // Total halaman

  // Menentukan data yang akan ditampilkan di halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex); // Data yang ditampilkan

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (newPage) => {
    // Pastikan halaman baru valid sebelum mengubah state
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fungsi untuk menangani perubahan items per page
  const handleItemsPerPageChange = (value) => {
    const newItemsPerPage = Number(value);
    const newPage = Math.min(currentPage, Math.ceil(totalData / newItemsPerPage));
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newPage); // Perbarui currentPage agar tetap relevan
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
        id_admin:"",
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
      "id_admin",
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

   // Menggabungkan nilai tahun menjadi satu string dengan format yang diinginkan
const tahunText = `Isi dengan Format:\n${tahunPelajaran.map(tahun => tahun.tahun).join('\n')}`;
// Menambahkan ke komentar worksheet sebagai satu entri
worksheet["F1"].c = [{ t: tahunText }];

const kelasText =` Isi dengan Format:\n${kelas.map(kelas => kelas.kelas).join('\n')}`;
// Menambahkan ke komentar worksheet sebagai satu entri
worksheet["G1"].c = [{ t: kelasText }];

const rombelText =` Isi dengan Format:\n${rombel.map(rombel => rombel.nama_rombel).join('\n')}`;
// Menambahkan ke komentar worksheet sebagai satu entri
worksheet["H1"].c = [{ t:rombelText}];

  
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
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger input file secara manual
    }
  };

   // Fungsi untuk mendapatkan data admin dari API
   const getAdmins = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/all-Admin`); // Ganti dengan endpoint API yang benar
      const data = await response.json();
      console.log('Data Admin:', data.data);
      setAdmins(data.data); // Menyimpan data admin ke state
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  // Panggil getAdmins saat pertama kali komponen dirender
  useEffect(() => {
    getAdmins();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
  
          // Mengambil data tahun ajaran dari API
          const tahunResponse = await fetch(`${baseUrl}/tahun-pelajaran/all-tahun-pelajaran`); // Ganti dengan endpoint API yang benar
          const tahunData = await tahunResponse.json();
          console.log('Respons API tahunData:', tahunData);
          const tahunMap = new Map(tahunData.data.map(item => [item.tahun, item.id_tahun_pelajaran]));
          console.log('Mapping Tahun:', [...tahunMap]);
  
          // Mengambil data kelas dari API
          const kelasResponse = await fetch(`${baseUrl}/kelas/all-kelas`); // Ganti dengan endpoint API yang benar
          const kelasData = await kelasResponse.json();
          console.log('Respons API kelasData:', kelasData);
          const kelasMap = new Map(kelasData.data.map(item => [item.kelas, item.id_kelas]));
          console.log('Mapping Kelas:', [...kelasMap]);
  
          // Mengambil data rombel dari API
          const rombelResponse = await fetch(`${baseUrl}/rombel/all-rombel`); // Ganti dengan endpoint API yang benar
          const rombelData = await rombelResponse.json();
          console.log('Respons API rombelData:', rombelData);
          const rombelMap = new Map(rombelData.data.map(item => [item.nama_rombel, item.id_rombel]));
          console.log('Mapping Rombel:', [...rombelMap]);
  
            // Mapping data dari Excel dengan mengganti id_tahun_pelajaran yang sesuai
            const updatedData = jsonData.map((row) => {
              console.log(`Mencari ID Tahun untuk: ${row.id_tahun_pelajaran}`);
              const cleanedTahun = String(row.id_tahun_pelajaran).trim();
              console.log(`ID Tahun yang dibersihkan: ${cleanedTahun}`);
              const tahunAjaran = tahunMap.get(cleanedTahun);
              console.log(`Tahun Ajaran ditemukan: ${tahunAjaran}`);
  
              console.log(`Mencari ID Kelas untuk: ${row.id_kelas}`);
              const cleanedKelas = String(row.id_kelas).trim();
              console.log(`ID Kelas yang dibersihkan: ${cleanedKelas}`);
              const kelas = kelasMap.get(cleanedKelas);
              console.log(`Kelas ditemukan: ${kelas}`);
  
              console.log(`Mencari ID Rombel untuk: ${row.id_rombel}`);
              const cleanedRombel = String(row.id_rombel).trim();
              console.log(`ID Rombel yang dibersihkan: ${cleanedRombel}`);
              const rombel = rombelMap.get(cleanedRombel);
              console.log(`Rombel ditemukan: ${rombel}`);

              return {
                id_siswa: row.id_siswa || '-',
                id_admin: formData.id_admin || '-', // Menggunakan idAdmin dari formData
                nis: row.nis || '-',
                nama_siswa: row.nama_siswa || '-',
                jenis_kelamin: row.jenis_kelamin || '-',
                id_tahun_pelajaran: tahunAjaran || '-',
                id_kelas: kelas || '-',
                id_rombel: rombel || '-',
                nama_wali: row.nama_wali || '-',
                nomor_wali: row.nomor_wali || '-',
              };
            });
  
             // Tampilkan data yang sudah dimodifikasi
          console.log('Data dari Excel yang sudah dimodifikasi:', updatedData);

          setDataSiswa(updatedData); // Simpan data ke state

          // Kirim data yang sudah dimodifikasi ke server
          const response = await fetch(`${baseUrl}/siswa/add-siswa`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Kirim data yang sudah dimodifikasi
          });

          const result = await response.json();
          if (response.ok) {
            console.log('Data berhasil dikirim', result);
          } else {
            console.error('Gagal mengirim data:', result.error || response.statusText);
          }
        } catch (error) {
          console.error('Error membaca file Excel atau mengirim data:', error);
        }
      };

      reader.readAsArrayBuffer(file); // Mulai membaca file Excel
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
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border relative">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Input Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          <option key={tahun.id_tahun_pelajaran} value={tahun.id_tahun_pelajaran}>
                              {tahun.tahun}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
              <label htmlFor="id_kelas" className="block text-sm font-medium">Kelas:</label>
                  <select
                      name="id_kelas"
                      value={selectedKelas}
                      onChange={handleKelasChange}
                      className="mt-1 p-2 border rounded-md w-full"
                  >
                      <option>Pilih Kelas</option>
                      {kelas.map((kelas) => (
                          <option key={kelas.id_kelas} value={kelas.id_kelas}>
                              {kelas.kelas}
                          </option>
                      ))}
                  </select>
              </div>
              <div>
              <label htmlFor="id_rombel" className="block text-sm font-medium">Jurusan:</label>
                  <select
                      name="id_rombel"
                      value={selectedRombel}
                      onChange={handleRombelChange}
                      className="mt-1 p-2 border rounded-md w-full"
                  >
                      <option>Pilih Jurusan</option>
                      {rombel.map((rombel) => (
                          <option key={rombel.id_rombel} value={rombel.id_rombel}>
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
              <div className="relative w-full">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type={passwordVisible ? "text" : "password"} // Ubah tipe input berdasarkan state
                  name="pass"
                  value={formData.pass}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 pt-3 flex items-center cursor-pointer text-gray-600"
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
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

                {/* Sembunyikan bagian lainnya jika tidak diperlukan */}
              </div>

              {/* Tombol Simpan */}
              <div className=" flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-2 py-1 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white rounded text-sm md:text-sm sm:text-sm  sm:-mr-2 lg:py-2"
                >
                  Simpan
                </button>
              </div>
            </form> 
            <div className="flex flex-col md:flex-row flex-wrap items-start md:-ml-2 md:-mt-10 lg:-mt-9 -mt-12  space-y-2 md:space-y-0 md:space-x-1.5">
              <button
                onClick={handleDownloadFormatClick}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs sm:text-sm"
              >
                Unduh Format
              </button>

              <button
                onClick={handleUploadFileClick}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs sm:text-sm pr-6"
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
                        onChange={(e) => handleItemsPerPageChange(e.target.value)}
                        min="1" // Menambahkan batas minimum
                        className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                      >
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>
            </div>      
              <div className="overflow-x-auto">
                <DataTable 
                  columns={siswaColumns}
                  data={paginatedData}
                  // onEdit={handleEdit}
                  // onDelete={handleDelete}
                /> 
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded p-4 shadow-lg">
                        <h3 className="pb-2">Edit Data Siswa</h3>
                        <form onSubmit={handleEditSubmit}>
                          <input
                            type="text"
                            name="nama_siswa"
                            value={editData ? editData.nama_siswa : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Nama Siswa..."
                          />

                          <input
                            type="text"
                            name="nis"
                            value={editData ? editData.nis : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Nis..."
                          />

                          <select
                            name="jenis_kelamin"
                            value={editData ? editData.jenis_kelamin : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                          >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>

                          <select
                              name="id_tahun_pelajaran"
                              value={selectedEditTahun}
                              onChange={handleEditTahunChange}
                              className="mt-1 p-2 border rounded-md w-full"
                          >
                              <option>Pilih Tahun Pelajaran</option>
                              {tahunEditPelajaran.map((tahun) => (
                                  <option key={tahun.id_tahun_pelajaran} value={tahun.id_tahun_pelajaran}>
                                      {tahun.tahun}
                                  </option>
                              ))}
                          </select>

                          <select
                              name="id_kelas"
                              value={selectedEditKelas}
                              onChange={handleEditKelasChange}
                              className="mt-1 p-2 border rounded-md w-full"
                          >
                              <option>Pilih Kelas</option>
                              {kelas.map((kelas) => (
                                  <option key={kelas.id_kelas} value={kelas.id_kelas}>
                                      {kelas.kelas}
                                  </option>
                              ))}
                          </select>

                          <select
                              name="id_rombel"
                              value={selectedEditRombel}
                              onChange={handleEditRombelChange}
                              className="mt-1 p-2 border rounded-md w-full"
                          >
                              <option>Pilih Rombel</option>
                              {rombel.map((rombel) => (
                                  <option key={rombel.id_rombel} value={rombel.id_rombel}>
                                      {rombel.nama_rombel}
                                  </option>
                              ))}
                          </select>

                          <input
                            type="email"
                            name="email"
                            value={editData ? editData.email : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Email..."
                          />

                          <div className="relative w-full">
                            <input
                              type={passwordVisible ? "text" : "password"} // Ubah tipe input berdasarkan state
                              name="pass"
                              value={formData.pass}
                              onChange={handleChange}
                              placeholder="Password..."
                              className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                              
                            />
                            <span
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-2 pb-2 flex items-center cursor-pointer text-gray-600"
                            >
                              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </span>
                          </div>

                          <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="mt-1 p-2 border rounded-md w-full"
                          />
                          {fotoPreview && <img src={fotoPreview} alt="Preview Foto" className="mt-2 h-20 w-20" />}

                          <input
                            type="text"
                            name="barcode"
                            value={editData ? editData.barcode : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Barcode..."
                          />

                          <input
                            type="text"
                            name="nama_wali"
                            value={editData ? editData.nama_wali : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Nama wali..."
                          />

                          <input
                            type="text"
                            name="nomor_wali"
                            value={editData ? editData.nomor_wali : ""}
                            onChange={handleEditChange}
                            className="w-full p-2 border rounded text-sm sm:text-base mb-2"
                            placeholder="Nomor wali..."
                          />

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

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-white">
                    Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
                  </div>
                  <div className="flex m-4 space-x-2">
                  <button 
                    disabled={currentPage === 1}
                    className={`px-2 py-1 border rounded ${
                      currentPage === 1
                        ? "bg-gray-300"
                        : "bg-teal-400 hover:bg-teal-600 text-white"
                    }  `}
                    onClick={() => handlePageChange(currentPage - 1)} >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === totalPages || paginatedData.length === 0
                    } 
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

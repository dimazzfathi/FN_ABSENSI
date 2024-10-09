"use client";
import { useState, useEffect, useRef } from 'react';
import { updateTahunAjaran, deleteTahunAjaran } from '../../../api/tahunAjaran';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTahunAjaran, fetchTahunAjaran, TahunAjaran } from '../../../api/tahunAjaran';
import DataTable from '../../../components/dataTabel';

export default function Tahun_Ajaran() {
  // State untuk menyimpan nilai input 
  const [statusValue, setStatusValue] = useState("");
  const [thnValue, setThnValue] = useState("");
  const [editThnValue, setEditThnValue] = useState("");
  const [editStatusValue, setEditStatusValue] = useState("");

  const [isResettable, setIsResettable] = useState(false);
  const [errors, setErrors] = useState({ thn: false, status: false });

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

  const [filterStatus, setFilterStatus] = useState("");
  const [filterThn, setFilterThn] = useState("");
  
  // useEffect to monitor changes and update isResettable
  useEffect(() => {
    // Ambil data dari localStorage
    const storedData = localStorage.getItem("tableTahunAjaran");
  
    // Lakukan parsing hanya jika storedData ada dan bukan nilai kosong
    let savedData = [];
    try {
      savedData = storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      savedData = []; // Jika terjadi error parsing, tetap gunakan array kosong
    }
  
    // Set data ke state
    setTableData(savedData);
  
    // Cek kondisi filter untuk menentukan apakah tombol reset bisa diaktifkan
    if (filterStatus || filterThn || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterStatus, filterThn, searchTerm]);
  


  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
    setFilterStatus('');
    setFilterThn('');
    setSearchTerm('');
    }
  };

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableTahunAjaran")) || [];
    setTableData(savedData);
  }, []);

  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
  };
  const handleThnChange = (event) => {
    setThnValue(event.target.value);
  };

    const thnInputRef = useRef(null);
    const statusSelectRef = useRef(null);

  
  
  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    let hasErrors = false;

    // Validasi Tahun Ajaran
    if (!thnValue) {
        if (thnInputRef.current) {
            thnInputRef.current.classList.add('border-red-500');
            thnInputRef.current.focus();
        }
        hasErrors = true;
    } else {
        if (thnInputRef.current) {
            thnInputRef.current.classList.remove('border-red-500');
        }
    }

    // Validasi Status
    if (!statusValue) {
        if (statusSelectRef.current) {
            statusSelectRef.current.classList.add('border-red-500');
            if (!hasErrors) statusSelectRef.current.focus();
        }
        hasErrors = true;
    } else {
        if (statusSelectRef.current) {
            statusSelectRef.current.classList.remove('border-red-500');
        }
    }

    if (hasErrors) return; // Hentikan eksekusi jika ada input yang kosong

    // Proses penyimpanan data jika tidak ada error
    const newData = [
        ...tableData,
        {
            no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
            thn: thnValue,
            status: statusValue,
        },
    ];

    setTableData(newData);
    localStorage.setItem("tableTahunAjaran", JSON.stringify(newData)); // Simpan ke Local Storage

    setStatusValue(""); // Mengosongkan input Status setelah disimpan
    setThnValue(""); // Mengosongkan input Tahun Ajaran setelah disimpan
};



  const handleDownloadFormatClick = () => {
    // Logika untuk mengunduh file format
    console.log('Unduh format');
  };

  const handleUploadFileClick = () => {
    // Logika untuk mengunggah file
    console.log('Upload file');
  };


  const handleEditClick = (item) => {
    // Kosongkan data sebelum mengisi dengan data yang akan diedit
    clearEditData();

    // Setelah itu, set data yang akan diedit
    setEditData(item);
    setEditStatusValue(item.status);
    setEditThnValue(item.thn);
    setShowEditModal(true);
};

// Fungsi untuk mengosongkan state
const clearEditData = () => {
    setEditData(null);
    setEditStatusValue("");
    setEditThnValue("");
};


  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? { ...item, thn: editThnValue, status: editStatusValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableTahunAjaran", JSON.stringify(updatedData));
    setShowEditModal(false);
    setThnValue("");
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
    localStorage.setItem("tableTahunAjaran", JSON.stringify(updatedData)); // Update localStorage
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

  

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Filter dan pencarian logika
  const filteredData = tableData.filter(item => {
    const searchLowerCase = searchTerm.toLowerCase();

    return (
      (filterStatus ? item.status === filterStatus : true) &&
      (filterThn ? item.thn === filterThn : true) &&
      (searchTerm ? (
        (typeof item.nisn === 'string' && item.nisn.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaSiswa === 'string' && item.namaSiswa.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.status === 'string' && item.status.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.thn === 'string' && item.thn.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jk === 'string' && item.jk.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaWali === 'string' && item.namaWali.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.noWali === 'string' && item.noWali.toLowerCase().includes(searchLowerCase))
      ) : true)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

   // List of jurusan options
   const statusOptions = [
    "Aktif",
    "Lulus",
    
  ];

  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>([]);

  useEffect(() => {
    const loadTahunAjaran = async () => {
      const response = await fetchTahunAjaran();
      console.log('API response:', response); // Debugging tambahan
      const data = response.data; 
      setTahunAjaran(data);
    };
    loadTahunAjaran();
  }, []);

  const tahunAjaranColumns = [
    { header: 'ID', accessor: 'id_tahun_pelajaran' as keyof TahunAjaran },
    { header: 'Tahun Ajaran', accessor: 'tahun' as keyof TahunAjaran },
    { header: 'Status', accessor: 'aktif' as keyof TahunAjaran },
  ];

  const handleEdit = async (updatedRow) => {
    try {
      // Pastikan updatedRow memiliki id_tahun_ajaran
      if (!updatedRow.id_tahun_ajaran) {
        throw new Error('ID Tahun Ajaran tidak ditemukan');
      }
  
      // Update state di frontend
      setTahunAjaran((prevTahunAjaran) =>
        prevTahunAjaran.map((tahun) =>
          tahun.id_tahun_pelajaran === updatedRow.id_tahun_ajaran ? updatedRow : tahun
        )
      );
  
      // Kirim request ke backend dengan id yang benar
      const updatedTahunAjaran = await updateTahunAjaran(updatedRow.id_tahun_ajaran, updatedRow);
      toast.success('Data berhasil diperbarui!');
    } catch (error) {
      // Tampilkan lebih banyak detail error dari response server
      console.error('Gagal memperbarui data di backend:', error.response?.data || error.message);
      toast.error(`Gagal memperbarui data: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (deletedRow) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus tahun ajaran ${deletedRow.nama_tahun_ajaran}?`);
    if (confirmed) {
        try {
            // Panggil fungsi deleteTahunAjaran untuk menghapus di backend
            await deleteTahunAjaran(deletedRow.id_tahun_pelajaran);

            // Setelah sukses, update state di frontend
            setTahunAjaran((prevTahunAjaran) =>
                prevTahunAjaran.filter((tahun) => tahun.id_tahun_pelajaran !== deletedRow.id_tahun_pelajaran)
            );
            i
            console.log('Tahun ajaran berhasil dihapus');
        } catch (error) {
            console.error('Error deleting tahun ajaran:', error);
            // Anda bisa menambahkan notifikasi atau pesan error di sini
        }
    }
};

  //.......untuk add data
  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    id_tahun_pelajaran: '',
    id_admin: '',
    tahun: '',
    aktif: 'no',
  });
  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form data:", formData); // Log data yang dikirim
    
    // Validasi: Pastikan 'aktif' tidak kosong
    if (!formData.aktif || !formData.tahun) {
      toast.error("Data tidak boleh kosong"); // Menampilkan pesan error
      return; // Tidak melanjutkan jika 'aktif' kosong
    }

    try {
      // Memanggil fungsi untuk menambah data dan mendapatkan respon
      const response = await addTahunAjaran(formData); 
      console.log("API response:", response)
      // Misalnya, fungsi addTahunAjaran mengembalikan objek yang berisi informasi tentang keberhasilan
      if (response?.data?.exists) { // Gantilah dengan logika yang sesuai
        toast.error("Data sudah ada!"); // Menampilkan pesan jika data sudah ada
      } else {
        toast.success("Tahun ajaran berhasil ditambahkan!"); // Menampilkan pesan sukses
        // Reset form setelah submit
        setFormData({
          id_tahun_pelajaran: '',
          id_admin: '',
          tahun: '',
          aktif: '',
        });
      }
    } catch (error) {
      console.error('Error adding tahun ajaran:', error);
      toast.error("Data sudah ada"); // Menampilkan pesan error
    }
  };

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Tahun Ajaran</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline hover:text-teal-600">Home</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Master Data</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Akademik</a>
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
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <label htmlFor="id_tahun_pelajaran" className="block text-sm mb-2 sm:text-sm font-bold">Tahun Ajaran</label>
            <input
              type="text"
              id="tahun"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Tahun ajaran..."
            />
            <label htmlFor="aktif" className="block text-sm pt-3 mb-2 sm:text-sm font-bold">Status</label>
                <select
                  id="aktif"
                  name="aktif"
                  value={formData.aktif}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${statusValue === "" ? "border-red-500" : "border-gray-300"}`}
                 >
                    <option value="">Pilih status</option>
                    <option value="yes">Aktif</option>
                    <option value="no">Lulus</option>
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
            </button >
                  </div>
            </div>
             
              <div className="overflow-x-auto">
              <DataTable 
                columns={tahunAjaranColumns} 
                data={tahunAjaran}
                onEdit={handleEdit} 
                onDelete={handleDelete}
              />
                {/* <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>                    
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                       Tahun Ajaran
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Status
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.no}>
                        <td className="p-3 sm:p-3 text-white border-b">{item.no}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.thn}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.status}</td>
                        <td className="p-3 sm:p-3 text-white  border-b "
                        style={{ left: '-500px' }}>
                        // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
                        // isOpen: Menentukan apakah dropdown saat ini terbuka berdasarkan nomor item.
                        // onClick: Fungsi untuk menangani aksi klik pada dropdown untuk membuka atau menutupnya.
                        // onDelete: Fungsi untuk memicu proses penghapusan data ketika opsi 'Hapus' dalam dropdown diklik. 
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
                  </table> */}
                </div>

                {/* Pagination */}
          <div className="mt-4 flex justify-between items-center pb-4">
              <div className="text-sm text-gray-700 text-white">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 border rounded ${
                    currentPage === 1 ? "bg-gray-300" : "bg-teal-400 text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 border rounded ${
                    currentPage === totalPages ? "bg-gray-300" : "bg-teal-400 text-white"
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
        )}            
        {showEditModal && (
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
        )}

      </div>
  </>
  )
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
  
function FileUpload() {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    };
  
    const handleClearFile = () => {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input file
      }
    };
  
    return (
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full border border-gray-300 rounded-lg mt-4"
          />
        )}
        <button onClick={handleClearFile}>Clear File</button>
      </div>
    );
  }
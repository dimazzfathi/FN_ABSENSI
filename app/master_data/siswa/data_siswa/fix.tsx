"use client";
import { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';

export default function DataSiswa() {
  // State untuk menyimpan nilai input
    const [nisnValue, setNisnValue] = useState('');
    const [namaSiswaValue, setNamaSiswaValue] = useState('');
    const [jkValue, setJkValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [namaWaliValue, setNamaWaliValue] = useState('');
    const [noWaliValue, setNoWaliValue] = useState('');
    const [tahunAjaranValue, setTahunAjaranValue] = useState('');
    const [kelasValue, setKelasValue] = useState('');
    const [jurusanValue, setJurusanValue] = useState('');
    const [fotoValue, setFotoValue] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);// Untuk pratinjau gambar
    const [validationErrors, setValidationErrors] = useState({
        nisn: false,
        namaSiswa: false,
        jk: false,
        email: false,
        namaWali: false,
        noWali: false,
        tahunAjaran: false,
        kelas: false,
        jurusan: false,
        foto: false
    });
  const [previewURL, setPreviewURL] = useState(""); // State untuk URL preview foto
  const [isResettable, setIsResettable] = useState(false);

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

 

  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  
  // useEffect to monitor changes and update isResettable
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableDataSiswa")) || [];
    setTableData(savedData);
    if (filterKelas || filterJurusan  || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterKelas, filterJurusan , searchTerm]);




  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  // Handler untuk mereset filter
  const handleResetClick = () => {
    if (isResettable) {
    setFilterKelas('');
    setFilterJurusan('');
    setSearchTerm('');
    }
  };

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableDataSiswa")) || [];
    setTableData(savedData);
  }, []);

  const handleNisnChange = (e) => setNisnValue(e.target.value);
  const handleNamaSiswaChange = (e) => setNamaSiswaValue(e.target.value);
  const handleJkChange = (e) => setJkValue(e.target.value);
  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handleNamaWaliChange = (e) => setNamaWaliValue(e.target.value);
  const handleNoWaliChange = (e) => setNoWaliValue(e.target.value);
  const handleTahunAjaranChange = (e) => setTahunAjaranValue(e.target.value);
  const handleKelasChange = (e) => setKelasValue(e.target.value);
  const handleJurusanChange = (e) => setJurusanValue(e.target.value);



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
  
     // Referensi untuk input
     const nisnRef = useRef(null);
     const namaSiswaRef = useRef(null);
     const jkRef = useRef(null);
     const emailRef = useRef(null);
     const namaWaliRef = useRef(null);
     const noWaliRef = useRef(null);
     const tahunAjaranRef = useRef(null);
     const kelasRef = useRef(null);
     const jurusanRef = useRef(null);
     const fotoRef = useRef(null);
  
  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    const inputs = [
        { value: nisnValue, ref: nisnRef, key: 'nisn' },
        { value: namaSiswaValue, ref: namaSiswaRef, key: 'namaSiswa' },
        { value: jkValue, ref: jkRef, key: 'jk' },
        { value: emailValue, ref: emailRef, key: 'email' },
        { value: namaWaliValue, ref: namaWaliRef, key: 'namaWali' },
        { value: noWaliValue, ref: noWaliRef, key: 'noWali' },
        { value: tahunAjaranValue, ref: tahunAjaranRef, key: 'tahunAjaran' },
        { value: kelasValue, ref: kelasRef, key: 'kelas' },
        { value: jurusanValue, ref: jurusanRef, key: 'jurusan' },
        { value: fotoValue, ref: fotoRef, key: 'foto' },
    ];

    const errors = {};
    let firstEmptyInput = null;

    inputs.forEach(input => {
        if (!input.value) {
            errors[input.key] = true;
            if (!firstEmptyInput) {
                firstEmptyInput = input.ref;
            }
        } else {
            errors[input.key] = false;
        }
    });

    setValidationErrors(errors);

    if (firstEmptyInput) {
        firstEmptyInput.current.focus();
        return;
    }

    // Jika semua input valid, lanjutkan dengan menyimpan data
    const newData = [
        ...tableData,
        {
            no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
            kelas: kelasValue,
            jurusan: jurusanValue,
            tahunAjaran: tahunAjaranValue,
            noWali: noWaliValue,
            namaWali: namaWaliValue,
            foto: fotoValue || "", // Handle file URL
            email: emailValue,
            jk: jkValue,
            namaSiswa: namaSiswaValue,
            nisn: nisnValue,
        },
    ];

    setTableData(newData);
    localStorage.setItem("tableDataSiswa", JSON.stringify(newData)); // Simpan ke Local Storage

    // Mengosongkan input setelah disimpan
    setKelasValue("");
    setJurusanValue("");
    setTahunAjaranValue("");
    setNoWaliValue("");
    setNamaWaliValue("");
    setFotoValue(null);
    setEmailValue("");
    setJkValue("");
    setNamaSiswaValue("");
    setNisnValue("");

    // Reset validasi
    setValidationErrors({});
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
    setEditData(item);
    setKelasValue(item.kelas);
    setJurusanValue(item.jurusan);
    setTahunAjaranValue(item.tahunAjaran);
    setNoWaliValue(item.noWali);
    setNamaWaliValue(item.namaWali);
    setPreviewURL(item.foto); // Set preview URL for the edit modal
    setEmailValue(item.email);
    setJkValue(item.jk);
    setNamaSiswaValue(item.namaSiswa);
    setNisnValue(item.nisn);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Revoke previous URL if available
    if (editData.foto && editData.foto.startsWith('blob:')) {
        URL.revokeObjectURL(editData.foto);
    }

    // Handle the new photo URL
    const newFotoURL = fotoValue instanceof File
        ? URL.createObjectURL(fotoValue) // Create a new URL for the file if it's an instance of File
        : editData.foto;

    const updatedData = tableData.map((item) =>
        item.no === editData.no
            ? {
                ...item,
                kelas: kelasValue,
                jurusan: jurusanValue,
                tahunAjaran: tahunAjaranValue,
                noWali: noWaliValue,
                namaWali: namaWaliValue,
                foto: fotoValue || "", // Handle file URL
                jk: jkValue,
                namaSiswa: namaSiswaValue,
                nisn: nisnValue,
            }
            : item
    );

    // Update state and local storage
    setTableData(updatedData);
    localStorage.setItem("tableDataSiswa", JSON.stringify(updatedData));

    // Reset input fields if needed
    setShowEditModal(false);
    setKelasValue("");
    setJurusanValue("");
    setTahunAjaranValue("");
    setNoWaliValue("");
    setNamaWaliValue("");
    setFotoValue(null); // Reset photo value
    setEmailValue("");
    setJkValue("");
    setNamaSiswaValue("");
    setNisnValue("");

    // Revoke the new URL if it was created
    if (fotoValue instanceof File) {
        URL.revokeObjectURL(newFotoURL);
    }
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
      (filterKelas ? item.kelas === filterKelas : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (searchTerm ? (
        (typeof item.nisn === 'string' && item.nisn.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaSiswa === 'string' && item.namaSiswa.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.kelas === 'string' && item.kelas.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jurusan === 'string' && item.jurusan.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jk === 'string' && item.jk.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaWali === 'string' && item.namaWali.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.noWali === 'string' && item.noWali.toLowerCase().includes(searchLowerCase))
      ) : true)
    );
  });

   // State untuk pagination
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fungsi untuk menangani perubahan jumlah item per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset halaman ke 1 setelah mengubah jumlah item per halaman
  };

  // Pagination logic
  const totalPages = itemsPerPage > 0 ? Math.ceil(filteredData.length / itemsPerPage) : 0;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isPreviousDisabled = currentPage === 1 || totalPages === 0;
  const isNextDisabled = currentPage >= totalPages || totalPages === 0;

  //List of Jk
  const jkOptions =[
    "Laki-Laki",
    "Perempuan",
  ]

  //List of Tahun Ajaran
  const tahunAjaranOptions =[
    "2021/2022",
    "2022/2023",
    "2023/2024",
    "2024/2025",
  ]

  //List of class options
  const kelasOptions =[
    "10",
    "11",
    "12",
  ]

  // List of jurusan options
  const jurusanOptions = [
    "TKJ",
    "TKJ 1",
    "TKJ 2",
    "TSM",
    "Bd",
    "BD 1",
    "BD 2",
    "DKV",
  ];

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Data Siswa</h1>
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
                <a href="#" className="text-teal-500 hover:text-teal-600 hover:underline">Siswa</a>
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
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Nisn Siswa</h2>
                <input
                    type="text"
                    value={nisnValue}
                    onChange={handleNisnChange}
                    ref={nisnRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.nisn ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nisn..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Nama Siswa</h2>
                <input
                    type="text"
                    value={namaSiswaValue}
                    onChange={handleNamaSiswaChange}
                    ref={namaSiswaRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.namaSiswa ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nama Siswa..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Jenis Kelamin</h2>
                <select
                    value={jkValue}
                    onChange={handleJkChange}
                    ref={jkRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.jk ? 'border-red-500' : 'border-gray-300'}`}
                 >
                    <option value="">Pilih Jenis Kelamin...</option>
                        {jkOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                </select> 
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Email</h2>
                <input
                    type="email"
                    value={emailValue}
                    onChange={handleEmailChange}
                    ref={emailRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Email..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Foto</h2>
                <input
                    type="file"
                    onChange={handleImageChange}
                    ref={fotoRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.foto ? 'border-red-500' : 'border-gray-300'}`}
                />
                <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Nama Wali</h2>
                <input
                    type="text"
                    value={namaWaliValue}
                    onChange={handleNamaWaliChange}
                    ref={namaWaliRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.namaWali ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nama Wali..."
                />
                <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> No Wali</h2>
                <input
                    type="text"
                    value={noWaliValue}
                    onChange={handleNoWaliChange}
                    ref={noWaliRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.noWali ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="No Wali..."
                />
                <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Tahun Ajaran</h2>
                <select
                    value={tahunAjaranValue}
                    onChange={handleTahunAjaranChange}
                    ref={tahunAjaranRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.tahunAjaran ? 'border-red-500' : 'border-gray-300'}`}
                 >
                    <option value="">Pilih Tahun Ajaran...</option>
                        {tahunAjaranOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                </select> 
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Kelas</h2>
              <select
                value={kelasValue}
                onChange={handleKelasChange}
                ref={kelasRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.kelas ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Pilih Kelas...</option>
                {kelasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold ">
                Input Jurusan
              </h2>
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                ref={jurusanRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${validationErrors.jurusan ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              
                
                 
                
                
             

              <div className="mt-4 flex justify-between items-center">
                
                {/* Tombol Unduh Format dan Upload File */}
                <div className="">
                <button
                    onClick={handleDownloadFormatClick}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 border-slate-500 text-white rounded text-sm sm:text-base"
                >
                    Unduh Format
                </button>
                <button
                    onClick={handleUploadFileClick}
                    className="px-4 py-2 lg:ml-2 md:ml-2 bg-rose-600 hover:bg-rose-700 border-teal-400 text-white  rounded text-sm sm:text-base pr-10 mt-1 text-center"
                >
                    Upload File
                </button>

                </div>
                {/* Tombol Simpan */}
                <div className="flex m-4 space-x-2">
                <button
                  onClick={handleSaveClick}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 hover:bg-teal-500 text-white items-end-end rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
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
                    Tabel Siswa
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
              <div className=''>
                <label htmlFor="filterKelas" className="block text-sm font-medium text-gray-700">
                  {/* Filter Kelas */}
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
                <label htmlFor="filterJurusan" className="block text-sm font-medium text-gray-700">
                  {/* Filter Jurusan */}
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
                <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Foto
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Nisn
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Nama
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Kelas
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Jurusan
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Jk
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Nama Wali
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        No Wali
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
                        <td className='border-b'>
                            {item.foto ? (
                            <img src={item.foto} alt="Foto" width={50} height={50} />
                            ) : (
                            ""
                            )}
                        </td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.nisn}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.namaSiswa}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jurusan}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jk}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.namaWali}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.noWali}</td>
                        <td className="p-3 sm:p-3 text-white border-b text-center">
                        {/* // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
                        // isOpen: Menentukan apakah dropdown saat ini terbuka berdasarkan nomor item.
                        // onClick: Fungsi untuk menangani aksi klik pada dropdown untuk membuka atau menutupnya.
                        // onDelete: Fungsi untuk memicu proses penghapusan data ketika opsi 'Hapus' dalam dropdown diklik. */}
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
                </table>
              </div>

                

              <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-white">
          Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
        </div>
        <div className="flex m-4 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={isPreviousDisabled}
            className={`px-2 py-1 border rounded ${
              isPreviousDisabled ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={isNextDisabled}
            className={`px-2 py-1 border rounded ${
              isNextDisabled ? "bg-gray-300" : "bg-teal-400 hover:bg-teal-600 text-white"
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

        {/* Modal untuk mengedit data */}
        {showEditModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-sm pt-3 sm:text-2xl font-bold">Edit Data</h2>
              {/* Input untuk mengedit foto */}
              <input type="file"
               onChange={handleImageChange} 
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
               />
              <input
                type="text"
                value={nisnValue}
                onChange={handleNisnChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Nisn..."
              />
              <input
                type="text"
                value={namaSiswaValue}
                onChange={handleNamaSiswaChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Nama..."
              />
              <select
                value={kelasValue}
                onChange={handleKelasChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Kelas...</option>
                {kelasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={jkValue}
                onChange={handleJkChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih Jk...</option>
                {jkOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={namaWaliValue}
                onChange={handleNamaWaliChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="NamaWali..."
              />
              <input
                type="text"
                value={noWaliValue}
                onChange={handleNoWaliChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="No Wali..."
              />
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
"use client";
import { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';

export default function DataGuru() {
  // State untuk menyimpan nilai input
  const [nipValue, setNipValue] = useState(""); 
  const [namaGuruValue, setNamaGuruValue] = useState("");
  const [jkValue, setJkValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [noHapeValue, setNoHapeValue] = useState("");
  const [kelasValue, setKelasValue] = useState("");
  const [jurusanValue, setJurusanValue] = useState("");
  const [walasValue, setWalasValue] = useState("");
  const [mapelValue, setMapelValue] = useState("");
  const [fotoValue, setFotoValue] = useState(null); // State untuk foto
  const [imagePreview, setImagePreview] = useState(null);// Untuk pratinjau gambar
  const [isResettable, setIsResettable] = useState(false)
  const [isWalasAktif, setIsWalasAktif] = useState(true);
  const [isInputsActive, setIsInputsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const [editJurusanValue, setEditJurusanValue] = useState('');
  const [toggleStates, setToggleStates] = useState({});

  

  // State untuk menyimpan status error dari input form
  const [errors, setErrors] = useState({
    nip: false,      // Menyimpan status error untuk input NIP
    namaGuru: false, // Menyimpan status error untuk input nama guru
    jk: false,       // Menyimpan status error untuk input jenis kelamin
    email: false,    // Menyimpan status error untuk input email
    noHape: false,   // Menyimpan status error untuk input nomor handphone
    mapel: false,    // Menyimpan status error untuk input mata pelajaran
    kelas: false,    // Menyimpan status error untuk input kelas
    foto: false      // Menyimpan status error untuk input foto
  });

  /// Ref untuk inputan
  const kelasRef = useRef(null);
  const jurusanRef = useRef(null);
  const noHapeRef = useRef(null);
  const fotoRef = useRef(null);
  const emailRef = useRef(null);
  const jkRef = useRef(null);
  const namaGuruRef = useRef(null);
  const nipRef = useRef(null);
  const walasRef = useRef(null);
  const mapelRef = useRef(null);

  const refs = {
    nip: nipRef,
    namaGuru: namaGuruRef,
    jk: jkRef,
    email: emailRef,
    noHape: noHapeRef,
    kelas: kelasRef,
    jurusan: jurusanRef,
    foto: fotoRef,
    walas: walasRef,
    mapel: mapelRef
  };



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
    const savedData = JSON.parse(localStorage.getItem("tableDataGuru")) || [];
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
    // Load data from localStorage when component mounts
    const savedData = localStorage.getItem("tableDataGuru");
    if (savedData) {
      setTableData(JSON.parse(savedData));
    }
  }, []);

  const handleToggleChange = (itemNo) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [itemNo]: !prevStates[itemNo], // Toggle nilai boolean untuk item tertentu
    }));
  };
  
  
  const handleToggleInputs = () => {
    setIsInputsActive(!isInputsActive);

    // Clear the values based on toggle state
    if (isInputsActive) {
      // Toggle is currently active, so it will be turned off
      setJurusanValue(''); // Clear jurusan input
    } else {
      // Toggle is currently inactive, so it will be turned on
      setMapelValue(''); // Clear mapel input
    }
  };

  const handleToggleEdit = () => {
    setIsEditActive((prevState) => {
      const newEditActiveState = !prevState;
  
      if (newEditActiveState) {
        setMapelValue(""); // Clear mapel input when turning on
      } else {
        setJurusanValue(""); // Clear jurusan input when turning off
      }
  
      return newEditActiveState;
    });
  };

  const handleToggleWalas = () => {
    setIsWalasAktif(!isWalasAktif);
  };
  const handleMapelChange = (e) => setMapelValue(e.target.value);
  const handleWalasChange = (e) => setWalasValue(e.target.value);
  const handleNipChange = (e) => setNipValue(e.target.value);
  const handleNamaGuruChange = (e) => setNamaGuruValue(e.target.value);
  const handleJkChange = (e) => setJkValue(e.target.value);
  const handleEmailChange = (e) => setEmailValue(e.target.value);
  const handleNoHapeChange = (e) => setNoHapeValue(e.target.value);
  const handleKelasChange = (e) => setKelasValue(e.target.value);
  const handleJurusanChange = (e) => {
    setJurusanValue(e.target.value);
    // Logika tambahan jika perlu
  };

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

const [existingData, setExistingData] = useState([]);

  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    // Validasi input yang diperlukan
    const newErrors = {
        nip: !nipValue,
        namaGuru: !namaGuruValue,
        jk: !jkValue,
        email: !emailValue,
        noHape: !noHapeValue,
        kelas: !kelasValue,
        foto: !fotoValue
    };

    setErrors(newErrors);

    // Arahkan fokus ke inputan yang pertama kali kosong
    for (const [key, hasError] of Object.entries(newErrors)) {
        if (hasError) {
            refs[key]?.current?.focus();
            return;
        }
    }

    // Jika ada error, batalkan penyimpanan
    if (Object.values(newErrors).some(Boolean)) {
        alert("Ada inputan yang belum diisi!");
        return;
    }

    // Buat URL objek untuk foto jika ada
    

   

    // Buat data baru
    const newData = {
        no: existingData.length > 0 ? Math.max(...existingData.map(item => item.no)) + 1 : 1,
        nip: nipValue,
        namaGuru: namaGuruValue,
        jk: jkValue,
        email: emailValue,
        noHape: noHapeValue,
        mapel: mapelValue || "-",
        kelas: kelasValue,
        jurusan: jurusanValue || "-",
        foto: fotoValue || "", // Handle file URL
        walas: walasValue || "-",
        isActive: isInputsActive,
        isExisting: false // Menandai bahwa ini adalah data baru
    };

    // Simpan data baru dan update state
    setExistingData(prevData => {
        const updatedData = [...prevData, newData];
        setTableData(updatedData); // Update tableData jika perlu
        localStorage.setItem("tableDataGuru", JSON.stringify(updatedData));
        return updatedData; // Pastikan state diperbarui
    });

    // Reset semua input
    setNipValue("");
    setNamaGuruValue("");
    setJkValue("");
    setEmailValue("");
    setNoHapeValue("");
    setKelasValue("");
    setJurusanValue("");
    setWalasValue("");
    setMapelValue("");
    setFotoValue(null);

    // Reset input file
    if (fotoRef.current) {
        fotoRef.current.value = "";
    }
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
    // Set the data for the item being edited
    setEditData(item);
    setKelasValue(item.kelas);
    setJurusanValue(item.jurusan);
    setNoHapeValue(item.noHape);
    setFotoValue(item.foto); // Set preview URL for the edit modal
    setEmailValue(item.email);
    setJkValue(item.jk);
    setNamaGuruValue(item.namaGuru); // Corrected property name
    setNipValue(item.nip);
    setWalasValue(item.walas);
    setMapelValue(item.mapel);
  
    // Ensure toggle state is set for the item being edited
    setToggleStates((prevStates) => ({
      ...prevStates,
      [item.no]: true, // Activate toggle for the edited item
    }));
  
    setShowEditModal(true); // Show the edit modal
  };
  

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? {
            ...item,
            kelas: kelasValue,
            jurusan: jurusanValue || "-",
            noHape: noHapeValue,
            foto: fotoValue || "", // Handle file URL
            email: emailValue,
            jk: jkValue,
            namaGuru: namaGuruValue,
            nip: nipValue,
            walas: walasValue || "-",
            mapel: mapelValue || "-",
            isActive: isEditActive
          }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataGuru", JSON.stringify(updatedData));
    setShowEditModal(false);
    setKelasValue("");
    setJurusanValue("");
    setNoHapeValue("");
    setFotoValue(null);
    setEmailValue("");
    setJkValue("");
    setNamaGuruValue("");
    setNipValue("");
    setWalasValue("");
    setMapelValue("");
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
    localStorage.setItem("tableDataGuru", JSON.stringify(updatedData)); // Update localStorage
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
        (typeof item.nip === 'string' && item.nip.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.namaGuru === 'string' && item.namaGuru.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.mapel === 'string' && item.mapel.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.jk === 'string' && item.jk.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.walas === 'string' && item.walas.toLowerCase().includes(searchLowerCase)) ||
        (typeof item.noHape === 'string' && item.noHape.toLowerCase().includes(searchLowerCase))
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

    // Konstanta untuk menentukan status disabled tombol
    const isPreviousDisabled = currentPage === 1 || totalPages === 0;
    const isNextDisabled = currentPage >= totalPages || totalPages === 0;

   //List of mapel options
   const mapelOptions =[
    "BAHASA INDONESIA",
    "BAHASA JAWA",
    "BAHASA INGGRIS",
    "MATEMATIKA",
    "SAAS",
    "BISNIS",
    "FILM",
    "MESIN",
  ]

  //List of Jk
  const jkOptions =[
    "Laki-Laki",
    "Perempuan",
  ]


  //List of class options
  const kelasOptions =[
    "10",
    "11",
    "12",
    "10 & 11",
    "10 & 12",
    "10 11 12",
    "11 & 12",
  ]

  // List of jurusan options
  const walasOptions = [
    "10 TKJ",
    "10 TSM",
    "10 BD",
    "10 DKV",
    "11 TKJ 1",
    "11 TKJ 2",
    "11 BD",
    "11 DKV",
    "12 TKJ",
    "12 BD 1",
    "12 BD 2",
    "12 DKV",
    
  ];

  // List of jurusan options
  const jurusanOptions = [
    "TKJ",
    "TKJ 1",
    "TKJ 2",
    "TSM",
    "BD",
    "BD 1",
    "BD 2",
    "DKV",
  ];
  

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Data Guru</h1>
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
              <li className="text-gray-500">Data Guru</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Nip </h2>
                <input
                    type="text"
                    value={nipValue}
                    onChange={handleNipChange}
                    ref={nipRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.nip ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Nip..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Nama Guru</h2>
                <input
                    type="text"
                    value={namaGuruValue}
                    onChange={handleNamaGuruChange}
                    ref={namaGuruRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.namaGuru ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Nama Guru..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Jenis Kelamin</h2>
                <select
                    value={jkValue}
                    onChange={handleJkChange}
                    ref={jkRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.jk ? "border-red-500" : "border-gray-300"}`}
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
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Email..."
                />
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> No Hape</h2>
                <input
                    type="text"
                    value={noHapeValue}
                    onChange={handleNoHapeChange}
                    ref={noHapeRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.noHape ? "border-red-500" : "border-gray-300"}`}
                    placeholder="No Hape..."
                />
            <h2 className="text-sm pt-3 mb-1 sm:text-sm pt-3 font-bold"> Mapel</h2>
            <select
                value={mapelValue}
                onChange={handleMapelChange}
                disabled={isInputsActive}
                ref={mapelRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${isInputsActive ? "bg-gray-200" : "bg-white"} ${errors.jurusan ? "border-red-500" : "border-gray-300"}`}
                >
                <option value="">Pilih Jurusan...</option>
                {mapelOptions.map((option, index) => (
                    <option key={index} value={option}>
                    {option}
                    </option>
                ))}
            </select>

                <h2 className="text-sm mb-2 sm:text-sm  font-bold"> Kelas</h2>
                <select
                    value={kelasValue}
                    onChange={handleKelasChange}
                    ref={kelasRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.kelas ? "border-red-500" : "border-gray-300"}`}
                >
                    <option value="">Pilih Kelas...</option>
                    {kelasOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
            <label className="inline-flex items-center  pt-1">
            <input
              type="checkbox"
              checked={isInputsActive}
              onChange={handleToggleInputs}
              className="hidden"
            />
            <span
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                isInputsActive ? "bg-teal-400" : ""
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isInputsActive ? "translate-x-5" : ""
                }`}
              />
            </span>
            <span className="ml-2 text-sm"> Khusus</span>
          </label>
            
            <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold ">
                 Jurusan
            </h2>
            <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                disabled={!isInputsActive}
                ref={jurusanRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${isInputsActive ? "bg-white" : "bg-gray-200"} ${errors.jurusan ? "border-red-500" : "border-gray-300"}`}
                >
                <option value="">Pilih Jurusan...</option>
                {jurusanOptions.map((option, index) => (
                    <option key={index} value={option}>
                    {option}
                    </option>
                ))}
            </select>
       

                {/* Tombol On/Off Geser */}
                <label className="inline-flex pt-3 items-center mb-2">
                    <input
                    type="checkbox"
                    checked={isWalasAktif}
                    onChange={handleToggleWalas}
                    
                    className="hidden"
                    />
                    <span
                    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                        isWalasAktif ? "bg-teal-400" : ""
                    }`}
                    >
                    <span
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                        isWalasAktif ? "translate-x-5" : ""
                        }`}
                    />
                    </span>
                    <span className="ml-2 text-sm"> Walas</span>
                </label>

                
                <select
                    value={walasValue}
                    onChange={handleWalasChange}
                    disabled={!isWalasAktif}
                    ref={walasRef}
                    className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${isWalasAktif ? "bg-white" : "bg-gray-200"} ${errors.walas ? "border-red-500" : "border-gray-300"}`}
                >
                    <option value="">Pilih...</option>
                    {walasOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                    ))}
                </select>        

                <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">Foto</h2>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        ref={fotoRef}
                        className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${errors.foto ? "border-red-500" : "border-gray-300"}`}
                    />
               
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
                    <th className="p-2 sm:p-3 rounded-l-lg bg-slate-500 text-white">No</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Foto</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Nip</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Nama Guru</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">No Hape</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Walas</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Mapel</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Kelas</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Jurusan</th>
                    <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">Aksi</th>
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
                          <span>No Foto</span> // Menampilkan teks jika foto tidak ada
                        )}
                      </td>


                      <td className="p-3 sm:p-3 text-white border-b">{item.nip}</td>
                      <td className="p-3 sm:p-3 text-white border-b">{item.namaGuru}</td>
                      <td className="p-3 sm:p-3 text-white border-b">{item.noHape}</td>
                      <td className="p-3 sm:p-3 text-white border-b">{item.walas}</td>
                      <td className="p-3 sm:p-3 text-white border-b">{item.mapel}</td>
                      <td className="p-3 sm:p-3 text-white border-b">{item.kelas}</td>  
                      <td className="p-3 sm:p-3 text-white border-b">{item.jurusan}</td>

                      <td className="p-3 sm:p-3 text-white border-b text-center">
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
              <h2 className="text-sm mb-2 sm:text-sm pt-3 font-bold"> Foto </h2>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              />
              <h2 className="text-sm mb-2 sm:text-sm pt-3 font-bold"> Nip </h2>
              <input
                type="text"
                value={nipValue}
                onChange={handleNipChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Nip..."
              />
              <h2 className="text-sm mb-2 sm:text-sm pt-3 font-bold"> Nama Guru </h2>
              <input
                type="text"
                value={namaGuruValue}
                onChange={handleNamaGuruChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Nama..."
              />
              <h2 className="text-sm mb-2 sm:text-sm pt-3 font-bold"> No Hape </h2>
              <input
                type="text"
                value={noHapeValue}
                onChange={handleNoHapeChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="No Hape..."
              />
              <label className="inline-flex pt-3 items-center mb-2">
                <input
                  type="checkbox"
                  checked={isWalasAktif}
                  onChange={handleToggleWalas}
                  className="hidden"
                />
                <span
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isWalasAktif ? "bg-teal-400" : ""
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      isWalasAktif ? "translate-x-5" : ""
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm"> Walas</span>
              </label>
              <select
                value={walasValue}
                onChange={handleWalasChange}
                disabled={!isWalasAktif}
                className={`w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2 ${
                  isWalasAktif ? "bg-white" : "bg-gray-200"
                }`}
              >
                <option value="">Pilih...</option>
                {walasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <h2 className="text-sm pt-3 mb-1 sm:text-sm pt-3 font-bold"> Mapel</h2>
              <select
                value={mapelValue}
                onChange={handleMapelChange}
                disabled={isEditActive}
                ref={mapelRef}
                className={`w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2 ${
                  isEditActive ? "bg-gray-100" : "bg-white"
                }`}
                >
                <option value="">Pilih Jurusan...</option>
                {mapelOptions.map((option, index) => (
                    <option key={index} value={option}>
                    {option}
                    </option>
                ))}
            </select>
             
              <h2 className="text-sm mb-2 sm:text-sm font-bold"> Kelas</h2>
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
              <label className="inline-flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={isEditActive}
                  onChange={handleToggleEdit}
                  className="hidden"
                />
                <span
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isEditActive ? "bg-teal-400" : ""
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      isEditActive ? "translate-x-5" : ""
                    }`}
                  />
                </span>
                <span className="ml-2 text-sm"> Khusus</span>
              </label>
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold"> Jurusan</h2>
              <select
                value={jurusanValue}
                onChange={handleJurusanChange}
                disabled={!isEditActive}
                className={`w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2 ${
                  isEditActive ? "bg-white" : "bg-gray-200"
                }`}
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
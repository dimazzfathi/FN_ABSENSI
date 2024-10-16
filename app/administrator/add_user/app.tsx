"use client";
import { useState, useEffect, useRef } from "react";
import Pw from "./pass";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchAdmins, Admin } from "../../api/admin";
import DataTable from "../../components/dataTabel";

export default function DataSiswa() {
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
  const [imagePreview, setImagePreview] = useState(null); // Untuk pratinjau gambar

  //State untuk menyimpan nilai edit
  const [editTtlValue, setEditTtlValue] = useState("");
  const [editNamaSiswaValue, setEditNamaSiswaValue] = useState("");
  const [editJkValue, setEditJkValue] = useState("");
  const [editEmailValue, setEditEmailValue] = useState("");
  const [editAlamatValue, setEditAlamatValue] = useState("");
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [editPasswordValue, setEditPasswordValue] = useState("");
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [editNoWaliValue, setEditNoWaliValue] = useState("");
  const [editPeranValue, setEditPeranValue] = useState("");
  const [editFotoValue, setEditFotoValue] = useState(null); // State untuk foto
  const [editPreviewURL, setEditPreviewURL] = useState(""); // State untuk URL preview foto
  const [editImagePreview, setEditImagePreview] = useState(null); // Untuk pratinjau gambar

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
    if (filterPeran || filterJurusan || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterPeran, filterJurusan, searchTerm]);

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
      setFilterperan("");
      setFilterJurusan("");
      setSearchTerm("");
    }
  };

  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem("tableDataSiswa")) || [];
    setTableData(savedData);

    const savedImage = localStorage.getItem("profileImage");
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
  const maskPassword = (password: string | undefined) => {
    if (password) {
      return "*".repeat(password.length);
    }
    return "";
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

  const [validationErrors, setValidationErrors] = useState({
    namaSiswa: false,
    ttl: false,
    jk: false,
    email: false,
    alamat: false,
    username: false,
    password: false,
    noWali: false,
    peran: false,
    foto: false,
  });
  const namaSiswaRef = useRef(null);
  const ttlRef = useRef(null);
  const jkRef = useRef(null);
  const emailRef = useRef(null);
  const alamatRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const noWaliRef = useRef(null);
  const peranRef = useRef(null);
  const fotoRef = useRef(null);

  // Fungsi untuk menyimpan data baru ke dalam tabel
  const handleSaveClick = () => {
    const inputs = [
      { value: namaSiswaValue, ref: namaSiswaRef, key: "namaSiswa" },
      { value: ttlValue, ref: ttlRef, key: "ttl" },
      { value: jkValue, ref: jkRef, key: "jk" },
      { value: emailValue, ref: emailRef, key: "email" },
      { value: alamatValue, ref: alamatRef, key: "alamat" },
      { value: usernameValue, ref: usernameRef, key: "username" },
      { value: passwordValue, ref: passwordRef, key: "password" },
      { value: noWaliValue, ref: noWaliRef, key: "noWali" },
      { value: peranValue, ref: peranRef, key: "peran" },
      { value: fotoValue, ref: fotoRef, key: "foto" },
    ];

    const errors = {};
    let firstEmptyInput = null;

    inputs.forEach((input) => {
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

    const newData = [
      ...tableData,
      {
        no:
          tableData.length > 0
            ? Math.max(...tableData.map((item) => item.no)) + 1
            : 1,
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

  const handleDownloadFormatClick = () => {
    // Logika untuk mengunduh file format
    console.log("Unduh format");
  };

  const handleUploadFileClick = () => {
    // Logika untuk mengunggah file
    console.log("Upload file");
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setEditPeranValue(item.peran);
    setEditNoWaliValue(item.noWali);
    setEditUsernameValue(item.username);
    setEditPasswordValue(item.password);
    setEditPreviewURL(item.imagePreview); // setEdit preview URL for the edit modal
    setEditAlamatValue(item.alamat);
    setEditEmailValue(item.email);
    setEditJkValue(item.jk);
    setEditNamaSiswaValue(item.namaSiswa);
    setEditTtlValue(item.ttl);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? {
            ...item,
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
    setEditPeranValue("");
    setEditNoWaliValue("");
    setEditUsernameValue("");
    setEditPasswordValue("");
    setEditFotoValue(null);
    setEditAlamatValue("");
    setEditJkValue("");
    setEditNamaSiswaValue("");
    setEditTtlValue("");
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
  const filteredData = tableData.filter((item) => {
    const searchLowerCase = searchTerm.toLowerCase();

    return (
      (filterPeran ? item.peran === filterPeran : true) &&
      (filterJurusan ? item.jurusan === filterJurusan : true) &&
      (searchTerm
        ? (typeof item.ttl === "string" &&
            item.ttl.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.namaSiswa === "string" &&
            item.namaSiswa.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.peran === "string" &&
            item.peran.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.jurusan === "string" &&
            item.jurusan.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.jk === "string" &&
            item.jk.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.email === "string" &&
            item.email.toLowerCase().includes(searchLowerCase)) ||
          (typeof item.noWali === "string" &&
            item.noWali.toLowerCase().includes(searchLowerCase))
        : true)
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

  //List of Jk
  const jkOptions = ["Laki-Laki", "Perempuan"];

  //List of class options
  const peranOptions = ["Guru", "Siswa", "Administrator"];

  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const loadAdmins = async () => {
      const response = await fetchAdmins();
      console.log("API response:", response); // Debugging tambahan
      const data = response.data;
      setAdmins(data);
    };
    loadAdmins();
  }, []);
  const adminColumns = [
    { header: "No", accessor: "id_admin" as keyof Admin },
    { header: "Nama", accessor: "nama_admin" as keyof Admin },
    { header: "Alamat", accessor: "alamat" as keyof Admin },
    { header: "Jk", accessor: "jenis_kelamin" as keyof Admin },
    { header: "No telepon", accessor: "no_telp" as keyof Admin },
    { header: "Email", accessor: "email" as keyof Admin },
    // { header: 'Username', accessor: 'username' as keyof Admin },
    // { header: 'Password', accessor: 'pass' as keyof Admin },
    { header: "Foto", accessor: "foto" as keyof Admin },
    { header: "Status", accessor: "status" as keyof Admin },
  ];

  const handleEdit = (updatedRow) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map(
        (admin) => (admin.id === updatedRow.id ? updatedRow : admin) // Update row yang sesuai
      )
    );
  };

  const handleDelete = (deletedRow) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${deletedRow.name}?`
    );
    if (confirmed) {
      setAdmins(
        (prevAdmins) => prevAdmins.filter((admin) => admin.id !== deletedRow.id) // Hapus data yang sesuai
      );
    }
  };

  return (
    <>
      <div className="rounded-lg max-w-full bg-slate-100">
        <div className="pt-8 ml-7">
          <h1 className="text-2xl font-bold">Add User</h1>
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
                  Administrator
                </a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-500">Add User</li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Column 1: Input */}
          <div className="w-full lg:w-1/3 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Nama Siswa
              </h2>
              <input
                type="text"
                value={namaSiswaValue}
                onChange={handleNamaSiswaChange}
                ref={namaSiswaRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.namaSiswa
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nama Siswa..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Tempat Tanggal Lahir
              </h2>
              <input
                type="text"
                value={ttlValue}
                onChange={handleTtlChange}
                ref={ttlRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.ttl ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tempat Tanggal Lahir..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Jenis Kelamin
              </h2>
              <select
                value={jkValue}
                onChange={handleJkChange}
                ref={jkRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.jk ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih Jenis Kelamin...</option>
                {jkOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Alamat
              </h2>
              <input
                type="alamat"
                value={alamatValue}
                onChange={handleAlamatChange}
                ref={alamatRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.alamat ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Alamat..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Email
              </h2>
              <input
                type="email"
                value={emailValue}
                onChange={handleEmailChange}
                ref={emailRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Username
              </h2>
              <input
                type="username"
                value={usernameValue}
                onChange={handleUsernameChange}
                ref={usernameRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.username
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Username..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Password
              </h2>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={passwordValue}
                  onChange={handlePasswordChange}
                  ref={passwordRef}
                  className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Password..."
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 pb-2 flex items-center cursor-pointer text-gray-600"
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                No Telepon
              </h2>
              <input
                type="text"
                value={noWaliValue}
                onChange={handleNoWaliChange}
                ref={noWaliRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.noWali ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="No Telepon..."
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Foto
              </h2>
              <input
                type="file"
                onChange={handleImageChange}
                ref={fotoRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.foto ? "border-red-500" : "border-gray-300"
                }`}
              />
              <h2 className="text-sm pt-3 mb-2 sm:text-sm pt-3 font-bold">
                {" "}
                Peran
              </h2>
              <select
                value={peranValue}
                onChange={handlePeranChange}
                ref={peranRef}
                className={`w-full p-2 border rounded text-sm sm:text-base mb-2 ${
                  validationErrors.peran ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih Peran...</option>
                {peranOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex justify-end items-center">
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
                      Tabel Add USer
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
                  <div className="">
                    <label
                      htmlFor="filterPeran"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {/* Filter peran */}
                    </label>
                    <select
                      id="filterPeran"
                      value={filterPeran}
                      onChange={handleFilterChange(setFilterperan)}
                      className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                    >
                      <option value="">Semua peran</option>
                      {peranOptions.map((peran, index) => (
                        <option key={index} value={peran}>
                          {peran}
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
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <DataTable
                    columns={adminColumns}
                    data={admins}
                    onEdit={handleEdit} // Fungsi ini dipassing ke komponen DataTable
                    onDelete={handleDelete}
                  />
                  {/* <table className="w-full text-left mt-4 border-collapse">
                  <thead>
                    <tr className="ml-2">
                      <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Foto
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Nama
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Username
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Password
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Peran
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Email
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Alamat
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Ttl
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        Jenis Kelamin
                      </th>
                      <th className="p-2 sm:p-3 bg-slate-500 text-white">
                        No Tlpn
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
                        <td className="p-3 sm:p-3 text-white border-b">{item.namaSiswa}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.username}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{maskPassword(item.password)}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.peran}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.email}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.alamat}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.ttl}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.jk}</td>
                        <td className="p-3 sm:p-3 text-white border-b">{item.noWali}</td>
                        <td className="p-3 sm:p-3 text-white border-b text-center">
                        {/* // Komponen DropdownMenu yang ditampilkan dalam tabel untuk setiap baris data.
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
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-700 text-white">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex m-4 space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 border rounded ${
                        currentPage === 1
                          ? "bg-gray-300"
                          : "bg-teal-400 hover:bg-teal-600 text-white"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 border rounded ${
                        currentPage === totalPages
                          ? "bg-gray-300"
                          : "bg-teal-400 hover:bg-teal-600 text-white"
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
              <input
                type="text"
                value={editNamaSiswaValue}
                onChange={(e) => setEditNamaSiswaValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Nama..."
              />
              <input
                type="text"
                value={editTtlValue}
                onChange={(e) => setEditTtlValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Ttl..."
              />
              <select
                value={editJkValue}
                onChange={(e) => setEditJkValue(e.target.value)}
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
                type="alamat"
                value={editAlamatValue}
                onChange={(e) => setEditAlamatValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Alamat..."
              />
              <input
                type="username"
                value={editUsernameValue}
                onChange={(e) => setEditUsernameValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Username..."
              />
              <input
                type="email"
                value={editEmailValue}
                onChange={(e) => setEditEmailValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Email..."
              />
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={editPasswordValue}
                  onChange={(e) => setEditPasswordValue(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded text-sm sm:text-base mb-2"
                  placeholder="Password..."
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 pb-2 flex items-center cursor-pointer text-gray-600"
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <input
                type="text"
                value={editNoWaliValue}
                onChange={(e) => setEditNoWaliValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="No Wali..."
              />
              {/* Input untuk mengedit foto */}
              <input
                type="file"
                onChange={(e) => setEditFotoValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              />
              <select
                value={editPeranValue}
                onChange={(e) => setEditPeranValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="">Pilih peran...</option>
                {peranOptions.map((option, index) => (
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
} // Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
function DropdownMenu({ isOpen, onClick, onEdit, onDelete, onClose }) {
  const dropdownRef = useRef(null);

  //Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  const handleClickOutside = (event) => {
    console.log("Clicked outside"); // Debugging
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      console.log("Outside detected"); // Debugging
      if (typeof onClose === "function") {
        onClose(); // Memanggil fungsi onClose untuk menutup dropdown
      }
    }
  };
  //untuk detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleDetailClick = () => {
    setIsModalOpen(true);
    if (typeof onClose === "function") {
      onClose(); // Menutup dropdown setelah detail diklik
    }
  };
  const handleConfirm = (password) => {
    setConfirmedPassword(password); // Menyimpan password di state
  };
  //detail end

  useEffect(() => {
    console.log("Effect ran", isOpen); // Debugging
    // Menambahkan event listener untuk menangani klik di luar dropdown jika dropdown terbuka.
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Menghapus event listener ketika dropdown ditutup.
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function untuk menghapus event listener saat komponen di-unmount atau isOpen berubah.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      console.log("Cleanup"); // Debugging
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
          style={{ left: "-62px", top: "20px" }} // Menggeser dropdown ke kiri
        >
          <button
            className="block w-full px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-slate-500"
            onClick={handleDetailClick}
          >
            Detail
          </button>
          <Pw
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirm}
          />
          <button
            onClick={() => {
              onEdit();
              if (typeof onClose === "function") {
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
              if (typeof onClose === "function") {
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
      fileInputRef.current.value = ""; // Reset input file
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

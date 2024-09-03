"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  const [previewURL, setPreviewURL] = useState(""); // State untuk URL preview foto
  const [isResettable, setIsResettable] = useState(false);
  const [isWalasAktif, setIsWalasAktif] = useState(true);
  const [isInputsActive, setIsInputsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const [editJurusanValue, setEditJurusanValue] = useState('');
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState({
    nip: false,
    namaGuru: false,
    jk: false,
    email: false,
    noHape: false,
    mapel: false,
    kelas: false,
    foto: false
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
  const [editData, setEditData] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  // Ref untuk inputan
  const kelasRef = useRef<HTMLInputElement | null>(null);
  const jurusanRef = useRef<HTMLInputElement | null>(null);
  const noHapeRef = useRef<HTMLInputElement | null>(null);
  const fotoRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const jkRef = useRef<HTMLInputElement | null>(null);
  const namaGuruRef = useRef<HTMLInputElement | null>(null);
  const nipRef = useRef<HTMLInputElement | null>(null);
  const walasRef = useRef<HTMLInputElement | null>(null);
  const mapelRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableDataGuru") || "[]");
    setTableData(savedData);
    setIsResettable(filterKelas || filterJurusan || searchTerm ? true : false);
  }, [filterKelas, filterJurusan, searchTerm]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleResetClick = () => {
    if (isResettable) {
      setFilterKelas('');
      setFilterJurusan('');
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableDataGuru") || "[]");
    setTableData(savedData);
  }, []);

  const handleToggleChange = (itemNo: number) => {
    setToggleStates(prevStates => ({
      ...prevStates,
      [itemNo]: !prevStates[itemNo]
    }));
  };

  const handleToggleInputs = () => {
    setIsInputsActive(!isInputsActive);
    if (isInputsActive) {
      setJurusanValue(''); // Clear jurusan input
    } else {
      setMapelValue(''); // Clear mapel input
    }
  };

  const handleToggleEdit = () => {
    setIsEditActive(prevState => {
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

  const handleMapelChange = (e: React.ChangeEvent<HTMLInputElement>) => setMapelValue(e.target.value);
  const handleWalasChange = (e: React.ChangeEvent<HTMLInputElement>) => setWalasValue(e.target.value);
  const handleNipChange = (e: React.ChangeEvent<HTMLInputElement>) => setNipValue(e.target.value);
  const handleNamaGuruChange = (e: React.ChangeEvent<HTMLInputElement>) => setNamaGuruValue(e.target.value);
  const handleJkChange = (e: React.ChangeEvent<HTMLInputElement>) => setJkValue(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmailValue(e.target.value);
  const handleNoHapeChange = (e: React.ChangeEvent<HTMLInputElement>) => setNoHapeValue(e.target.value);
  const handleKelasChange = (e: React.ChangeEvent<HTMLInputElement>) => setKelasValue(e.target.value);
  const handleJurusanChange = (e: React.ChangeEvent<HTMLInputElement>) => setJurusanValue(e.target.value);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const objectURL = URL.createObjectURL(compressedFile);
        setPreviewURL(objectURL);
        setFotoValue(compressedFile);
        return () => URL.revokeObjectURL(objectURL);
      } catch (error) {
        console.error("Error saat mengompresi gambar:", error);
      }
    }
  };

  const handleSaveClick = () => {
    const existingData = JSON.parse(localStorage.getItem("tableDataGuru") || "[]");
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
    for (const [key, value] of Object.entries(newErrors)) {
      if (value) {
        switch (key) {
          case 'nip':
            nipRef.current?.focus();
            break;
          case 'namaGuru':
            namaGuruRef.current?.focus();
            break;
          case 'jk':
            jkRef.current?.focus();
            break;
          case 'email':
            emailRef.current?.focus();
            break;
          case 'noHape':
            noHapeRef.current?.focus();
            break;
          case 'kelas':
            kelasRef.current?.focus();
            break;
          case 'foto':
            fotoRef.current?.focus();
            break;
          default:
            break;
        }
        return;
      }
    }

    if (Object.values(newErrors).includes(true)) {
      alert("Ada inputan yang belum diisi!");
      return;
    }

    const newData = {
      no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
      nip: nipValue,
      namaGuru: namaGuruValue,
      jk: jkValue,
      email: emailValue,
      noHape: noHapeValue,
      mapel: mapelValue || "",
      kelas: kelasValue,
      jurusan: jurusanValue || "", // Menggunakan jurusanValue jika tersedia
      foto: fotoValue ? URL.createObjectURL(fotoValue) : "", // Tampilkan URL jika fotoValue tersedia
    };

    // Update data tabel
    const updatedData = [...tableData, newData];
    setTableData(updatedData);
    localStorage.setItem("tableDataGuru", JSON.stringify(updatedData));

    // Reset state setelah menyimpan data
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
    setPreviewURL("");
  };

  const handleEditClick = (data: any) => {
    setEditData(data);
    setEditJurusanValue(data.jurusan || '');
    setShowEditModal(true);
  };

  const handleEditSaveClick = () => {
    const updatedData = tableData.map(item => 
      item.no === editData?.no ? { ...item, jurusan: editJurusanValue } : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableDataGuru", JSON.stringify(updatedData));
    setShowEditModal(false);
    setEditData(null);
  };

  const handleEditCancelClick = () => {
    setShowEditModal(false);
    setEditData(null);
  };

  const handleDeleteClick = (no: number) => {
    setConfirmDelete({ visible: true, id: no });
  };

  const handleDeleteConfirm = () => {
    const updatedData = tableData.filter(item => item.no !== confirmDelete.id);
    setTableData(updatedData);
    localStorage.setItem("tableDataGuru", JSON.stringify(updatedData));
    setConfirmDelete({ visible: false, id: null });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = tableData.filter(item => {
    return (filterKelas ? item.kelas.includes(filterKelas) : true) &&
           (filterJurusan ? item.jurusan.includes(filterJurusan) : true) &&
           (searchTerm ? item.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) : true);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="mb-4">
        <button onClick={handleResetClick} className="bg-teal-400 text-white px-4 py-2 rounded">
          Reset
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 ml-2"
        />
        <input
          type="text"
          placeholder="Filter Kelas"
          value={filterKelas}
          onChange={handleFilterChange(setFilterKelas)}
          className="border rounded px-4 py-2 ml-2"
        />
        <input
          type="text"
          placeholder="Filter Jurusan"
          value={filterJurusan}
          onChange={handleFilterChange(setFilterJurusan)}
          className="border rounded px-4 py-2 ml-2"
        />
      </div>

      <div className="mb-4">
        <button onClick={handleToggleInputs} className="bg-teal-400 text-white px-4 py-2 rounded">
          Toggle Inputs
        </button>
        {isInputsActive && (
          <div>
            <input
              type="text"
              placeholder="Jurusan"
              value={jurusanValue}
              onChange={handleJurusanChange}
              className="border rounded px-4 py-2 mt-2"
            />
          </div>
        )}
        {isEditActive && (
          <div>
            <input
              type="text"
              placeholder="Edit Jurusan"
              value={editJurusanValue}
              onChange={e => setEditJurusanValue(e.target.value)}
              className="border rounded px-4 py-2 mt-2"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button onClick={handleToggleWalas} className="bg-teal-400 text-white px-4 py-2 rounded">
          Toggle Walas
        </button>
        {isWalasAktif && (
          <div>
            <input
              type="text"
              placeholder="Walas"
              value={walasValue}
              onChange={handleWalasChange}
              className="border rounded px-4 py-2 mt-2"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button onClick={handleSaveClick} className="bg-teal-400 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>

      {showEditModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-lg font-semibold">Edit Data</h3>
            <input
              type="text"
              placeholder="Edit Jurusan"
              value={editJurusanValue}
              onChange={e => setEditJurusanValue(e.target.value)}
              className="border rounded px-4 py-2 mt-2"
            />
            <button onClick={handleEditSaveClick} className="bg-teal-400 text-white px-4 py-2 rounded mt-2">
              Save
            </button>
            <button onClick={handleEditCancelClick} className="bg-red-400 text-white px-4 py-2 rounded mt-2 ml-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmDelete.visible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h3 className="text-lg font-semibold">Are you sure you want to delete?</h3>
            <button onClick={handleDeleteConfirm} className="bg-red-400 text-white px-4 py-2 rounded mt-2">
              Delete
            </button>
            <button onClick={handleDeleteCancel} className="bg-gray-400 text-white px-4 py-2 rounded mt-2 ml-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">No</th>
            <th className="border-b p-2">NIP</th>
            <th className="border-b p-2">Nama Guru</th>
            <th className="border-b p-2">JK</th>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">No Hape</th>
            <th className="border-b p-2">Kelas</th>
            <th className="border-b p-2">Jurusan</th>
            <th className="border-b p-2">Foto</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.no}>
              <td className="border-b p-2">{item.no}</td>
              <td className="border-b p-2">{item.nip}</td>
              <td className="border-b p-2">{item.namaGuru}</td>
              <td className="border-b p-2">{item.jk}</td>
              <td className="border-b p-2">{item.email}</td>
              <td className="border-b p-2">{item.noHape}</td>
              <td className="border-b p-2">{item.kelas}</td>
              <td className="border-b p-2">{item.jurusan}</td>
              <td className="border-b p-2">
                {item.foto && <img src={item.foto} alt="Foto" className="w-16 h-16 object-cover"/>}
              </td>
              <td className="border-b p-2">
                <button onClick={() => handleEditClick(item)} className="bg-yellow-400 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDeleteClick(item.no)} className="bg-red-400 text-white px-2 py-1 rounded ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="bg-teal-400 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="bg-teal-400 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};


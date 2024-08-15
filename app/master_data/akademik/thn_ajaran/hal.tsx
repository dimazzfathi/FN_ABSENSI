"use client";
import { useState, useEffect, useRef } from 'react';


export default function Hal() {
  // Menyimpan nilai input tahun ajaran
  const [inputValue, setInputValue] = useState('');

  // Menyimpan nilai keterangan (Aktif atau Lulus)
  const [keteranganValue, setKeteranganValue] = useState('Aktif');

  // Menyimpan data tabel dalam state
  const [tableData, setTableData] = useState([]);

  // Menyimpan ID dropdown yang sedang terbuka (untuk menampilkan/hiding dropdown)
  const [openDropdown, setOpenDropdown] = useState(null);

  // Menyimpan status dan ID data yang akan dihapus untuk modal konfirmasi
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  // State untuk menyimpan data yang sedang diedit
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    // Ambil data dari Local Storage saat komponen dimuat
    const savedData = JSON.parse(localStorage.getItem('tableData')) || [];
    setTableData(savedData);
  }, []);

  // Fungsi ini digunakan untuk mengupdate state 'inputValue' ketika nilai pada elemen input berubah
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Fungsi untuk menangani perubahan pada input select (dropdown) untuk keterangan
  // Ketika pengguna memilih opsi baru, fungsi ini akan memperbarui state keteranganValue
  const handleKeteranganChange = (e) => {
    setKeteranganValue(e.target.value);
  };

  // Fungsi untuk menangani klik pada tombol dropdown. 
  // Jika dropdown dengan ID tertentu sedang terbuka, maka akan menutupnya (set ke null).
  // Jika dropdown dengan ID tertentu belum terbuka, maka akan membukanya (set ke ID tersebut).
  const handleDropdownClick = (id) => {
  setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // Fungsi untuk menyimpan data baru ke dalam tabel.
  // Membuat objek data baru dengan nomor urut, tahun ajaran, dan keterangan yang diambil dari input.
  // Data baru ditambahkan ke array tableData yang ada.
  // State tableData diupdate dan data disimpan ke Local Storage.
  const handleSaveClick = () => {
    const newData = [
      ...tableData,
      { 
        no: tableData.length + 1, 
        tahun_ajaran: inputValue, 
        keterangan: keteranganValue
      }
    ];

    setTableData(newData);
    localStorage.setItem('tableData', JSON.stringify(newData)); // Simpan ke Local Storage

    setInputValue(''); // Mengosongkan input tahun ajaran setelah disimpan
    setKeteranganValue('Aktif'); // Mengembalikan input keterangan ke default 'Aktif'
  };
  
  const handlePreviousClick = () => {
    console.log('Previous button clicked');
    // Implementasi fungsi untuk tombol Previous sesuai kebutuhan Anda.
  };
  
  const handleNextClick = () => {
    console.log('Next button clicked');
    // Implementasi fungsi untuk tombol Next sesuai kebutuhan Anda.
  };

  // Fungsi untuk menangani klik edit pada dropdown
  const handleEditClick = (item) => {
    setEditData(item);
    setInputValue(item.tahun_ajaran);
    setKeteranganValue(item.keterangan);
    setShowEditModal(true);
  };

  // Fungsi untuk menyimpan perubahan setelah edit
  const handleSaveEdit = () => {
    const updatedData = tableData.map(item =>
      item.no === editData.no
        ? { ...item, tahun_ajaran: inputValue, keterangan: keteranganValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem('tableData', JSON.stringify(updatedData));
    setShowEditModal(false);
    setInputValue('');
    setKeteranganValue('Aktif');
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null); // Close dropdown when delete is clicked
  };

  // Fungsi untuk menghapus data dari tabel berdasarkan ID yang dikonfirmasi.
  // Setelah penghapusan, nomor urut data yang tersisa diperbarui dan data disimpan ke Local Storage.

  const handleConfirmDelete = () => {
  // Filter data yang tidak sesuai dengan ID yang akan dihapus
  const filteredData = tableData.filter(item => item.no !== confirmDelete.id);

  // Perbarui nomor urut data yang tersisa agar mulai dari 1 dan berurutan
  const updatedData = filteredData.map((item, index) => ({
    ...item,
    no: index + 1
  }));

  // Update state tableData dengan data yang telah di-filter dan di-update
  setTableData(updatedData);

  // Simpan data yang telah di-update ke Local Storage
  localStorage.setItem('tableData', JSON.stringify(updatedData));

  // Reset state confirmDelete untuk menutup modal dan menghapus ID yang dihapus
  setConfirmDelete({ visible: false, id: null });
  };

  // Fungsi untuk membatalkan proses penghapusan data.
  // Mengatur ulang state confirmDelete agar modal konfirmasi ditutup dan tidak ada data yang dihapus.
  const handleCancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  return (
    <>
      <div className=' min-h-screen max-w-full bg-slate-100'>
        <div className="mt-4 ml-7">
          <h1 className="text-2xl font-bold ">Tahun Ajaran</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline">Home</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">Master Data</a>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <a href="#" className="text-teal-500 hover:underline">Akademik</a>
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
          <div className="w-full lg:w-3/4 p-4  lg:p-6">
            <div className="bg-white rounded rounded-lg shadow-md p-4 lg:p-6 border">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Input Tahun</h2>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
                placeholder="Tahun Ajaran..."
              />
              <select
                value={keteranganValue}
                onChange={handleKeteranganChange}
                className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              >
                <option value="Aktif">Aktif</option>
                <option value="Lulus">Lulus</option>
              </select>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveClick}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Table */}
          <div className="w-full lg:w-3/4 p-4 lg:p-6">
            <div className="bg-white rounded-lg rounded shadow-md p-4 lg:p-6 border">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Hasil Inputan</h2>
              <div className="">
                <table className="min-w-full bg-white border border-gray-300 text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th className="py-1 px-2 border-r border-gray-300">No</th>
                      <th className="py-1 px-2 border-r border-gray-300">Tahun Ajaran</th>
                      <th className="py-1 px-2 border-r border-gray-300">Keterangan</th>
                      <th className="py-1 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item) => (
                      <tr key={item.no} className="border-b border-gray-300">
                        <td className="py-1 px-2 border-r border-gray-300">{item.no}</td>
                        <td className="py-1 px-2 border-r border-gray-300">{item.tahun_ajaran}</td>
                        <td className={`py-1 px-2 border-r border-gray-300 ${
                          item.keterangan === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {item.keterangan}
                        </td>
                        <td className="py-1 px-2 relative text-center">
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
                {/* Tombol Previous dan Next */}
                <div className="flex justify-end mt-4 lg:mt-6">
                  <button
                    onClick={handlePreviousClick}
                    className="px-3 py-2 sm:px-4 sm:py-2 mx-1 bg-teal-400 text-white rounded text-sm sm:text-base"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextClick}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-teal-400 text-white rounded text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        
      <table id="myTable" >
    <thead>
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Row 1 Data 1</td>
            <td>Row 1 Data 2</td>
        </tr>
        <tr>
            <td>Row 2 Data 1</td>
            <td>Row 2 Data 2</td>
        </tr>
    </tbody>
</table>
      </div>

      {/* Modal Edit */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Edit Data</h3>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
              placeholder="Tahun Ajaran..."
            />
            <select
              value={keteranganValue}
              onChange={handleKeteranganChange}
              className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base mb-2"
            >
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus</option>
            </select>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-2 mr-2 bg-gray-300 text-black rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 bg-teal-400 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal Konfirmasi Hapus */}
      {confirmDelete.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-2 mr-2 bg-gray-300 text-black rounded"
              >
                Tidak
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Komponen DropdownMenu yang menampilkan menu aksi untuk setiap item dalam tabel.
// isOpen: Properti boolean yang menentukan apakah menu dropdown saat ini terbuka.
// onClick: Fungsi callback yang dipanggil saat tombol dropdown diklik, untuk membuka atau menutup menu.
// onDelete: Fungsi callback yang dipanggil saat opsi 'Hapus' dipilih dari menu dropdown.
function DropdownMenu({ isOpen, onClick, onDelete, onEdit }) {

  // Referensi ke elemen dropdown untuk mendeteksi klik di luar elemen tersebut.
  // Digunakan untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  const dropdownRef = useRef(null);

  // Fungsi untuk menutup dropdown saat pengguna mengklik di luar dropdown.
  // Mengecek apakah referensi dropdown saat ini ada dan tidak berisi elemen target dari event klik.
  // Jika benar, fungsi onClick dipanggil untuk menutup dropdown.
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      onClick(); // Close dropdown
    }
  };

  useEffect(() => {
    // Menambahkan event listener untuk mendeteksi klik di luar dropdown
    // ketika dropdown terbuka (isOpen bernilai true).
    // Ini memungkinkan dropdown untuk ditutup jika pengguna mengklik di luar area dropdown.
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Menghapus event listener ketika dropdown ditutup
      document.removeEventListener('mousedown', handleClickOutside);
    }
  
    // Cleanup function untuk menghapus event listener saat komponen di-unmount
    // atau saat `isOpen` berubah, untuk mencegah memory leaks.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Dependensi: useEffect dijalankan ulang ketika nilai isOpen berubah
  

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={onClick}
        className="p-1 text-gray-600 text-xs sm:text-sm"
      >
        &#8942;
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-24 sm:w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <ul>
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                alert('Detail clicked');
              }}
            >
              Detail
            </li>
            {/* // Dalam komponen DropdownMenu */}
            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                onEdit(); // Tambahkan onEdit di props
              }}
            >
              Edit
            </li>

            <li
              className="px-2 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
              onClick={onDelete}
            >
              Hapus
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

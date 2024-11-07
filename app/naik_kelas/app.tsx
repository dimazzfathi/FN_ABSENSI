import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import DataTable from "@/app/components/dataTabel";
import { updateSiswa } from "../api/siswa";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NaikKelas() {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const fetchKelasSiswaTotal = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/joinNonMaster/namaSiswaKelas`
      );
      setKelas(response.data.data);
      console.log("ini siswa", response.data);
    } catch (error) {
      console.error("Fetch error:", error); // Menangani kesalahan
    }
  };
  useEffect(() => {
    fetchKelasSiswaTotal(); // Panggil fungsi fetch saat komponen di-mount
  }, []);
  const tableColumns = [
    { header: "nama", accessor: "nama_siswa" },
    { header: "kelas", accessor: "kelas" },
    // {
    //   header: "Tinggal Kelas",
    //   cell: (row, index) => {
    //     return (
    //       <input
    //         type="checkbox"
    //         checked={row.tinggalKelas}
    //         onChange={() => handleCheckboxChange(index)}
    //         className="form-checkbox h-5 w-5 text-teal-600"
    //       />
    //     );
    //   },
    // },
  ];
  const [dataSiswa, setDataSiswa] = useState([
    { no: 1, nama: "John Doe", kelas: "10", tinggalKelas: false },
    { no: 2, nama: "Jane Doe", kelas: "10", tinggalKelas: false },
    { no: 3, nama: "Adam Smith", kelas: "10", tinggalKelas: false },
    { no: 4, nama: "Sarah Lee", kelas: "10", tinggalKelas: false },
  ]);

  const [dataNaik, setDataNaik] = useState([]);
  const [jumlahLulus, setJumlahLulus] = useState(0);
  const [showLulusNotif, setShowLulusNotif] = useState(false);

  // Filter data berdasarkan kelas yang dipilih
  // const filteredData = kelas
  //   ? siswa.filter((siswa) => siswa.kelas === kelas)
  //   : siswa; // Jika kelas tidak dipilih, tampilkan semua data
  const handleKelasChange = (e) => {
    setKelas(e.target.value);
  };

  const handleCheckboxChange = async (index) => {
    const updatedKelas = kelas.map((siswa, i) =>
      i === index ? { ...siswa, tinggalKelas: !siswa.tinggalKelas } : siswa
    );
    setKelas(updatedKelas);

    try {
      await axios.put(`${baseUrl}/${kelas[index].no}`, {
        tinggalKelas: !kelas[index].tinggalKelas,
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const [kelasNaik, setKelasNaik] = useState([]); // state untuk menyimpan kelas yang sudah naik

  const handleNaik = async () => {
    // Memindahkan kelas yang sudah naik
    const kelasYangNaik = kelas.map((item) => {
      console.log(item); // Periksa data item
      return {
        ...item,
        kelas: (parseInt(item.kelas) + 1).toString(), // naikan kelas
      };
    });

    setKelasNaik(kelasYangNaik); // update state kelas yang naik
    setKelas([]); // kosongkan kelas yang lama, jika perlu

    // Log data yang akan dikirimkan ke backend
    console.log("Data yang dikirimkan untuk update:", kelasYangNaik);

    try {
      for (const siswa of kelasYangNaik) {
        // Pastikan id_siswa dan kelas tidak kosong sebelum mengirim
        if (!siswa.id_siswa || !siswa.kelas) {
          console.error("ID Siswa atau Kelas kosong", siswa);
          continue; // Lewati siswa yang datanya tidak valid
        }

        const editData = {
          id_siswa: siswa.id_siswa,
          nis: siswa.nis,
          kelas: siswa.kelas,
        };

        // Mengupdate kelas siswa di backend
        const response = await updateKelasSiswa(editData);
        console.log("Response dari server:", response);
      }

      console.log("Kelas siswa berhasil diperbarui di backend.");
    } catch (error) {
      console.error("Terjadi kesalahan saat mengupdate kelas siswa:", error);
    }
  };
  const updateKelasSiswa = async (editData) => {
    try {
      const response = await axios.put(
        `${baseUrl}/siswa/edit-siswa/${editData.id_siswa}/${editData.nis}`,
        {
          kelas: editData.kelas, // Pastikan hanya kelas yang diubah
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saat mengupdate kelas siswa:", error.response?.data || error.message);
      throw error; // Melempar error agar bisa ditangani di tempat lain
    }
  };
  

  const handleLulus = () => {
    // Pisahkan siswa yang lulus dan siswa yang tinggal kelas
    const siswaLulus = kelas.filter((siswa) => !siswa.tinggalKelas);
    const siswaTinggalKelas = kelas.filter((siswa) => siswa.tinggalKelas);

    // Set jumlah siswa yang lulus
    setJumlahLulus(siswaLulus.length);

    // Hapus siswa yang lulus dari tabel pertama
    setKelas(siswaTinggalKelas);

    // Tambahkan siswa yang tinggal kelas ke tabel kedua (dataNaik)
    setDataNaik(siswaTinggalKelas);

    // Tampilkan notifikasi lulus
    setShowLulusNotif(true);
  };
  const [filterText, setFilterText] = useState("");
  const [searchName, setSearchName] = useState("");
  const [naikKelas, setNaikKelas] = useState("");
  // Fungsi untuk memfilter data kelas berdasarkan input filter
  // Filter kelas berdasarkan pilihan
  const filteredKelas = Array.isArray(kelas)
    ? kelas
        .filter((siswa) =>
          selectedKelas ? siswa.kelas === selectedKelas : true
        )
        .filter((siswa) =>
          searchName
            ? siswa.nama_siswa.toLowerCase().includes(searchName.toLowerCase())
            : true
        )
        .filter((siswa) => (naikKelas ? siswa.kelas === naikKelas : true))
    : [];

  // console.log(filteredData);

  return (
    <div className="rounded-lg max-w-full p-3 bg-slate-100">
      <div className="pt-7 mb-4 ml-7">
        <h1 className="text-2xl font-bold">Naik Kelas</h1>
        <nav>
          <ol className="flex space-x-2 text-sm text-gray-700">
            <li>
              <a href="index.html" className="text-teal-500 hover:underline">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-500">Naik Kelas</li>
          </ol>
        </nav>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
        {/* Filter Kelas */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            // style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
            className="mt-1 h-11 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="p-2 border rounded mx-2"
          >
            <option value="">Semua Kelas</option>
            {/* Ambil daftar kelas unik untuk opsi dropdown */}
            {Array.isArray(kelas) &&
              [...new Set(kelas.map((siswa) => siswa.kelas))].map(
                (kelasOption) => (
                  <option key={kelasOption} value={kelasOption}>
                    {kelasOption}
                  </option>
                )
              )}
          </select>
          <select
            id="naikKelas"
            value={naikKelas}
            onChange={(e) => setNaikKelas(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Pilih Kelas</option>
            {Array.isArray(kelas) &&
              [...new Set(kelas.map((siswa) => siswa.kelas))].map(
                (kelasOption) => (
                  <option key={kelasOption} value={kelasOption}>
                    {kelasOption}
                  </option>
                )
              )}
          </select>
        </div>
        {/* Container untuk tabel dan tombol */}
        <div className="flex items-start space-x-6">
          {/* Tabel 1 */}
          <div className="w-1/2 bg-slate-600 p-4 rounded-xl">
            <div className="overflow-x-auto">
              {/* <DataTable columns={tableColumns} data={filteredData} /> */}
              <table className="w-full text-left mt-4 border-collapse">
                <thead>
                  <tr className="ml-2">
                    <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">
                      No
                    </th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Nama</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">
                      Kelas
                    </th>
                    <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">
                      Tinggal Kelas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredKelas) &&
                    filteredKelas.map((siswa, index) => (
                      <tr key={siswa.no || index}>
                        <td className="p-3 sm:p-3 text-white border-b">
                          {siswa.no || index + 1}
                        </td>
                        <td className="p-3 sm:p-3 text-white border-b">
                          {siswa.nama_siswa}
                        </td>
                        <td className="p-3 sm:p-3 text-white border-b">
                          {siswa.kelas}
                        </td>
                        <td className="p-3 sm:p-3 text-white text-center border-b">
                          <input
                            type="checkbox"
                            checked={siswa.tinggalKelas}
                            onChange={() => handleCheckboxChange(index)}
                            className="form-checkbox h-5 w-5 text-teal-600"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tombol Naik dan Lulus */}
          <div className="flex flex-col justify-center items-center space-y-4 mt-24">
            <button
              onClick={handleNaik}
              className="bg-teal-500 text-white py-2 px-4 rounded-md w-full"
            >
              Naik
            </button>
            <button
              onClick={handleLulus}
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
            >
              Lulus
            </button>
            {showLulusNotif && (
              <div className="mt-4 bg-green-200 text-green-800 p-4 rounded-md">
                {jumlahLulus} siswa lulus
              </div>
            )}
          </div>

          {/* Tabel 2 */}
          <div className="w-1/2 bg-slate-600 p-4 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left mt-4 border-collapse">
                <thead>
                  <tr className="ml-2">
                    <th className="p-2 sm:p-3 rounded-l-lg bg-slate-500 text-white">
                      No
                    </th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">Nama</th>
                    <th className="p-2 sm:p-3 rounded-r-xl bg-slate-500 text-white">
                      Kelas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kelasNaik.map((item, index) => (
                    <tr key={item.no || index}>
                      <td className="p-3 sm:p-3 text-gray border-b">
                        {index + 1}
                      </td>
                      <td className="p-3 sm:p-3 text-gray border-b">
                        {item.nama_siswa}
                      </td>
                      <td className="p-3 sm:p-3 text-gray border-b">
                        {item.kelas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

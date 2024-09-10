import { useState } from 'react';

export default function NaikKelas() {
  const [kelas, setKelas] = useState('');
  const [dataSiswa, setDataSiswa] = useState([
    { no: 1, nama: 'John Doe', kelas: '10', tinggalKelas: false },
    { no: 2, nama: 'Jane Doe', kelas: '10', tinggalKelas: false },
    { no: 3, nama: 'Adam Smith', kelas: '10', tinggalKelas: false },
    { no: 4, nama: 'Sarah Lee', kelas: '10', tinggalKelas: false },
  ]);

  const [dataNaik, setDataNaik] = useState([]);
  const [jumlahLulus, setJumlahLulus] = useState(0);
  const [showLulusNotif, setShowLulusNotif] = useState(false);

  const handleKelasChange = (e) => {
    setKelas(e.target.value);
  };

  const handleCheckboxChange = (index) => {
    const updatedData = [...dataSiswa];
    updatedData[index].tinggalKelas = !updatedData[index].tinggalKelas;
    setDataSiswa(updatedData);
  };

  const handleNaik = () => {
    const siswaNaik = dataSiswa.map((siswa) => {
      if (!siswa.tinggalKelas) {
        return {
          ...siswa,
          kelas: `${parseInt(siswa.kelas) + 1}`, // Tambah 1 ke kelas jika tidak tinggal kelas
        };
      }
      return siswa; // Tetap pada kelas yang sama jika tinggal kelas
    });

    setDataNaik(siswaNaik);
  };

  const handleLulus = () => {
    // Pisahkan siswa yang lulus dan siswa yang tinggal kelas
    const siswaLulus = dataSiswa.filter((siswa) => !siswa.tinggalKelas);
    const siswaTinggalKelas = dataSiswa.filter((siswa) => siswa.tinggalKelas);
  
    // Set jumlah siswa yang lulus
    setJumlahLulus(siswaLulus.length);
  
    // Hapus siswa yang lulus dari tabel pertama
    setDataSiswa(siswaTinggalKelas);
  
    // Tambahkan siswa yang tinggal kelas ke tabel kedua (dataNaik)
    setDataNaik(siswaTinggalKelas);
  
    // Tampilkan notifikasi lulus
    setShowLulusNotif(true);
  };
  
  

  const filteredData = dataSiswa.filter((siswa) =>
    kelas === '' ? true : siswa.kelas === kelas
  );

  return (
    
    <div className="rounded-lg max-w-full p-3 bg-slate-100">
      <div className="pt-7 mb-4 ml-7">
          <h1 className="text-2xl font-bold">Naik Kelas</h1>
          <nav>
            <ol className="flex space-x-2 text-sm text-gray-700">
              <li>
                <a href="index.html" className="text-teal-500 hover:underline">Home</a>
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
        
        <select
          id="kelas"
          name="kelas"
          value={kelas}
          onChange={handleKelasChange}
          className="mt-1 block w-1/4 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        >
          <option value="">Pilih Kelas</option>
          <option value="10">10</option>
          <option value="11">11</option>
        </select>
      </div>

      {/* Container untuk tabel dan tombol */}
      <div className="flex items-start space-x-6">
        {/* Tabel 1 */}
        <div className="w-1/2 bg-slate-600 p-4 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left mt-4 border-collapse">
            <thead>
              <tr className="ml-2">
                <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>
                <th className="p-2 sm:p-3 bg-slate-500 text-white">Nama</th>
                <th className="p-2 sm:p-3 bg-slate-500 text-white">Kelas</th>
                <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">Tinggal Kelas</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((siswa, index) => (
                <tr key={siswa.no}>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.no}</td>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.nama}</td>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.kelas}</td>
                  <td className="p-3 sm:p-3 text-white border-b">
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
          <button onClick={handleNaik} className="bg-teal-500 text-white py-2 px-4 rounded-md w-full">
            Naik
          </button>
          <button onClick={handleLulus} className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
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
                <th className="p-2 sm:p-3 rounded-l-lg  bg-slate-500 text-white">No</th>
                <th className="p-2 sm:p-3 bg-slate-500 text-white">Nama</th>
                <th className="p-2 sm:p-3 bg-slate-500 rounded-r-xl text-white">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {dataNaik.map((siswa, index) => (
                <tr key={index}>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.no}</td>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.nama}</td>
                  <td className="p-3 sm:p-3 text-white border-b">{siswa.kelas}</td>
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

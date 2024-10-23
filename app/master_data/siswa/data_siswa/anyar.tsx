import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addSiswa } from '../../../api/siswa';

const FormInputSiswa = () => {
  const [idSiswa, setIdSiswa] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [listTahunAjaran, setListTahunAjaran] = useState([]);

  // Mengambil data tahun ajaran dari API
  useEffect(() => {
    const fetchTahunAjaran = async () => {
      try {
        const response = await axios.get('http://localhost:3005/tahun-pelajaran/all-tahun-pelajaran');
        setListTahunAjaran(response.data.data); // Set data tahun ajaran dari API
      } catch (error) {
        console.error('Error fetching tahun ajaran:', error);
      }
    };

    fetchTahunAjaran();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataSiswa = {
      id_siswa: idSiswa,
      nama_siswa: namaSiswa,
      id_tahun_pelajaran: tahunAjaran
    };

    try {
      const response = await addSiswa('http://localhost:3005/siswa/add-siswa', dataSiswa);
      console.log(response.data);
      // Reset form setelah submit
      setIdSiswa('');
      setNamaSiswa('');
      setTahunAjaran('');
    } catch (error) {
      console.error('Error adding siswa:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="id_siswa" className="block text-sm font-medium text-gray-700">ID Siswa</label>
        <input
          type="text"
          id="id_siswa"
          value={idSiswa}
          onChange={(e) => setIdSiswa(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          
        />
      </div>

      <div className="mb-4">
        <label htmlFor="nama_siswa" className="block text-sm font-medium text-gray-700">Nama Siswa</label>
        <input
          type="text"
          id="nama_siswa"
          value={namaSiswa}
          onChange={(e) => setNamaSiswa(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tahun_ajaran" className="block text-sm font-medium text-gray-700">Tahun Ajaran</label>
        <select
          id="tahun_ajaran"
          value={tahunAjaran}
          onChange={(e) => setTahunAjaran(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          
        >
          <option value="">Pilih Tahun Ajaran</option>
          {listTahunAjaran.map((tahun) => (
            <option key={tahun.id_tahun_pelajaran} value={tahun.id_tahun_pelajaran}>
              {tahun.tahun}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default FormInputSiswa;
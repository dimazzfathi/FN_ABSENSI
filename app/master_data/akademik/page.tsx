"use client";
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTahunAjaran } from '../../api/tahunAjaran'; // Import fungsi addTahunAjaran
import DataTable from '../../components/dataTabel';

const AddTahunAjaranForm = () => {
  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    id_tahun_pelajaran: '',
    id_admin: '',
    tahun: '',
    aktif: '',
  });

  useEffect(() => {
    if (isEditMode && currentData) {
      setFormData(currentData);
    }
  }, [currentData, isEditMode]);

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
    if (!formData.aktif) { // Hapus pengecekan untuk status
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
          aktif: '', // Atur ke nilai default
        });
      }
    } catch (error) {
      console.error('Error adding tahun ajaran:', error);
      if (error.response) {
        // Permintaan dibuat dan server merespons dengan status yang tidak 2xx
        toast.error(` ${error.response.data.message || 'data sudah ada'}`);
      } else if (error.request) {
        // Permintaan dibuat tapi tidak ada respons
        toast.error('Tidak ada respons dari server');
      } else {
        // Sesuatu yang lain terjadi saat menyiapkan permintaan
        toast.error('Terjadi kesalahan: ' + error.message);
      }
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tambah Tahun Ajaran</h2>

      <div className="mb-4">
        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">Tahun</label>
        <input
          type="text"
          id="tahun"
          name="tahun"
          value={formData.tahun}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          
        />
      </div>

      <div className="mb-4">
        <label htmlFor="aktif" className="block text-sm font-medium text-gray-700">Aktif</label>
        <select
          id="aktif"
          name="aktif"
          value={formData.aktif}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          
        >
          <option value="">Pilih status</option>
          <option value="yes">Aktif</option>
          <option value="no">Lulus</option>
        </select>
      </div>


      <button 
      type="submit" 
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      // disabled={!formData.tahun || !formData.aktif}
      >
        Tambah Tahun Ajaran
      </button>
    </form>
    <ToastContainer />
    </>
  );
};

export default AddTahunAjaranForm;
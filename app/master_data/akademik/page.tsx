"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addKelas,
  fetchKelas,
  deleteKelas,
  updateKelas,
  Kelas,
} from "../../api/kelas"; // Sesuaikan dengan path fungsi addKelas Anda
import DataTable from "../../components/dataTabel";

const AddKelasForm = () => {
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [editData, setEditData] = useState<Kelas | null>(null); // State untuk data yang akan di-edit

  useEffect(() => {
    const loadKelas = async () => {
      const response = await fetchKelas();
      console.log("API Kelas:", response); // Debugging tambahan
      const data = response.data;
      setKelas(data);
    };
    loadKelas();
  }, []);

  const kelasColumns = [
    // { header: "ID", accessor: (_: any, index: number) => index + 1, },
    { header: "Kelas", accessor: "id_admin" as keyof Admin },
    { header: "jurusan", accessor: "kelas" as keyof Kelas },
    {
      header: "Aksi",
      Cell: ({ row }: { row: Kelas }) => (
        <div>
          <button onClick={() => handleEditClick(row)}>Edit</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
    },
  ];

  const [kelasData, setKelasData] = useState({
    id_admin: "",
    kelas: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKelasData({
      ...kelasData,
      [name]: value,
    });
  };

  const handleKelasSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Pastikan field tidak kosong
    if (!kelasData.kelas || !kelasData.id_admin) {
      toast.error("Data kelas tidak boleh kosong");
      return;
    }

    try {
      const response = await addKelas(kelasData);
      console.log("API response:", response);
      if (response?.data?.exists) {
        toast.error("Kelas sudah ada!");
      } else {
        toast.success("Kelas berhasil ditambahkan!");
        setKelasData({
          id_admin: "",
          kelas: "",
        });
      }
    } catch (error) {
      console.error("Error adding kelas:", error);
      toast.error("Terjadi kesalahan saat menambah kelas");
    }
  };

  // Fungsi untuk handle klik edit
  const handleEditClick = (row: Kelas) => {
    setEditData(row); // Set data yang dipilih ke form edit
  };

  // Handle update data setelah form edit disubmit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      const updatedKelas = await updateKelas(editData.id_kelas, editData);
      setKelas((prev) =>
        prev.map((kelas) =>
          kelas.id_kelas === editData.id_kelas ? updatedKelas.data : kelas
        )
      );
      toast.success("Data berhasil diperbarui!");
      setEditData(null); // Reset form edit setelah sukses
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengedit data");
    }
  };
  // Handle perubahan input pada form edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (deletedRow) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kelas ${
        (deletedRow.id_admin, deletedRow.kelas)
      }?`
    );
    if (confirmed) {
      try {
        // Panggil fungsi delete kelas untuk menghapus di backend
        await deleteKelas(deletedRow.id_kelas);

        // Setelah sukses, update state di frontend
        setKelas((prevKelas) =>
          prevKelas.filter((Kelas) => Kelas.id_kelas !== deletedRow.id_kelas)
        );
        console.log("kelas berhasil dihapus");
      } catch (error) {
        console.error("Error deleting kelas:", error);
        // Anda bisa menambahkan notifikasi atau pesan error di sini
      }
    }
  };

  return (
    <>
      <form onSubmit={handleKelasSubmit}>
        <input
          type="text"
          name="id_admin"
          value={kelasData.id_admin}
          onChange={handleChange}
          placeholder="ID Admin"
          required
        />
        <select
          name="kelas"
          value={kelasData.kelas}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Kelas</option>
          <option value="TKJ">Teknik Komputer Jaringan</option>
          <option value="DKV">Desain Komunikasi Visual</option>
          <option value="BD">Bisnis Digital</option>
          <option value="SIJA">Sistem Informasi Jaringan Aplikasi</option>
          <option value="TSM">Teknik Sepeda Motor</option>
        </select>
        <button type="submit">Tambah Kelas</button>
      </form>
      {/* Form Edit */}
      {editData && (
        <form onSubmit={handleEditSubmit}>
          <h3>Edit Data Kelas</h3>
          <select
            name="kelas"
            value={editData.kelas}
            onChange={handleEditChange}
            required
          >
            <option value="">Pilih Kelas</option>
            <option value="TKJ">Teknik Komputer Jaringan</option>
            <option value="DKV">Desain Komunikasi Visual</option>
            <option value="BD">Bisnis Digital</option>
            <option value="SIJA">Sistem Informasi Jaringan Aplikasi</option>
            <option value="TSM">Teknik Sepeda Motor</option>
          </select>
          <button type="submit">Perbarui Kelas</button>
        </form>
      )}
      <DataTable
        columns={kelasColumns}
        data={kelas}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
    </>
  );
};

export default AddKelasForm;

// "use client";
// import { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { addTahunAjaran } from '../../api/tahunAjaran'; // Import fungsi addTahunAjaran
// import DataTable from '../../components/dataTabel';

// const AddTahunAjaranForm = () => {
//   // State untuk menyimpan data input
//   const [formData, setFormData] = useState({
//     id_tahun_pelajaran: '',
//     id_admin: '',
//     tahun: '',
//     aktif: '',
//   });

//   useEffect(() => {
//     if (isEditMode && currentData) {
//       setFormData(currentData);
//     }
//   }, [currentData, isEditMode]);

//   // Handle perubahan input
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log("Form data:", formData); // Log data yang dikirim

//     // Validasi: Pastikan 'aktif' tidak kosong
//     if (!formData.aktif) { // Hapus pengecekan untuk status
//       toast.error("Data tidak boleh kosong"); // Menampilkan pesan error
//       return; // Tidak melanjutkan jika 'aktif' kosong
//     }

//     try {
//       // Memanggil fungsi untuk menambah data dan mendapatkan respon
//       const response = await addTahunAjaran(formData);
//       console.log("API response:", response)
//       // Misalnya, fungsi addTahunAjaran mengembalikan objek yang berisi informasi tentang keberhasilan
//       if (response?.data?.exists) { // Gantilah dengan logika yang sesuai
//         toast.error("Data sudah ada!"); // Menampilkan pesan jika data sudah ada
//       } else {
//         toast.success("Tahun ajaran berhasil ditambahkan!"); // Menampilkan pesan sukses
//         // Reset form setelah submit
//         setFormData({
//           id_tahun_pelajaran: '',
//           id_admin: '',
//           tahun: '',
//           aktif: '', // Atur ke nilai default
//         });
//       }
//     } catch (error) {
//       console.error('Error adding tahun ajaran:', error);
//       if (error.response) {
//         // Permintaan dibuat dan server merespons dengan status yang tidak 2xx
//         toast.error(` ${error.response.data.message || 'data sudah ada'}`);
//       } else if (error.request) {
//         // Permintaan dibuat tapi tidak ada respons
//         toast.error('Tidak ada respons dari server');
//       } else {
//         // Sesuatu yang lain terjadi saat menyiapkan permintaan
//         toast.error('Terjadi kesalahan: ' + error.message);
//       }
//     }
//   };

//   return (
//     <>
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">Tambah Tahun Ajaran</h2>

//       <div className="mb-4">
//         <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">Tahun</label>
//         <input
//           type="text"
//           id="tahun"
//           name="tahun"
//           value={formData.tahun}
//           onChange={handleChange}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"

//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="aktif" className="block text-sm font-medium text-gray-700">Aktif</label>
//         <select
//           id="aktif"
//           name="aktif"
//           value={formData.aktif}
//           onChange={handleChange}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"

//         >
//           <option value="">Pilih status</option>
//           <option value="yes">Aktif</option>
//           <option value="no">Lulus</option>
//         </select>
//       </div>

//       <button
//       type="submit"
//       className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//       // disabled={!formData.tahun || !formData.aktif}
//       >
//         Tambah Tahun Ajaran
//       </button>
//     </form>
//     <ToastContainer />
//     </>
//   );
// };

// export default AddTahunAjaranForm;

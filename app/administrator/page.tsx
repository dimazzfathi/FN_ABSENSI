"use client";
import { useEffect, useState } from "react";
import { fetchAdmins, addAdmins, updateAdmins, deleteAdmins, Admin } from "../api/admin";
import DataTable from "../components/dataTabel";
import { toast } from "react-toastify";
import axios from "axios";

const AdminPage = () => {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [formData, setFormData] = useState({
    id_admin: "",
    nama_admin: "",
    alamat: "",
    jenis_kelamin: "",
    no_telp: "",
    email: "",
    username: "",
    pass: "",
    foto: null as File | null,
    status: "aktif", // Default status
  });

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
    // { header: "ID", accessor: "id_admin" as keyof Admin },
    { header: "Nama", accessor: "nama_admin" as keyof Admin },
    { header: "Alamat", accessor: "alamat" as keyof Admin },
    { header: "Jk", accessor: "jenis_kelamin" as keyof Admin },
    { header: "No Tlpn", accessor: "no_telp" as keyof Admin },
    { header: "Email", accessor: "email" as keyof Admin },
    // { header: 'Username', accessor: 'username' as keyof Admin },
    // { header: 'Password', accessor: 'pass' as keyof Admin },
    { header: "Foto", accessor: "foto" as keyof Admin },
    { header: "Status", accessor: "status" as keyof Admin },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData({
        ...formData,
        [name]: file,
      });

      // Preview file jika ada
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFotoPreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi jika ada input yang kosong
    if (
      !formData.nama_admin ||
      !formData.alamat ||
      !formData.jenis_kelamin ||
      !formData.no_telp ||
      !formData.email ||
      !formData.username ||
      !formData.pass ||
      !formData.foto ||
      !formData.status
    ) {
      toast.error("Data tidak boleh kosong");
      return;
    }

    try {
      const response = await addAdmins(formData); // Sesuaikan dengan fungsi API yang sesuai
      console.log("API response:", response);
      if (response?.exists) {
        toast.error("Data sudah ada!");
      } else {
        toast.success("Admin berhasil ditambahkan!");
        setFormData({
          id_admin: "",
          nama_admin: "",
          alamat: "",
          jenis_kelamin: "",
          no_telp: "",
          email: "",
          username: "",
          pass: "",
          foto: null,
          status: "",
        });
        setFotoPreview(null);
      }
    } catch (error) {
      console.error("Error adding admin:", error);

      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response);
        if (error.response) {
          // Tampilkan pesan error spesifik dari server jika ada
          const errorMessage =
            error.response.data.message || "Terjadi kesalahan pada server";
          toast.error(`Error: ${error.response.status} - ${errorMessage}`);
        } else {
          toast.error(
            "Tidak dapat terhubung ke server. Periksa koneksi Anda atau coba lagi nanti."
          );
        }
      } else {
        toast.error("Terjadi kesalahan saat menambah data");
      }
    }
  };

  // Fungsi untuk menangani edit
  const handleEdit = async (updatedRow: Admin) => {
  try {
    // Pastikan updatedRow memiliki id_siswa dan nis
    if (!updatedRow.id_admin) {
      throw new Error('ID Admin tidak ditemukan');
    }

    // Update state di frontend
    setAdmins((prevAdmin) =>
      prevAdmin.map((admin) =>
        admin.id_admin === updatedRow.id_admin ? updatedRow : admin
      )
    );
    // Kirim request ke backend dengan id dan nis yang benar
    const updatedSiswa = await updateAdmins(updatedRow.id_admin, updatedRow);
    toast.success('Data siswa berhasil diperbarui!');
  } catch (error) {
    // Tampilkan lebih banyak detail error dari response server
    console.error('Gagal memperbarui data di backend:', error.response?.data || error.message);
    toast.error(`Gagal memperbarui data: ${error.response?.data?.message || error.message}`);
  }
  };

  const handleDelete = async (deletedRow) => {
  const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus siswa ${deletedRow.nama_admin}?`);
  if (confirmed) {
      try {
          // Panggil fungsi deleteTahunAjaran untuk menghapus di backend
          await deleteAdmins(deletedRow.id_admin);

          // Setelah sukses, update state di frontend
          setAdmins((prevAdmin) =>
              prevAdmin.filter((admin) => admin.id_admin !== deletedRow.id_admin)
          );
          
          toast.success(' admin berhasil dihapus');
      } catch (error) {
          console.error('Error deleting admin:', error);
          // Anda bisa menambahkan notifikasi atau pesan error di sini
      }
  }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Tambah Admin</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nama:</label>
          <input
            type="text"
            name="nama_admin"
            value={formData.nama_admin}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Alamat:</label>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Jenis Kelamin:</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">No Telepon:</label>
          <input
            type="tel"
            name="no_telp"
            value={formData.no_telp}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="pass"
            value={formData.pass}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Foto:</label>
          <input
            type="file"
            name="foto"
            onChange={handleChange}
            className="border rounded w-full p-2"
            accept="image/*"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Pilih Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Tambah Admin
        </button>
      </form>
      <h1>Data Admin</h1>
      <DataTable
        columns={adminColumns}
        data={admins}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPage;

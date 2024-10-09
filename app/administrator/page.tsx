"use client";
import { useEffect, useState } from 'react';
import { fetchAdmins, addAdmins, Admin } from '../api/admin';
import DataTable from '../components/dataTabel';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [formData, setFormData] = useState({
    nama_admin: '',
    alamat: '',
    jenis_kelamin: '',
    no_telp: '',
    email: '',
    username: '',
    pass: '',
    foto: null,
    status: 'aktif', // Default status
  });

  useEffect(() => {
    const loadAdmins = async () => {
      const response = await fetchAdmins();
      console.log('API response:', response); // Debugging tambahan
      const data = response.data; 
      setAdmins(data);
    };
    loadAdmins();
  }, []);

  const adminColumns = [
    { header: 'ID', accessor: 'id_admin' as keyof Admin },
    { header: 'Nama', accessor: 'nama_admin' as keyof Admin },
    { header: 'Alamat', accessor: 'alamat' as keyof Admin },
    { header: 'Jk', accessor: 'jenis_kelamin' as keyof Admin },
    { header: 'No Tlpn', accessor: 'no_telp' as keyof Admin },
    { header: 'Email', accessor: 'email' as keyof Admin },
    { header: 'Username', accessor: 'username' as keyof Admin },
    { header: 'Password', accessor: 'pass' as keyof Admin },
    { header: 'Foto', accessor: 'foto' as keyof Admin },
    { header: 'Status', accessor: 'status' as keyof Admin },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama_admin || !formData.alamat || !formData.jenis_kelamin || 
        !formData.no_telp || !formData.email || !formData.username || 
        !formData.pass) {
      toast.error("Data tidak boleh kosong");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await addAdmins(formDataToSend);
      console.log("API response:", response);

      // Tambahkan data baru ke dalam admins
      setAdmins((prevAdmins) => [...prevAdmins, response.data]); // Sesuaikan dengan data yang dikembalikan

      toast.success("Admin berhasil ditambahkan!");

      // Reset form setelah submit
      setFormData({
        nama_admin: '',
        alamat: '',
        jenis_kelamin: '',
        no_telp: '',
        email: '',
        username: '',
        pass: '',
        foto: null,
        status: 'aktif',
      });
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error("Terjadi kesalahan saat menambahkan admin");
    }
  };

  return (
    <div>
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
          onChange={handleFileChange}
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

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Tambah Admin
        </button>
      </form>
      <h1>Data Admin</h1>
      <DataTable 
        columns={adminColumns} 
        data={admins} 
        // onEdit={handleEdit} 
        // onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPage;

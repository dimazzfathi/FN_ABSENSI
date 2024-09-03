"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type Admin = {
  id: number;
  nama: string;
  email: string;
  // Tambahkan properti lain yang sesuai dengan struktur data di tabel 'admin'
};

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token'); // atau dari cookies
    
    if (!token) {
      // Jika token tidak ada, redirect ke halaman login
      router.push('../../administrator/login');
      return;
    }

    // Menambahkan token ke header axios tanpa Bearer
    axios.defaults.headers.common['Authorization'] = token;

    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${baseUrl}/admin/all-Admin`);
        const data: Admin[] = res.data;
        setAdmins(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAdmins();
  }, [router]);

  return (
    <div>
      <h1>Admin List</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id_admin}>
            <ol>{admin.nama_admin}</ol>
            <ol>{admin.alamat}</ol>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;

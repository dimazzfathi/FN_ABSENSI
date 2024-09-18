"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { UserIcon, UserGroupIcon, IdentificationIcon } from '@heroicons/react/24/outline'

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
  if (!token) {
    router.push('../login');
    return;
  }

  axios.defaults.headers.common['Authorization'] = token;

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/all-Admin`);
      const data: Admin[] = res.data;
      setAdmins(data);
    } catch (eror) {
      console.error('Error:', error);
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 px-6">
        <div className="rounded-lg border border-stroke bg-blue-500 px-7.5 px-2 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 rounded-full bg-meta-2 dark:bg-meta-4">
            <UserIcon className="h-8 w-8 text-gray-700" />
            </div>
            <div className="mt-4 flex items-end justify-between">
                <div>
                    <span className="text-sm font-medium">Total Siswa</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-meta-3 undefined ">0</span>
            </div>
        </div>
        <div className="rounded-lg border border-stroke bg-green-500 px-7.5 px-2 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 rounded-full bg-meta-2 dark:bg-meta-4">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <span className="text-sm font-medium">Total Rombel</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-meta-3 undefined ">1</span>
                </div>
        </div>
        <div className="rounded-lg border border-stroke bg-orange-500 px-7.5 px-2 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 rounded-full bg-meta-2 dark:bg-meta-4">
            <IdentificationIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-end justify-between">
                <div>
                    <span className="text-sm font-medium">Total Staff</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-meta-3 undefined ">2</span>
            </div>
        </div>
        </div>
        <div className="flex flex-col lg:flex-row">
        {/* Column 1: Input */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6">
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border overflow-x-auto">
                <table className="min-w-full bg-white ">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">NO</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">KELAS</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">JUMLAH</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">H</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">S</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">I</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">A</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">T</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 tracking-wider">WALAS</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                    </tr>
                    {/* Tambahkan baris lain sesuai kebutuhan */}
                    </tbody>
                </table>
                </div>
            </div>
        {/* Column 2: Table */}
            <div className="w-full  lg:w-1/2 p-4 lg:p-6">
                <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border">
                    <div className="bg-slate-600 p-2 rounded-xl">
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">NO</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">Foto</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">Nama</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">Kelas</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-white tracking-wider">Wa Ortu</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                            <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                            <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                            <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                            <td className="px-6 py-4 border-b border-gray-300 text-sm"></td>
                        </tr>
                        {/* Tambahkan baris lain sesuai kebutuhan */}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>  
    </div>
    
  )
};

export default AdminPage;

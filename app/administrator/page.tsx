"use client";
import { useEffect, useState } from 'react';
import { fetchAdmins, Admin } from '../api/admin';
import DataTable from '../components/dataTabel';

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const loadAdmins = async () => {
      const data = await fetchAdmins();
      setAdmins(data);
    };
    loadAdmins();
  }, []);

  const adminColumns = [
    { header: 'ID', accessor: 'id_admin' as keyof Admin },
    { header: 'Nama', accessor: 'nama_admin' as keyof Admin },
    { header: 'Email', accessor: 'email' as keyof Admin },
  ];

  return (
    <div>
      <h1>Data Admin</h1>
      <DataTable columns={adminColumns} data={admins} />
    </div>
  );
};

export default AdminPage;

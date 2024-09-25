"use client";
import { useEffect, useState } from 'react';
import { fetchAdmins, Admin } from '../api/admin';

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (error) {
        setError('Failed to load admins');
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin List</h1>
      <ul>
      {admins.map((admin, index) => (
        <li key={admin.id_admin || index}>{admin.nama_admin} ({admin.email})</li>
      ))}
      </ul>
    </div>
  );
};

export default AdminPage;

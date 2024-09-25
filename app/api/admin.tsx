import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Admin = {
  id_admin: number;
  nama_admin: string;
  email: string;
  // Tambahkan properti lain yang sesuai dengan struktur data di tabel 'admin'
};

// Fungsi untuk mengambil daftar admin
export const fetchAdmins = async (): Promise<Admin[]> => {
  try {
    const res = await axios.get(`${baseUrl}/admin/all-Admin`);
    console.log(res)
    return res.data as Admin[];
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};
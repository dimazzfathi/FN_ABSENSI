import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Admin = {
  id_admin: number;
  nama_admin: string;
  email: string;
  alamat: string;
  jenis_kelamin: string;
  no_tlpn: number;
  username: string;
  password: string;
  status: string;
  // Tambahkan properti lain yang sesuai dengan struktur data di tabel 'admin'
};

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

// Fungsi untuk menambah Admins
export const addAdmins = async (AdminsData: Admin) => {
  try {
    const response = await axios.post(`${baseUrl}/admin/add-Admin`, AdminsData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Data sudah ada:', error);
    throw error;
  }
};

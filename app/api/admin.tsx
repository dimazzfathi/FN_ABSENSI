import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Admin = {
<<<<<<< HEAD
  id: number;
  nama: string;
  email: string;
  // Tambahkan properti lain yang sesuai dengan struktur data di tabel 'admin'
};

// Fungsi untuk mengambil daftar admin
export const fetchAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await axios.get(`${baseUrl}/admin/all-Admin`);
    return response.data as Admin[];
=======
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
>>>>>>> c76ac05fe73fa5d3ce749a14342bbb180eec9e1c
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};
<<<<<<< HEAD

// Fungsi untuk menambah admin baru
export const addAdmin = async (adminData: Admin) => {
  try {
    const response = await axios.post(`${baseUrl}/admin/addAmin`, adminData);
    return response.data;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};
=======
>>>>>>> c76ac05fe73fa5d3ce749a14342bbb180eec9e1c

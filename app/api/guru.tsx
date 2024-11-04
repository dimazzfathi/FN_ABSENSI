import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Guru = {
  id_guru: string;
  id_admin: string;
  nip: string;
  nama_guru: string;
  jenis_kelamin: string;
  id_mapel: string;
  email: string;
  pass: string;
  foto: string;
  walas: string;
  barcode: string;
  id_kelas: string[];
  rombel: string;
  no_telp: string;
  // Tambahkan properti lain yang sesuai dengan struktur data di tabel 'admin'
};

export const fetchGuru = async (): Promise<Guru[]> => {
    try {
      const res = await axios.get(`${baseUrl}/guru/all-guru`);
      
      console.log(res)
      return res.data as Guru[];
    } catch (error) {
      console.error('Error fetching guru:', error);
      throw error;
    }
  };

// Fungsi untuk menambah guru
export const addGuru = async (guruData: Guru): Promise<Guru> => {
    try {
      const response = await axios.post(`${baseUrl}/guru/add-guru`, guruData);
      console.log(response);
      return response.data as Guru;
    } catch (error) {
      console.error('Error saat menambah guru:', error);
      throw error;
    }
  };

export const updateGuru = async (id: string, nip: string, guruData: Guru): Promise<Guru> => {
try {
    const res = await axios.put(`${baseUrl}/guru/edit-guru/${id}/${nip}`, guruData);
      
    console.log(res);
    return res.data as Guru; // Mengembalikan data Guru yang telah diperbarui
} catch (error) {
    console.error('Error editing Guru:', error);
    throw error; // Melempar kembali error agar bisa ditangani di tempat lain
}
};

// Fungsi untuk menghapus guru
export const deleteGuru = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/guru/hapus-guru/${id}`);
        console.log('Data guru berhasil dihapus');
    } catch (error) {
        console.error('Error deleting guru:', error);
        throw error;
    }
  };
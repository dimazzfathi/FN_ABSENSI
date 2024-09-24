import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Siswa = {
  id: number;
  nama: string;
  kelas: string;
};

export const fetchSiswa = async (): Promise<Siswa[]> => {
  try {
    const response = await axios.get(`${baseUrl}/siswa/all`);
    console.log(response)
    return response.data as Siswa[];
  } catch (error) {
    console.error('Error fetching siswa:', error);
    throw error;
  }
};

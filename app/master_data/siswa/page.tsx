"use client";
import { useEffect, useState } from "react";
import { fetchSiswa, Siswa } from "../../api/siswa";
import DataTable from "../../components/dataTabel";

const SiswaPage = () => {
  const [siswa, setSiswa] = useState<Siswa[]>([]);

  useEffect(() => {
    const loadSiswa = async () => {
      const data = await fetchSiswa();
      setSiswa(data);
    };
    loadSiswa();
  }, []);

  const siswaColumns = [
    { header: "ID", accessor: "id_siswa" as keyof Siswa },
    { header: "Nama", accessor: "nama_siswa" as keyof Siswa },
    { header: "Kelas", accessor: "id_kelas" as keyof Siswa },
  ];

  const handleEdit = (updatedRow) => {
    setSiswa((prevSiswa) =>
      prevSiswa.map(
        (siswa) => (siswa.id === updatedRow.id ? updatedRow : siswa) // Update data yang sesuai
      )
    );
  };

  const handleDelete = (deletedRow) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${deletedRow.name}?`
    );
    if (confirmed) {
      setSiswa(
        (prevAdmins) => prevAdmins.filter((siswa) => siswa.id !== deletedRow.id) // Hapus data yang sesuai
      );
    }
  };

  return (
    <div>
      <h1>Data Siswa</h1>
      <DataTable
        columns={siswaColumns}
        data={siswa}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SiswaPage;

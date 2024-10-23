"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addMapel,
  fetchMapel,
  editMapel,
  deleteMapel,
  Mapel,
} from "../../api/mapel"; // Sesuaikan dengan path fungsi addMapel Anda
import DataTable from "../../components/dataTabel";

const AddMapelForm = () => {
  const [mapel, setMapel] = useState<Mapel[]>([]);

  useEffect(() => {
    const loadMapel = async () => {
      const response = await fetchMapel();
      console.log("API Mapel:", response); // Debugging tambahan
      const data = response.data;
      setMapel(data);
    };
    loadMapel();
  }, []);

  const mapelColumns = [
    // { header: "ID Admin", accessor: "id_admin" as keyof Mapel },
    { header: "Mapel", accessor: "nama_mapel" as keyof Mapel },
  ];

  const [mapelData, setMapelData] = useState({
    id_admin: "",
    nama_mapel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMapelData({
      ...mapelData,
      [name]: value,
    });
  };

  const handleMapelSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Pastikan field tidak kosong
    if (!mapelData.nama_mapel) {
      toast.error("Data mapel tidak boleh kosong");
      return;
    }

    try {
      const response = await addMapel(mapelData);
      console.log("API response:", response);
      if (response?.data?.exists) {
        toast.error("Mapel sudah ada!");
      } else {
        toast.success("Mapel berhasil ditambahkan!");
        setMapelData({
          id_admin: "",
          nama_mapel: "",
        });
      }
    } catch (error) {
      console.error("Error adding mapel:", error);
      toast.error("Terjadi kesalahan saat menambah mapel");
    }
  };

  const handleEdit = async (updatedRow) => {
    try {
      // Pastikan updatedRow memiliki id_mapel
      if (!updatedRow.id_mapel) {
        throw new Error("ID Mapel tidak ditemukan");
      }

      // Update state di frontend
      setMapel((prevMapel) =>
        prevMapel.map((item) =>
          item.id_mapel === updatedRow.id_mapel ? updatedRow : item
        )
      );

      // Kirim request ke backend dengan id yang benar
      const updateMapel = await editMapel(updatedRow.id_mapel, updatedRow);
      toast.success("Data berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal memperbarui data di backend:", error);
      toast.error(`Gagal memperbarui data: ${error.message}`);
    }
  };

  const handleDelete = async (deletedRow: any) => {
    try {
      // Panggil fungsi delete Mapel untuk menghapus di backend
      await deleteMapel(deletedRow.id_mapel);
  
      // Setelah sukses, update state di frontend
      setMapel((prevMapel) =>
        prevMapel.filter((mapel) => mapel.id_mapel !== deletedRow.id_mapel)
      );
      toast.success(`Mapel ${deletedRow.nama_mapel} berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting Mapel:', error);
      toast.error('Gagal menghapus Mapel');
    }
  };

  return (
    <>
      <form onSubmit={handleMapelSubmit}>
        {/* <input
          type="text"
          name="id_admin"
          value={mapelData.id_admin}
          onChange={handleChange}
          placeholder="ID Admin"
          required
        /> */}
        <input
          type="text"
          name="nama_mapel"
          value={mapelData.nama_mapel}
          onChange={handleChange}
          placeholder="Nama Mapel"
          required
        />
        <button type="submit">Tambah Mapel</button>
      </form>
      <DataTable
        columns={mapelColumns}
        data={mapel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default AddMapelForm;

// TableTahunAjaran.js
"use client";
import React, { useState, useEffect, useRef } from 'react';
import TableUI from './TableUI';

const TableTahunAjaran = () => {
  const [statusValue, setStatusValue] = useState("");
  const [thnValue, setThnValue] = useState("");
  const [isResettable, setIsResettable] = useState(false);
  const [errors, setErrors] = useState({ thn: false, status: false });
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterThn, setFilterThn] = useState("");

  const thnInputRef = useRef(null);
  const statusSelectRef = useRef(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableTahunAjaran")) || [];
    setTableData(savedData);
    if (filterStatus || filterThn || searchTerm) {
      setIsResettable(true);
    } else {
      setIsResettable(false);
    }
  }, [filterStatus, filterThn, searchTerm]);

  const handleResetClick = () => {
    if (isResettable) {
      setFilterStatus('');
      setFilterThn('');
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableTahunAjaran")) || [];
    setTableData(savedData);
  }, []);

  const handleSaveClick = () => {
    let hasErrors = false;
    if (!thnValue) {
      if (thnInputRef.current) {
        thnInputRef.current.classList.add('border-red-500');
        thnInputRef.current.focus();
      }
      hasErrors = true;
    } else {
      if (thnInputRef.current) {
        thnInputRef.current.classList.remove('border-red-500');
      }
    }
    if (!statusValue) {
      if (statusSelectRef.current) {
        statusSelectRef.current.classList.add('border-red-500');
        if (!hasErrors) statusSelectRef.current.focus();
      }
      hasErrors = true;
    } else {
      if (statusSelectRef.current) {
        statusSelectRef.current.classList.remove('border-red-500');
      }
    }
    if (hasErrors) return;

    const newData = [
      ...tableData,
      {
        no: tableData.length > 0 ? Math.max(...tableData.map(item => item.no)) + 1 : 1,
        thn: thnValue,
        status: statusValue,
      },
    ];

    setTableData(newData);
    localStorage.setItem("tableTahunAjaran", JSON.stringify(newData));
    setStatusValue("");
    setThnValue("");
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setStatusValue(item.status);
    setThnValue(item.jurusan);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = tableData.map((item) =>
      item.no === editData.no
        ? { ...item, thn: thnValue, status: statusValue }
        : item
    );
    setTableData(updatedData);
    localStorage.setItem("tableTahunAjaran", JSON.stringify(updatedData));
    setShowEditModal(false);
    setThnValue("");
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete({ visible: true, id });
    setOpenDropdown(null);
  };

  const handleConfirmDelete = () => {
    const filteredData = tableData.filter(
      (item) => item.no !== confirmDelete.id
    );
    const updatedData = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
    setTableData(updatedData);
    localStorage.setItem("tableTahunAjaran", JSON.stringify(updatedData));
    setConfirmDelete({ visible: false, id: null });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleThnChange = (e) => {
    setThnValue(e.target.value);
  };
  
  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };
  

  const filteredData = tableData.filter(item => {
    const searchLowerCase = searchTerm.toLowerCase();
    return (
      (filterStatus ? item.status === filterStatus : true) &&
      (filterThn ? item.thn === filterThn : true) &&
      (searchTerm ? item.status.toLowerCase().includes(searchLowerCase) : true)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions = ["Aktif", "Lulus"];

  return (
    <TableUI
      data={currentData}
      totalPages={totalPages}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      handleSaveClick={handleSaveClick}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
      handleConfirmDelete={handleConfirmDelete}
      handleItemsPerPageChange={handleItemsPerPageChange}
      statusValue={statusValue}
      thnValue={thnValue}
      handleSearchChange={handleSearchChange}
      searchTerm={searchTerm}
      handleResetClick={handleResetClick}
      handleThnChange={handleThnChange}
      handleStatusChange={handleStatusChange}
    />
  );
};

export default TableTahunAjaran;

import React, { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../components/dataTabel";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa"; // Menggunakan icon dari react-icons
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Pastikan ini diimpor

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Filters = () => {
  // const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [tableHeaders, setTableHeaders] = useState({
    headers: [],
    todayDate: null,
  });
  const [isPulangPagiOpen, setIsPulangPagiOpen] = useState(false);
  const [startTime, setStartTime] = useState("07:30");
  const [endTime, setEndTime] = useState("08:00");
  const [activeDay, setActiveDay] = useState(null);
  const [inactiveDays, setInactiveDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    console.log(today);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const currentMonthYear = `${
      monthNames[today.getMonth()]
    } ${today.getFullYear()}`;
    setSelectedMonthYear(currentMonthYear);

    const currentDay = today.getDate();
    setActiveDay(currentDay);
    // Set inactive days as the days before the current day
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const inactiveDays = Array.from(
      { length: Math.min(currentDay - 1, 3) },
      (_, i) => i + 1
    );
    setInactiveDays(inactiveDays);

    generateTableHeaders(
      today.getMonth(),
      today.getFullYear(),
      today.getDate()
    );
  }, []);

  // const handleMonthYearChange1 = (e) => {
  //   const [selectedMonth, selectedYear] = e.target.value.split(" ");
  //   const monthIndex = monthYearOptions.findIndex(
  //     (option) => option.month === selectedMonth
  //   );
  //   setSelectedMonthYear(e.target.value);
  //   generateTableHeaders(monthIndex, parseInt(selectedYear));
  // };

  const handleKelasChange = (e) => {
    setSelectedKelas(e.target.value);
  };

  // const monthYearOptions = getMonthYearOptions();

  const generateTableHeaders = (monthIndex, year, todayDate = null) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const headers = [];
    for (let i = 1; i <= daysInMonth; i++) {
      headers.push(i);
    }
    setTableHeaders({ headers, todayDate });
  };

  const handlePulangPagiClick = () => {
    setIsPulangPagiOpen(true);
  };

  const handlePulangPagiClose = () => {
    setIsPulangPagiOpen(false);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const savePulangPagiTime = () => {
    // Simpan waktu pulang pagi sesuai logika bisnismu
    setIsPulangPagiOpen(false);
  };

  // List of jurusan options
  const kelasOptions = [
    "10 TKJ",
    "10 TSM",
    "10 BD",
    "10 DKV",
    "11 TKJ 1",
    "11 TKJ 2",
    "11 BD",
    "11 DKV",
    "12 TKJ",
    "12 BD 1",
    "12 BD 2",
    "12 DKV",
  ];

  // Example students data with attendance for current date
  const students = [
    {
      id: 1,
      name: "Dimaz Fathi Fikri",
      attendance: { 1: "H", 2: "H", 3: "I", 4: "A", 5: "H", 6: "H" },
      phoneNumber: "+6283897650528",
    },
    {
      id: 2,
      name: "Bima Suluk Wibisono",
      attendance: { 1: "H", 2: "I", 3: "H", 4: "H", 5: "H", 6: "A" },
      phoneNumber: "+6285895459230",
    },
    {
      id: 3,
      name: "Anggra Meisya Nur Isnaini",
      attendance: { 1: "H", 2: "H", 3: "H", 4: "S", 5: "H", 6: "T" },
      phoneNumber: "+6283851799450",
    },
    {
      id: 4,
      name: "Abdul Rohman",
      attendance: { 1: "A", 2: "H", 3: "S", 4: "H", 5: "H", 6: "I" },
      phoneNumber: "+6288991755499",
    },
    {
      id: 5,
      name: "Ali Musitofa",
      attendance: { 1: "H", 2: "H", 3: "H", 4: "I", 5: "T", 6: "H" },
      phoneNumber: "+6281259356633",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "H":
        return "bg-green-500 text-white";
      case "I":
        return "bg-orange-500 text-white";
      case "A":
        return "bg-red-500 text-white";
      case "S":
        return "bg-sky-500 text-white";
      case "T":
        return "bg-gray-500 text-white";
      default:
        return "";
    }
  };

  const getAttendanceStatus = (student, day) => {
    return student.attendance[day] || "-";
  };
  const handlePrint = () => {
    window.print();
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Menambahkan judul pada PDF
    doc.text("Laporan Absensi Siswa", 14, 10);

    // Menyiapkan data tabel
    const tableColumn = [
      "No",
      "Nama Siswa",
      ...datesArray.map((date) => `${date}`),
      "Hadir",
      "Alpha",
      "Sakit",
      "Izin",
      "Terlambat",
      "Nomor Wali",
    ];

    const tableRows = filteredSiswaData.map((item, index) => {
      const rowData = [
        index + 1, // Nomor urut
        item.nama_siswa, // Nama siswa
        ...datesArray.map((date) => {
          return item.absensi && item.absensi[date]
            ? item.absensi[date] === "H"
              ? "Hadir"
              : item.absensi[date] === "A"
              ? "Alpha"
              : item.absensi[date] === "S"
              ? "Sakit"
              : item.absensi[date] === "I"
              ? "Izin"
              : item.absensi[date] === "T"
              ? "Terlambat"
              : "-"
            : "-";
        }),
        item.absensi && item.absensi["H"] ? item.absensi["H"] : "-",
        item.absensi && item.absensi["A"] ? item.absensi["A"] : "-",
        item.absensi && item.absensi["S"] ? item.absensi["S"] : "-",
        item.absensi && item.absensi["I"] ? item.absensi["I"] : "-",
        item.absensi && item.absensi["T"] ? item.absensi["T"] : "-",
        item.nomor_wali, // Nomor Wali
      ];
      return rowData;
    });

    // Menambahkan tabel ke dalam PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Menyesuaikan posisi vertikal awal tabel
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Gaya header tabel
      styles: { cellPadding: 3, fontSize: 10 }, // Gaya sel tabel
    });

    // Mengekspor file PDF
    doc.save("Absensi_Siswa.pdf");
  };
  const handleExportExcel = () => {
    // Membuat worksheet dari data siswa
    const wsData = filteredSiswaData.map((item, index) => {
      const rowData = [
        index + 1, // Nomor urut
        item.nama_siswa, // Nama Siswa
        ...datesArray.map((date) => {
          return item.absensi && item.absensi[date]
            ? item.absensi[date] === "H"
              ? "Hadir"
              : item.absensi[date] === "A"
              ? "Alpha"
              : item.absensi[date] === "S"
              ? "Sakit"
              : item.absensi[date] === "I"
              ? "Izin"
              : item.absensi[date] === "T"
              ? "Terlambat"
              : "-"
            : "-";
        }),
        item.absensi && item.absensi["H"] ? item.absensi["H"] : "-",
        item.absensi && item.absensi["A"] ? item.absensi["A"] : "-",
        item.absensi && item.absensi["S"] ? item.absensi["S"] : "-",
        item.absensi && item.absensi["I"] ? item.absensi["I"] : "-",
        item.absensi && item.absensi["T"] ? item.absensi["T"] : "-",
        item.nomor_wali, // Nomor Wali
      ];
      return rowData;
    });

    // Membuat worksheet dan workbook
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "No", // Header kolom pertama
        "Nama Siswa", // Header kolom kedua
        ...datesArray.map((date) => `${date}`), // Header untuk tanggal
        "Hadir", // Jumlah hadir
        "Alpha", // Jumlah alpha
        "Sakit", // Jumlah sakit
        "Izin", // Jumlah izin
        "Terlambat", // Jumlah terlambat
        "Nomor Wali", // Nomor Wali
      ],
      ...wsData, // Data siswa
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absensi Siswa");

    // Mengekspor file Excel
    XLSX.writeFile(wb, "Absensi_Siswa.xlsx");
  };
  const handleExportJPG = () => {
    // Logika untuk ekspor JPG
  };
  const [siswaData, setSiswaData] = useState([]);
  //   const headers = Object.keys(siswaData[0]);
  const fetchNamaKelas = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/joinNonMaster/nama-siswa-kelas`
      );
      setSiswaData(response.data.data); // Menyimpan data ke state kelas
      console.log("total", response.data);
    } catch (error) {
      console.error("Fetch error:", error); // Menangani kesalahan
    }
  };
  useEffect(() => {
    fetchNamaKelas(); // Panggil fungsi fetch saat komponen di-mount
  }, []);
  // Mendapatkan tanggal sekarang
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Membuat array bulan dan tahun
  const monthsArray = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Menyusun opsi bulan untuk tahun sekarang
  const monthYearOptions = monthsArray.map((month, index) => ({
    label: `${month} ${currentYear}`,
    value: `${currentYear}-${index + 1}`, // Format nilai: "YYYY-MM"
  }));

  // State untuk menyimpan bulan dan tahun yang dipilih
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    `${currentYear}-${currentMonth}`
  );

  // Mendapatkan bulan dan tahun dari pilihan
  const [selectedYear, selectedMonth] = selectedMonthYear
    .split("-")
    .map(Number);

  // Membuat array tanggal sesuai bulan dan tahun yang dipilih
  const datesArray = Array.from(
    {
      length:
        selectedYear === currentYear && selectedMonth === currentMonth
          ? currentDay // Hanya hingga tanggal hari ini untuk bulan & tahun saat ini
          : new Date(selectedYear, selectedMonth, 0).getDate(), // Semua tanggal untuk bulan lainnya
    },
    (_, i) => i + 1
  );
  // Filter siswa berdasarkan kelas yang dipilih
  const filteredSiswaData = selectedKelas
    ? siswaData.filter((siswa) => siswa.kelas === selectedKelas)
    : siswaData;
  return (
    <div className="rounded-lg max-w-full p-3 bg-slate-100">
      <div className="pt-7 ml-7">
        <h1 className="text-2xl font-bold">Absensi</h1>
        <nav>
          <ol className="flex space-x-2 text-sm text-gray-700">
            <li>
              <a href="index.html" className="text-teal-500 hover:underline">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-500 ">/</span>
            </li>
            <li className="text-gray-500">Absensi</li>
          </ol>
        </nav>
      </div>
      <div className="filters-container bg-white rounded-lg shadow-md p-3 m-4 lg:p-6 border">
        <div className="bg-slate-600  px-2 rounded-xl">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 my-4 items-center">
              <div className="lg:flex-row justify-between items-center">
                <div className="items-center lg:mb-0 space-x-2 lg:order-1">
                  <select
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm sm:text-xs"
                  >
                    {monthYearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm sm:text-xs"
                >
                  <option value="">Pilih Kelas</option>
                  {Array.isArray(siswaData) &&
                    [...new Set(siswaData.map((siswa) => siswa.kelas))].map(
                      (kelasOption) => (
                        <option key={kelasOption} value={kelasOption}>
                          {kelasOption}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="w-full md:w-auto flex items-center">
                <button
                  onClick={handleExportExcel}
                  className="w-full p-2 border bg-emerald-500 rounded text-xs text-white sm:text-sm"
                >
                  Excel
                </button>
              </div>

              <div className="w-full md:w-auto flex items-center">
                <button
                  onClick={handlePrint}
                  className="w-full p-2 border bg-blue-500 rounded text-xs text-white sm:text-sm"
                >
                  Print
                </button>
              </div>

              <div className="w-full md:w-auto flex items-center">
                <button
                  onClick={handleExportPDF}
                  className="w-full p-2 border bg-rose-500 rounded text-xs text-white sm:text-sm"
                >
                  PDF
                </button>
              </div>

              <div className="w-full md:w-auto flex items-center">
                <button
                  onClick={handlePulangPagiClick}
                  className="w-full p-2 border bg-teal-400 rounded text-xs text-white sm:text-sm"
                >
                  Pulang Pagi
                </button>
              </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
              {/* <table className="min-w-full border-collapse ">
                <thead>
                  <tr style={{ fontSize: "12px" }}>
                    <th className="p-2 sm:p-3 rounded-l-lg bg-slate-500 text-white text-left ">
                      No
                    </th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white text-left ">
                      Nama
                    </th>
                    {tableHeaders.headers && tableHeaders.headers.length > 0 ? (
                      tableHeaders.headers.map((day, index) => {
                        // Calculate tomorrow's date
                        const tomorrow = new Date(tableHeaders.todayDate);
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        // Only render days that are before or equal to today, or if the day is exactly tomorrow
                        if (
                          day <= tableHeaders.todayDate ||
                          day === tomorrow.toISOString().split("T")[0]
                        ) {
                          return (
                            <th
                              key={index}
                              className={`text-center sm:text-sm p-2 ${
                                day > tableHeaders.todayDate
                                  ? "bg-gray-300 text-gray-400"
                                  : "bg-slate-500 text-white"
                              }`}
                            >
                              {day}
                            </th>
                          );
                        }

                        return null; // Skip rendering for days after tomorrow
                      })
                    ) : (
                      <th className="border text-sm sm:text-sm p-2">No Data</th>
                    )}
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">H</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">A</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">S</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">I</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white">T</th>
                    <th className="p-2 sm:p-3 rounded-r-lg bg-slate-500 text-white">
                      No Wali
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} style={{ fontSize: "12px" }}>
                      <td className="border-b text-white text-xs sm:text-xs p-2">
                        {index + 1}
                      </td>
                      <td className="border-b text-white text-xs sm:text-xs p-2">
                        {student.name}
                      </td>
                      {tableHeaders.headers.map((day, index) => {
                        let dayClass = "";
                        if (day === activeDay) {
                          dayClass = "bg-yellow-200"; // Aktif
                        } else if (inactiveDays.includes(day)) {
                          dayClass = "bg-gray-200"; // Pudar untuk tanggal-tanggal yang tidak aktif
                        } else if (day <= tableHeaders.todayDate) {
                          dayClass = "bg-gray-100"; // Tanggal lainnya sebelum atau hari ini
                        }

                        // Only render the <td> if the day is on or before today's date
                        return day <= tableHeaders.todayDate ? (
                          <td
                            key={index}
                            className={`border-b p-2 text-center sm:text-xs ${dayClass} ${getStatusClass(
                              getAttendanceStatus(student, day)
                            )}`}
                          >
                            {getAttendanceStatus(student, day)}
                          </td>
                        ) : null; // Skip rendering for days after today
                      })}
                      <td className="border-b text-white p-2 text-xs sm:text-xs text-center">
                        {
                          Object.values(student.attendance).filter(
                            (status) => status === "H"
                          ).length
                        }
                      </td>
                      <td className="border-b text-white p-2 text-xs sm:text-xs text-center">
                        {
                          Object.values(student.attendance).filter(
                            (status) => status === "A"
                          ).length
                        }
                      </td>
                      <td className="border-b text-white p-2 text-xs sm:text-xs text-center">
                        {
                          Object.values(student.attendance).filter(
                            (status) => status === "S"
                          ).length
                        }
                      </td>
                      <td className="border-b text-white p-2 text-xs sm:text-xs text-center">
                        {
                          Object.values(student.attendance).filter(
                            (status) => status === "I"
                          ).length
                        }
                      </td>
                      <td className="border-b text-white p-2 text-xs sm:text-xs text-center">
                        {
                          Object.values(student.attendance).filter(
                            (status) => status === "T"
                          ).length
                        }
                      </td>
                      <td className="border-b text-white text-xs sm:text-xs p-2 text-center">
                        <a
                          href={`https://wa.me/${student.phoneNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-whatsapp fa-lg"></i>{" "}
                          {/* Ikon WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
              <table className="w-full text-left mt-4 border-collapse">
                <thead>
                  <tr className="ml-2">
                    <th className="rounded-l-lg text-white text-xs sm:text-xs p-2 bg-slate-500">
                      No
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      Nama
                    </th>
                    {datesArray.map((date) => (
                      <th
                        key={date}
                        className="text-white text-xs sm:text-xs p-2 bg-slate-500"
                      >
                        {date}
                      </th>
                    ))}
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      H
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      A
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      S
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      I
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      T
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500 rounded-r-lg">
                      No Wali
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredSiswaData) &&
                    filteredSiswaData.map((item, index) => (
                      <tr key={item.id_siswa || index}>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {index + 1}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.nama_siswa}
                        </td>
                        {datesArray.map((date) => (
                          <td
                            key={`${item.id_siswa}-${date}`}
                            className={`border-b text-white text-xs sm:text-xs p-2 ${getStatusClass(
                              item.absensi && item.absensi[date]
                            )}`}
                          >
                            {/* Menampilkan status absensi sesuai dengan tanggal */}
                            {item.absensi && item.absensi[date]
                              ? item.absensi[date] === "H"
                                ? "Hadir"
                                : item.absensi[date] === "A"
                                ? "Alpha"
                                : item.absensi[date] === "S"
                                ? "Sakit"
                                : item.absensi[date] === "I"
                                ? "Izin"
                                : item.absensi[date] === "T"
                                ? "Terlambat"
                                : "-"
                              : "-"}
                          </td>
                        ))}
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.absensi && item.absensi["H"]
                            ? item.absensi["H"]
                            : "-"}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.absensi && item.absensi["A"]
                            ? item.absensi["A"]
                            : "-"}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.absensi && item.absensi["S"]
                            ? item.absensi["S"]
                            : "-"}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.absensi && item.absensi["I"]
                            ? item.absensi["I"]
                            : "-"}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.absensi && item.absensi["T"]
                            ? item.absensi["T"]
                            : "-"}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.nomor_wali && (
                            <a
                              href={`https://wa.me/${item.nomor_wali.replace(
                                /[^0-9]/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-green-500"
                            >
                              <FaWhatsapp className="text-green-500 text-xl" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Modal Pulang Pagi */}
            {isPulangPagiOpen && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Atur Waktu Pulang Pagi
                  </h2>
                  <div className="mb-4">
                    <label className="block mb-2">Dari</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={handleStartTimeChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Sampai</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={savePulangPagiTime}
                      className="mr-2 p-2 bg-teal-500 text-white rounded"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handlePulangPagiClose}
                      className="p-2 bg-gray-300 text-gray-700 rounded"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

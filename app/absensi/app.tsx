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
// Definisikan tipe untuk item yang sesuai dengan struktur data Anda
type Keterangan = "H" | "A" | "S" | "I" | "T" | "-" | "Datang" | "Alpa" | "Terlambat" | "Sakit" | "Izin"; // Menambahkan "Datang" ke dalam tipe
interface SiswaItem {
  id_siswa: number;
  nama_siswa: string;
  kelas: string;
  total_hadir: number;
  total_terlambat: number;
  total_alpa: number;
  total_sakit: number;
  total_izin: number;
  absensi: { [key: string]: Keterangan};
  keterangan: Keterangan;
  nomor_wali: string;
  tanggal?: string;
}
type MappedData = {
  [id_siswa: string]: {
    [tanggal: number]: any;
  };
};
type AbsensiData = {
  id_siswa: string;
  tanggal: string; // Atau Date jika sudah diproses
  [key: string]: any; // Tambahkan properti lain jika diperlukan
};
type Option = {
  value: string;
  label: string;
};
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

  // useEffect(() => {
  //   const today = new Date();
  //   console.log(today);
  //   const monthNames = [
  //     "Januari",
  //     "Februari",
  //     "Maret",
  //     "April",
  //     "Mei",
  //     "Juni",
  //     "Juli",
  //     "Agustus",
  //     "September",
  //     "Oktober",
  //     "November",
  //     "Desember",
  //   ];
  //   const currentMonthYear = `${
  //     monthNames[today.getMonth()]
  //   } ${today.getFullYear()}`;
  //   setSelectedMonthYear(currentMonthYear);

  //   const currentDay = today.getDate();
  //   setActiveDay(currentDay);
  //   // Set inactive days as the days before the current day
  //   const daysInMonth = new Date(
  //     today.getFullYear(),
  //     today.getMonth() + 1,
  //     0
  //   ).getDate();
  //   const inactiveDays = Array.from(
  //     { length: Math.min(currentDay - 1, 3) },
  //     (_, i) => i + 1
  //   );
  //   setInactiveDays(inactiveDays);

  //   generateTableHeaders(
  //     today.getMonth(),
  //     today.getFullYear(),
  //     today.getDate()
  //   );
  // }, []);

  // const handleMonthYearChange1 = (e) => {
  //   const [selectedMonth, selectedYear] = e.target.value.split(" ");
  //   const monthIndex = monthYearOptions.findIndex(
  //     (option) => option.month === selectedMonth
  //   );
  //   setSelectedMonthYear(e.target.value);
  //   generateTableHeaders(monthIndex, parseInt(selectedYear));
  // };

  const handleKelasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKelas(e.target.value);
  };

  // const monthYearOptions = getMonthYearOptions();

  // const generateTableHeaders = (monthIndex, year, todayDate = null) => {
  //   const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  //   const headers = [];
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     headers.push(i);
  //   }
  //   setTableHeaders({ headers, todayDate });
  // };

  const handlePulangPagiClick = () => {
    setIsPulangPagiOpen(true);
  };

  const handlePulangPagiClose = () => {
    setIsPulangPagiOpen(false);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  

  // const getStatusClass = (status) => {
  //   switch (status) {
  //     case "H":
  //       return "bg-green-500 text-white";
  //     case "I":
  //       return "bg-orange-500 text-white";
  //     case "A":
  //       return "bg-red-500 text-white";
  //     case "S":
  //       return "bg-sky-500 text-white";
  //     case "T":
  //       return "bg-gray-500 text-white";
  //     default:
  //       return "";
  //   }
  // };

  // const getAttendanceStatus = (student, day) => {
  //   return student.attendance[day] || "-";
  // };

  const handlePrint = () => {
    window.print();
  };
  // const handleExportPDF = () => {
  //   const doc = new jsPDF();

  //   // Menambahkan judul pada PDF
  //   doc.text("Laporan Absensi Siswa", 14, 10);

  //   // Menyiapkan data tabel
  //   const tableColumn = [
  //     "No",
  //     "Nama Siswa",
  //     ...datesArray1.map((date) => `${date}`),
  //     "Hadir",
  //     "Alpha",
  //     "Sakit",
  //     "Izin",
  //     "Terlambat",
  //     "Nomor Wali",
  //   ];

  //   const tableRows = filteredSiswaData.map((item, index) => {
  //     const rowData = [
  //       index + 1, // Nomor urut
  //       (item as { nama_siswa: string }).nama_siswa, // Nama siswa
  //       ...datesArray1.map((date) => {
  //         return item.absensi && item.absensi[date]
  //           ? item.absensi[date] === "H"
  //             ? "Hadir"
  //             : item.absensi[date] === "A"
  //             ? "Alpha"
  //             : item.absensi[date] === "S"
  //             ? "Sakit"
  //             : item.absensi[date] === "I"
  //             ? "Izin"
  //             : item.absensi[date] === "T"
  //             ? "Terlambat"
  //             : "-"
  //           : "-";
  //       }),
  //       item.absensi && item.absensi["H"] ? item.absensi["H"] : "-",
  //       item.absensi && item.absensi["A"] ? item.absensi["A"] : "-",
  //       item.absensi && item.absensi["S"] ? item.absensi["S"] : "-",
  //       item.absensi && item.absensi["I"] ? item.absensi["I"] : "-",
  //       item.absensi && item.absensi["T"] ? item.absensi["T"] : "-",
  //       item.nomor_wali, // Nomor Wali
  //     ];
  //     return rowData;
  //   });

  //   // Menambahkan tabel ke dalam PDF
  //   doc.autoTable({
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 20, // Menyesuaikan posisi vertikal awal tabel
  //     theme: "grid",
  //     headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Gaya header tabel
  //     styles: { cellPadding: 3, fontSize: 10 }, // Gaya sel tabel
  //   });

  //   // Mengekspor file PDF
  //   doc.save("Absensi_Siswa.pdf");
  // };
  const handleExportExcel = () => {
    // Membuat worksheet dari data siswa
    const wsData = filteredSiswaData.map((item, index) => {
      const rowData = [
        index + 1, // Nomor urut
        item.nama_siswa, // Nama Siswa
        ...datesArray1.map((date) => {
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
        ...datesArray1.map((date) => `${date}`), // Header untuk tanggal
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
  // // Mendapatkan tanggal sekarang
  // const currentDate = new Date();
  // const currentDay = currentDate.getDate();
  // const currentMonth = currentDate.getMonth() + 1;
  // const currentYear = currentDate.getFullYear();

  // // Membuat array bulan dan tahun
  // const monthsArray = [
  //   "Januari",
  //   "Februari",
  //   "Maret",
  //   "April",
  //   "Mei",
  //   "Juni",
  //   "Juli",
  //   "Agustus",
  //   "September",
  //   "Oktober",
  //   "November",
  //   "Desember",
  // ];

  // Menyusun opsi bulan untuk tahun sekarang
  // const monthYearOptions = monthsArray.map((month, index) => ({
  //   label: `${month} ${currentYear}`,
  //   value: `${currentYear}-${index + 1}`, // Format nilai: "YYYY-MM"
  // }));

  // // State untuk menyimpan bulan dan tahun yang dipilih
  // const [selectedMonthYear, setSelectedMonthYear] = useState(
  //   `${currentYear}-${currentMonth}`
  // );

  // // Mendapatkan bulan dan tahun dari pilihan
  // const [selectedYear, selectedMonth] = selectedMonthYear
  //   .split("-")
  //   .map(Number);

  // // Membuat array tanggal sesuai bulan dan tahun yang dipilih
  // const datesArray = Array.from(
  //   {
  //     length:
  //       selectedYear === currentYear && selectedMonth === currentMonth
  //         ? currentDay // Hanya hingga tanggal hari ini untuk bulan & tahun saat ini
  //         : new Date(selectedYear, selectedMonth, 0).getDate(), // Semua tanggal untuk bulan lainnya
  //   },
  //   (_, i) => i + 1
  // );


  
  

    const [absensi, setAbsensi] = useState([]);
    const [mappedData, setMappedData] = useState({});

    useEffect(() => {
      // Ambil data absensi dari API
      axios.get(`${baseUrl}/absensi/all-absensi`)
        .then((response) => {
          const data = response.data.data;  // Data absensi yang didapatkan dari API
          const typedData = data as AbsensiData[];

          // Mapping data absensi berdasarkan id_siswa dan tanggal
          const mapped = typedData.reduce<MappedData>((acc, item: AbsensiData) => {
            const dateKey = new Date(item.tanggal).getDate(); // Mendapatkan tanggal dari '2024-12-10' menjadi 10
            if (!acc[item.id_siswa]) {
              acc[item.id_siswa] = {};
            }
            acc[item.id_siswa][dateKey] = item;
            return acc;
          }, {});
          
          setAbsensi(data);
          setMappedData(mapped);
        })
        .catch((error) => {
          console.error("Error fetching absensi data:", error);
        });
    }, []);
    const [absensiData, setAbsensiData] = useState<SiswaItem[]>([]);
    const [todayDate, setTodayDate] = useState(null);
    const [datesArray1, setDatesArray1] = useState<string[]>([]);
    const [monthYearOptions, setMonthYearOptions] = useState<Option[]>([]);
    const currentDate = new Date();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const initialSelectedMonthYear = `${currentYear}-${currentMonth}`;
    const [selectedMonthYear, setSelectedMonthYear] = useState(initialSelectedMonthYear);
    const [isCurrentMonth, setIsCurrentMonth] = useState(false);
    useEffect(() => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const selectedYearMonth = selectedMonthYear;
    
      if (selectedYearMonth === `${currentYear}-${currentMonth}`) {
        setIsCurrentMonth(true);
      } else {
        setIsCurrentMonth(false);
      }
    }, [selectedMonthYear]);

    useEffect(() => {
      const generateMonthYearOptions = () => {
        const options = [];
        for (let year = new Date().getFullYear(); year >= 2020; year--) {
          for (let month = 1; month <= 12; month++) {
            options.push({
              value: `${year}-${String(month).padStart(2, '0')}`,
              label: `${getMonthName(month)} ${year}`,
            });
          }
        }
        setMonthYearOptions(options);
      };
  
      generateMonthYearOptions();
    }, []);
  
    useEffect(() => {
      const generateDatesArray1 = () => {
        if (!selectedMonthYear) return;
        const [year, month] = selectedMonthYear.split('-').map((value) => parseInt(value));
        const dates = [];
        const firstDay = new Date(year, month - 1, 1);
        const today = new Date();
        const lastDay = selectedMonthYear === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}` ? new Date() : new Date(currentYear, currentMonth + 1, 0);
        
        for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
          const date = new Date(year, month - 1, i);
          dates.push(formatDate(date));
        }
        setDatesArray1(dates);
      };
    
      generateDatesArray1();
    }, [selectedMonthYear]);
  
    const getMonthName = (month: number): string => {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return monthNames[month - 1];
    };
  
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  

    // useEffect(() => {
    //   // Mendapatkan tanggal hari ini dan 6 hari sebelumnya
    //   const today = new Date();
    //   const dates = [];
      
    //   // Loop untuk mendapatkan tanggal hari ini dan 6 hari sebelumnya
    //   for (let i = 0; i < 10; i++) {
    //     const date = new Date(today);
    //     date.setDate(today.getDate() - i); // Mengurangi tanggal untuk mendapatkan tanggal sebelumnya
    //     const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    //     dates.push(formattedDate);
    //   }
      
    //   setDatesArray1(dates); // Simpan array tanggal dalam state
  
    //   // Ambil data absensi dari API
    //   axios.get(`${baseUrl}/absensi/all-absensi`)
    //     .then((response) => {
    //       setAbsensiData(response.data.data); // Simpan data absensi ke dalam state
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching absensi data:", error);
    //     });
    // }, []);

  // Filter siswa berdasarkan kelas yang dipilih
  useEffect(() => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Mendapatkan tanggal 1 bulan ini
  const dates = [];

  // Loop untuk mendapatkan tanggal 1 sampai hari ini
  let currentDate = firstDayOfMonth;
  while (currentDate <= today) {
    // Format tanggal menjadi YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tambahkan 1 karena bulan dimulai dari 0
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; // Format YYYY-MM-DD
    dates.push(formattedDate);

    currentDate.setDate(currentDate.getDate() + 1); // Menambah satu hari
  }

  setDatesArray1(dates); // Menyimpan array tanggal dalam state

  // Ambil data absensi dari API
  axios
    .get(`${baseUrl}/absensi/all-absensi`)
    .then((response) => {
      setAbsensiData(response.data.data); // Simpan data absensi ke dalam state
      console.log('siswaa', response);
    })
    .catch((error) => {
      console.error("Error fetching absensi data:", error);
    });
}, []);
  
  const filteredSiswaData = selectedKelas
    ? absensiData.filter((siswa) => siswa.kelas === selectedKelas)
    : absensiData;

    // Contoh data siswa dengan absensi
    const groupedData = filteredSiswaData.reduce<SiswaItem[]>((acc, item) => {
      // Cari siswa berdasarkan id_siswa
      let existingStudent = acc.find((siswa) => siswa.id_siswa === item.id_siswa);
      
      if (!existingStudent) {
        // Jika siswa belum ada di grup, tambahkan siswa baru
        existingStudent = {
          id_siswa: item.id_siswa,
          nama_siswa: item.nama_siswa,
          kelas: item.kelas,
          total_hadir: 0,
          total_terlambat: 0,
          total_alpa: 0,
          total_sakit: 0,
          total_izin: 0,
          absensi: {},
          keterangan: "-", // Nilai default untuk keterangan
          nomor_wali: item.nomor_wali,
        };
      }
      const mappedKeterangan = item.keterangan === "Datang" ? "H" : item.keterangan ?? "-"; // Memetakan "Datang" menjadi "H"
      // Isi data absensi berdasarkan tanggal
      if (item.tanggal && item.tanggal.startsWith(selectedMonthYear)) {
        existingStudent.absensi[item.tanggal] = mappedKeterangan;
        // Hitung total berdasarkan keterangan
        if (item.keterangan === "Datang") {
          existingStudent.total_hadir++;
        } else if (item.keterangan === "Alpa") {
          existingStudent.total_alpa++;
        } else if (item.keterangan === "Terlambat") {
          existingStudent.total_terlambat++;
        } else if (item.keterangan === "Sakit") {
          existingStudent.total_sakit++;
        } else if (item.keterangan === "Izin") {
          existingStudent.total_izin++;
        }
      }
      
      return acc;
    }, []);
    
    
const [kelas, setKelas] = useState([]);
  const fetchKelasSiswaTotal = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/absensi/all-absensi`
      );
      setKelas(response.data.data); // Menyimpan data ke state kelas
      console.log("total", response.data);
    } catch (error) {
      console.error("Fetch error:", error); // Menangani kesalahan
    }
  };
  useEffect(() => {
    fetchKelasSiswaTotal(); // Panggil fungsi fetch saat komponen di-mount
  }, []);

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
                  {Array.isArray(absensiData) &&
                    Array.from(new Set(absensiData.map((siswa) => siswa.kelas))).map((kelas) => (
                      <option key={kelas} value={kelas}>
                        {kelas}
                      </option>
                    ))}
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

              {/* <div className="w-full md:w-auto flex items-center">
                <button
                  onClick={handleExportPDF}
                  className="w-full p-2 border bg-rose-500 rounded text-xs text-white sm:text-sm"
                >
                  PDF
                </button>
              </div> */}

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
              <table className="w-full text-left mt-4 border-collapse">
                <thead>
                  <tr className="ml-2">
                    <th className="rounded-l-lg text-white text-xs sm:text-xs p-2 bg-slate-500">
                      No
                    </th>
                    <th className="text-white text-xs sm:text-xs p-2 bg-slate-500">
                      Nama
                    </th>
                    
                    {datesArray1.map((date, index) => (
                      <th key={index}
                      className="text-white text-xs sm:text-xs p-2 bg-slate-500">{`${date}`}
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
                  {/* {Array.isArray(groupedData) &&
                    groupedData.map((item, index) => (
                      <tr key={item.id_siswa || index}>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {index + 1}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                          {item.nama_siswa}
                        </td>
                        {datesArray1.map((date) => (
                          <td
                            key={`${item.id_siswa}-${date}`}
                            className={`border-b text-white text-xs sm:text-xs p-2 ${
                              item.absensi[date] === "Alpa"
                                ? "bg-red-500"
                                : item.absensi[date] === "Datang"
                                ? "bg-green-500"
                                : item.absensi[date] === "Terlambat"
                                ? "bg-gray-500"
                                : ""
                            }`}
                          >
                            {item.absensi[date]
                              ? item.absensi[date] === "Alpa"
                                ? "A"
                                : item.absensi[date] === "Datang"
                                ? "H"
                                : item.absensi[date] === "Terlambat"
                                ? "T"
                                : item.absensi[date]
                              : "-"}
                          </td>
                        ))}
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                        {item.total_hadir}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                        {item.total_alpa}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                        {item.total_sakit}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                        {item.total_izin}
                        </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2">
                        {item.total_terlambat}
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
                    ))} */}
                    {Array.isArray(groupedData) && groupedData.map((item, index) => (
                      <tr key={item.id_siswa || index}>
                        <td className="border-b text-white text-xs sm:text-xs p-2"> {index + 1} </td>
                        <td className="border-b text-white text-xs sm:text-xs p-2"> {item.nama_siswa} </td>
                        {datesArray1.map((date) => {
                            console.log("Absensi untuk siswa:", item.id_siswa, "Tanggal:", date, "Data:", item.absensi);
                            
                            // Periksa nilai absensi untuk tanggal tertentu dan pulang
                            const hadir = item.absensi[date]; // Status hadir (Datang, Terlambat, Alpa)
                            const pulang = item.absensi[`${date}_pulang`]; // Status pulang (Jika ada)

                            // Tentukan kelas berdasarkan status hadir dan pulang
                            let statusClass = "";
                            if (hadir === "Alpa") {
                              statusClass = "bg-red-500"; // Alpa
                            } else if (hadir === "Datang" && !pulang) {
                              statusClass = "bg-green-500 opacity-50"; // Datang tapi belum pulang
                            } else if (hadir === "Datang" && pulang) {
                              statusClass = "bg-green-700"; // Datang dan sudah pulang
                            } else if (hadir === "Terlambat" && !pulang) {
                              statusClass = "bg-gray-500 opacity-50"; // Terlambat tapi belum pulang
                            } else if (hadir === "Terlambat" && pulang) {
                              statusClass = "bg-gray-700"; // Terlambat dan sudah pulang
                            }

                            return (
                              <td
                                key={`${item.id_siswa}-${date}`}
                                className={`border-b text-white text-xs text-center sm:text-xs p-2 ${statusClass}`}
                              >
                                {hadir
                                  ? hadir === "Alpa"
                                    ? "A" // Alpa
                                    : hadir === "Datang"
                                    ? "H" // Hadir
                                    : hadir === "Terlambat"
                                    ? "T" // Terlambat
                                    : hadir
                                  : "-"} 
                              </td>
                            );
                          })}


                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.total_hadir} </td>
                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.total_alpa} </td>
                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.total_sakit} </td>
                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.total_izin} </td>
                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.total_terlambat} </td>
                        <td className="border-b text-white text-center text-xs sm:text-xs p-2"> {item.nomor_wali && (
                          <a href={`(link unavailable){item.nomor_wali.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500" >
                            <FaWhatsapp className="text-green-500 text-xl" />
                          </a>
                        )} </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* <table>
      <thead>
        <tr>
          <th>ID Siswa</th>
          {datesArray1.map((date, index) => (
            <th key={index}>{`Tanggal ${date}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {absensiData.map((item) => (
          <tr key={item.id_siswa}>
            <td>{item.nama_siswa}</td>
            {datesArray1.map((date) => (
              <td
                key={`${item.id_siswa}-${date}`}
                className={`border-b text-white text-xs sm:text-xs p-2 ${
                  item.tanggal === date && item.keterangan === "Alpa"
                    ? "bg-red-500" // Background merah jika keterangan adalah "Alpa"
                    : item.tanggal === date && item.keterangan === "Datang"
                    ? "bg-green-500" // Background hijau jika keterangan adalah "Hadir"
                    : item.tanggal === date && item.keterangan === "Terlambat"
                    ? "bg-gray-500" // Background abu-abu jika keterangan adalah "Terlambat"
                    : ""
                }`}
              >
                {item.tanggal === date
                  ? item.keterangan === "Alpa"
                    ? "A" // Menampilkan "A" jika keterangan adalah "Alpa"
                    : item.keterangan === "Datang"
                    ? "H" // Menampilkan "H" jika keterangan adalah "Hadir"
                    : item.keterangan === "Terlambat"
                    ? "T" // Menampilkan "T" jika keterangan adalah "Terlambat"
                    : item.keterangan // Menampilkan keterangan lainnya
                  : "-"}
              </td>
            ))}

          </tr>
        ))}
      </tbody>
    </table> */}
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

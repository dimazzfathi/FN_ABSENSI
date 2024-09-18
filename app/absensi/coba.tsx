import { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Filters = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [tableHeaders, setTableHeaders] = useState({ headers: [], todayDate: null });
  const [isPulangPagiOpen, setIsPulangPagiOpen] = useState(false);
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('08:00');
  const [activeDay, setActiveDay] = useState(null);
  const [inactiveDays, setInactiveDays] = useState([]); 

  useEffect(() => {
    const today = new Date();
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const currentMonthYear = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    setSelectedMonthYear(currentMonthYear);
  
    const currentDay = today.getDate();
    setActiveDay(currentDay);
    // Set inactive days as the days before the current day
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const inactiveDays = Array.from({ length: Math.min(currentDay - 1, 3) }, (_, i) => i + 1);
    setInactiveDays(inactiveDays);
  
    generateTableHeaders(today.getMonth(), today.getFullYear(), today.getDate());
  }, []);

  const handleMonthYearChange = (e) => {
    const [selectedMonth, selectedYear] = e.target.value.split(' ');
    const monthIndex = monthYearOptions.findIndex(option => option.month === selectedMonth);
    setSelectedMonthYear(e.target.value);
    generateTableHeaders(monthIndex, parseInt(selectedYear));
  };

  const handleKelasChange = (e) => {
    setSelectedKelas(e.target.value);
  };

  const getMonthYearOptions = () => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const currentYear = new Date().getFullYear();
    const futureYears = 4; // Menampilkan tahun hingga 5 tahun ke depan
    const options = [];

    for (let year = currentYear; year <= currentYear + futureYears; year++) {
      monthNames.forEach(month => {
        options.push({ month, year });
      });
    }
    return options;
  };

  const monthYearOptions = getMonthYearOptions();

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
    { id: 1, name: 'Dimaz Fathi Fikri', attendance: { 1: 'H', 2: 'H', 3: 'I', 4: 'A', 5:'H', 6:'H'}, phoneNumber: '+6283897650528' },
    { id: 2, name: 'Bima Suluk Wibisono', attendance: { 1: 'H', 2: 'I', 3: 'H', 4: 'H', 5:'H', 6:'A'}, phoneNumber: '+6285895459230' },
    { id: 3, name: 'Anggra Meisya Nur Isnaini', attendance: { 1: 'H', 2: 'H', 3: 'H', 4: 'S', 5:'H', 6:'T'}, phoneNumber: '08672345678' },
    { id: 4, name: 'Abdul Rohman', attendance: { 1: 'A', 2: 'H', 3: 'S', 4: 'H', 5:'H', 6:'I'}, phoneNumber: '+6288991755499' },
    { id: 5, name: 'Ali Musitofa', attendance: { 1: 'H', 2: 'H', 3: 'H', 4: 'I', 5:'T', 6:'H'}, phoneNumber: '+6281259356633' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'H':
        return 'bg-green-500 text-white';
      case 'I':
        return 'bg-yellow text-dark';
      case 'A':
        return 'bg-red-500 text-white';
      case 'S':
        return 'bg-sky-500 text-white';
      case 'T':
        return 'bg-gray-500 text-white';
      default:
        return '';
    }
  };

  const getAttendanceStatus = (student, day) => {
    return student.attendance[day] || '-';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Logika untuk ekspor PDF
  };

  const handleExportExcel = () => {
    // Logika untuk ekspor Excel
  };

  const handleExportJPG = () => {
    // Logika untuk ekspor JPG
  };

  return (
    <div className="rounded-lg max-w-full p-3 bg-slate-100">
      <div className="pt-7 ml-7">
        <h1 className="text-2xl font-bold">Absensi</h1>
        <nav>
          <ol className="flex space-x-2 text-sm text-gray-700">
            <li>
              <a href="index.html" className="text-teal-500 hover:underline">Home</a>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-500">Absensi</li>
          </ol>
        </nav>
      </div>
      <div className='filters-container bg-white rounded-lg shadow-md p-3 m-4 lg:p-6 border'>
        <div className='bg-slate-600  px-2 rounded-xl'>
          <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 my-4 items-center">
            <div className="lg:flex-row justify-between items-center">
              <div className="items-center lg:mb-0 space-x-2 lg:order-1">
                <select value={selectedMonthYear} onChange={handleMonthYearChange} className="w-full p-2 border border-gray-300 rounded text-sm sm:text-xs">
                  {monthYearOptions.map((option, index) => (
                    <option key={index} value={`${option.month} ${option.year}`}>
                      {`${option.month} ${option.year}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <select value={selectedKelas} onChange={handleKelasChange} className="w-full p-2 border border-gray-300 rounded text-sm sm:text-xs">
                <option value="">Pilih Kelas</option>
                {kelasOptions.map((kelas, index) => (
                  <option key={index} value={kelas}>
                    {kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md" onClick={handlePrint}>Print</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md" onClick={handleExportPDF}>Export PDF</button>
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md" onClick={handleExportExcel}>Export Excel</button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md" onClick={handleExportJPG}>Export JPG</button>
          </div>

          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Nama</th>
                <th className="border p-2">No. Telp</th>
                {tableHeaders.headers.map((day, index) => (
                  <th key={index} className="border p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">
                    <a href={`https://wa.me/${student.phoneNumber}`} target="_blank" rel="noopener noreferrer">   
                      <i className="fab fa-whatsapp fa-lg"></i> {/* Ikon WhatsApp */}
                    </a>
                    
                  </td>
                  {tableHeaders.headers.map((day, index) => (
                    <td key={index} className={`border p-2 ${getStatusClass(getAttendanceStatus(student, day))}`}>
                      {getAttendanceStatus(student, day)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Filters;

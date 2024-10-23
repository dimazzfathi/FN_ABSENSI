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
    console.log(today)
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
    { id: 3, name: 'Anggra Meisya Nur Isnaini', attendance: { 1: 'H', 2: 'H', 3: 'H', 4: 'S', 5:'H', 6:'T'}, phoneNumber: '+6283851799450' },
    { id: 4, name: 'Abdul Rohman', attendance: { 1: 'A', 2: 'H', 3: 'S', 4: 'H', 5:'H', 6:'I'}, phoneNumber: '+6288991755499' },
    { id: 5, name: 'Ali Musitofa', attendance: { 1: 'H', 2: 'H', 3: 'H', 4: 'I', 5:'T', 6:'H'}, phoneNumber: '+6281259356633' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'H':
        return 'bg-green-500 text-white';
      case 'I':
        return 'bg-orange-500 text-white';
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
              <span className="text-gray-500 ">/</span>
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

            <div className="w-full md:w-auto flex items-center">
            <button onClick={handleExportExcel} className="w-full p-2 border bg-emerald-500 rounded text-xs text-white sm:text-sm">
                Excel
              </button>
            </div> 

            <div className="w-full md:w-auto flex items-center">
              <button onClick={handlePrint} className="w-full p-2 border bg-blue-500 rounded text-xs text-white sm:text-sm">
                Print
              </button>
            </div>

            <div className="w-full md:w-auto flex items-center">
              <button onClick={handleExportPDF} className="w-full p-2 border bg-rose-500 rounded text-xs text-white sm:text-sm">
                PDF
              </button>
            </div>  

            <div className="w-full md:w-auto flex items-center">
              
              <button onClick={handlePulangPagiClick} className="w-full p-2 border bg-teal-400 rounded text-xs text-white sm:text-sm">
                Pulang Pagi
              </button>
            </div>
          </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse ">
                <thead>
                  <tr style={{ fontSize: '12px' }}>
                    <th className="p-2 sm:p-3 rounded-l-lg bg-slate-500 text-white text-left ">No</th>
                    <th className="p-2 sm:p-3 bg-slate-500 text-white text-left ">Nama</th>
                    {tableHeaders.headers && tableHeaders.headers.length > 0 ? (
                      tableHeaders.headers.map((day, index) => {
                        // Calculate tomorrow's date
                        const tomorrow = new Date(tableHeaders.todayDate);
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        // Only render days that are before or equal to today, or if the day is exactly tomorrow
                        if (day <= tableHeaders.todayDate || day === tomorrow.toISOString().split('T')[0]) {
                          return (
                            <th key={index}
                                className={`text-center sm:text-sm p-2 ${day > tableHeaders.todayDate ? 'bg-gray-300 text-gray-400' : 'bg-slate-500 text-white'}`}>
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
                    <th className="p-2 sm:p-3 rounded-r-lg bg-slate-500 text-white">No Wali</th>
                  </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} style={{ fontSize: '12px' }}>
                        <td className="border-b text-white text-xs sm:text-xs p-2">{index + 1}</td>
                          <td className="border-b text-white text-xs sm:text-xs p-2">{student.name}</td>
                          {tableHeaders.headers.map((day, index) => {
                          let dayClass = '';
                          if (day === activeDay) {
                            dayClass = 'bg-yellow-200'; // Aktif
                          } else if (inactiveDays.includes(day)) {
                            dayClass = 'bg-gray-200'; // Pudar untuk tanggal-tanggal yang tidak aktif
                          } else if (day <= tableHeaders.todayDate) {
                            dayClass = 'bg-gray-100'; // Tanggal lainnya sebelum atau hari ini
                          }

                          // Only render the <td> if the day is on or before today's date
                          return (
                            day <= tableHeaders.todayDate ? (
                              <td
                                key={index}
                                className={`border-b p-2 text-center sm:text-xs ${dayClass} ${getStatusClass(getAttendanceStatus(student, day))}`}
                              >
                                {getAttendanceStatus(student, day)}
                              </td>
                            ) : null // Skip rendering for days after today
                          );
                        })}
                        <td className="border-b text-white p-2 text-xs sm:text-xs text-center">{Object.values(student.attendance).filter(status => status === 'H').length}</td>
                        <td className="border-b text-white p-2 text-xs sm:text-xs text-center">{Object.values(student.attendance).filter(status => status === 'A').length}</td>
                        <td className="border-b text-white p-2 text-xs sm:text-xs text-center">{Object.values(student.attendance).filter(status => status === 'S').length}</td>
                        <td className="border-b text-white p-2 text-xs sm:text-xs text-center">{Object.values(student.attendance).filter(status => status === 'I').length}</td>
                        <td className="border-b text-white p-2 text-xs sm:text-xs text-center">{Object.values(student.attendance).filter(status => status === 'T').length}</td>
                        <td className="border-b text-white text-xs sm:text-xs p-2 text-center">
                        <a href={`https://wa.me/${student.phoneNumber}`} target="_blank" rel="noopener noreferrer">   
                          <i className="fab fa-whatsapp fa-lg"></i> {/* Ikon WhatsApp */}
                        </a>
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
                  <h2 className="text-xl font-semibold mb-4">Atur Waktu Pulang Pagi</h2>
                  <div className="mb-4">
                    <label className="block mb-2">Dari</label>
                    <input type="time" value={startTime} onChange={handleStartTimeChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Sampai</label>
                    <input type="time" value={endTime} onChange={handleEndTimeChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={savePulangPagiTime} className="mr-2 p-2 bg-teal-500 text-white rounded">Simpan</button>
                    <button onClick={handlePulangPagiClose} className="p-2 bg-gray-300 text-gray-700 rounded">Tutup</button>
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
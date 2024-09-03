"use client";
import React, { useState, useEffect, useRef } from 'react';
import TimeDropdown from './TimeDropdown'; // Pastikan nama file benar

const hal = ({ time, onChange }) => {

  

  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(formattedTime);
    }
  }

  return (
    
    <select
      value={`${time.hours}:${time.minutes}`}
      onChange={(e) => {
        const [hours, minutes] = e.target.value.split(':');
        onChange('hours', hours);
        onChange('minutes', minutes);
      }}
      className="p-1 border rounded-md h-10 w-24 text-sm bg-white border-slate-400"
    >
      {timeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const Schedule = () => {
  const [arrivalTimes, setArrivalTimes] = useState([{ hours: '07', minutes: '00' }, { hours: '07', minutes: '30' }]);
  const [departureTimes, setDepartureTimes] = useState([{ hours: '14', minutes: '00' }, { hours: '14', minutes: '30' }]);
  const [latenessTimes, setLatenessTimes] = useState([{ hours: '07', minutes: '16' }, { hours: '09', minutes: '00' }]);
  const [savedData, setSavedData] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [saveResult, setSaveResult] = useState({});
  const [arrivalTime1, setArrivalTime1] = useState('');
  const [arrivalTime2, setArrivalTime2] = useState('');
  const [departureTime1, setDepartureTime1] = useState('');
  const [departureTime2, setDepartureTime2] = useState('');
  const [latenessTime1, setLatenessTime1] = useState('');
  const [latenessTime2, setLatenessTime2] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [pilihHari, setPilihHari] = useState([]);
  const checkboxRefs = useRef({});


  const handleTimeChange = (
    type: 'arrival' | 'departure' | 'lateness',
    value: string, // Waktu dalam format HH:mm
    index: number
  ) => {
    const [hours, minutes] = value.split(':');
  
    if (type === 'arrival') {
      setArrivalTimes(prevTimes => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = { hours, minutes };
        return updatedTimes;
      });
    } else if (type === 'departure') {
      setDepartureTimes(prevTimes => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = { hours, minutes };
        return updatedTimes;
      });
    } else if (type === 'lateness') {
      setLatenessTimes(prevTimes => {
        const updatedTimes = [...prevTimes];
        updatedTimes[index] = { hours, minutes };
        return updatedTimes;
      });
    }
  };
  
  
  

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  
  // Contoh pengambilan data
  useEffect(() => {
    const savedData = localStorage.getItem('savedResults');
    if (savedData) {
      setSavedData(JSON.parse(savedData));
    }
  }, []);
  
  useEffect(() => {
    // Ambil data dari localStorage saat komponen dimuat
    const savedDays = JSON.parse(localStorage.getItem('selectedDays')) || [];
    setSelectedDays(savedDays);
  }, []);
  
  const handleSave = () => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const selected = days.filter(day => checkboxRefs.current[day]?.checked);
    
    // Simpan data ke localStorage
    localStorage.setItem('selectedDays', JSON.stringify(selected));
    setSelectedDays(selected);
  };

    const handleSaveClick = () => {
      const newData = {
        arrival: { from: arrivalTimes[0], to: arrivalTimes[1] },
        departure: { from: departureTimes[0], to: departureTimes[1] },
        lateness: { from: latenessTimes[0], to: latenessTimes[1] },
      };
    
      const updatedData = { ...savedData };
    
      selectedDays.forEach((day) => {
        updatedData[day] = newData;
      });
    
      localStorage.setItem('savedResults', JSON.stringify(updatedData)); // Simpan data ke localStorage
      setSavedData(updatedData);
      setIsEditing(false); // Exit edit mode
    };
    

  
  
  

  return (
    <>
    <div className='bg-slate-100 min-h-screen'>
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          {/* Kolom 1 */}
          <div className='bg-white p-4 rounded-lg shadow-md'> 
            <div className="text-slate-600 text-lg font-semibold mb-4">Jam Sekolah</div>
            <div className="bg-white shadow-md rounded-lg border border-slate-300 p-4">
              <h2 className="text-lg font-semibold mb-4"> Hari dan Atur Waktu</h2>
              {/* Checkbox Rendering untuk Hari */}
                <div className="flex flex-wrap mb-4">
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                    <div key={day} className="flex items-center mr-4 mb-2">
                      <input 
                        type="checkbox" 
                        id={day} 
                        className="mr-2" 
                        onChange={() => handleDayChange(day)} 
                      />
                      <label htmlFor={day} className="text-sm text-slate-600">{day}</label>
                    </div>
                  ))}
                </div>

                {/* Bagian waktu datang, pulang, dan keterlambatan */}
                <div className="flex flex-row flex-wrap gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-600 mb-2">Waktu Datang</h2>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Dari</span>
                          <TimeDropdown
                            time={`${arrivalTimes[0].hours}:${arrivalTimes[0].minutes}`}
                            onChange={(value) => handleTimeChange('arrival', value, 0)}
                          />
                        </div>
                        <span className='mt-7'>-</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Sampai</span>
                          <TimeDropdown
                            time={`${arrivalTimes[1].hours}:${arrivalTimes[1].minutes}`}
                            onChange={(value) => handleTimeChange('arrival', value, 1)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-600 mb-2">Waktu Pulang</h2>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Dari</span>
                          <TimeDropdown
                            time={`${departureTimes[0].hours}:${departureTimes[0].minutes}`}
                            onChange={(value) => handleTimeChange('departure', value, 0)}
                          />
                        </div>
                        <span className='mt-7'>-</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Sampai</span>
                          <TimeDropdown
                            time={`${departureTimes[1].hours}:${departureTimes[1].minutes}`}
                            onChange={(value) => handleTimeChange('departure', value, 1)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-600 mb-2">Keterlambatan</h2>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Dari</span>
                          <TimeDropdown
                            time={`${latenessTimes[0].hours}:${latenessTimes[0].minutes}`}
                            onChange={(value) => handleTimeChange('departure', value, 0)}
                          />
                        </div>
                        <span className='mt-7'>-</span>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600 mb-1">Sampai</span>
                          <TimeDropdown
                            time={`${latenessTimes[1].hours}:${latenessTimes[1].minutes}`}
                            onChange={(value) => handleTimeChange('departure', value, 1)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="flex justify-end mt-4">
                    <button 
                      className="px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500"
                      onClick={handleSaveClick}
                    >
                      Simpan
                    </button>
                  </div>
            </div>



            {/* Kolom 2 - Hasil Simpanan */}
            <div className="p-4 mt-4 border rounded-lg bg-slate-600 text-white">
  <h2 className="text-lg font-semibold mb-4">Hasil</h2>
  <div className="p-4 border rounded-md bg-white text-slate-600">
    {Object.keys(savedData).length > 0 ? (
      <div className="result grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(savedData).map((day) => {
          const dayData = savedData[day];
          if (
            dayData &&
            dayData.arrival &&
            dayData.departure &&
            dayData.lateness &&
            dayData.arrival.from &&
            dayData.arrival.to &&
            dayData.departure.from &&
            dayData.departure.to &&
            dayData.lateness.from &&
            dayData.lateness.to
          ) {
            return (
              <div
                key={day}
                className="bg-white p-4 rounded-lg shadow-md text-slate-600"
              >
                <h3 className="text-lg font-semibold">{day}</h3>
                <p>
                  Datang dari jam {dayData.arrival.from.hours}:
                  {dayData.arrival.from.minutes} sampai {dayData.arrival.to.hours}:
                  {dayData.arrival.to.minutes}
                </p>
                <p>
                  Pulang dari jam {dayData.departure.from.hours}:
                  {dayData.departure.from.minutes} sampai {dayData.departure.to.hours}:
                  {dayData.departure.to.minutes}
                </p>
                <p>
                  Batas Terlambat dari jam {dayData.lateness.from.hours}:
                  {dayData.lateness.from.minutes} sampai {dayData.lateness.to.hours}:
                  {dayData.lateness.to.minutes}
                </p>
              </div>
            );
          }
          return null; // Tidak merender apapun jika data tidak lengkap
        })}
      </div>
    ) : (
      <p>Belum ada data yang disimpan.</p>
    )}
  </div>
</div>

          </div>

          {/* Kolom 2 - Hari dalam Seminggu */}
          <div className="p-4 border rounded-lg bg-white shadow-md">
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-slate-600">Hari Libur dalam Seminggu</h2>
            <div className="flex flex-wrap gap-4">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={day}
                    ref={(el) => checkboxRefs.current[day] = el}
                    className="mr-2"
                  />
                  <span className="font-semibold text-slate-600">{day}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-teal-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-500"
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Kolom Hasil */}
          <div className="p-4 border rounded-lg bg-slate-600  shadow-md mt-4">
            <h2 className="text-lg font-semibold mb-4  text-white"> Hari Libur</h2>
              <div className='bp-4 '>
                <div id="result" className="text-white">
                  {selectedDays.length > 0 ? (
                    <div className="flex flex-wrap gap-2 items-center">
                      {selectedDays.length === 1 ? (
                        <div>
                          <label className="block mb-1 text-white">{selectedDays[0]}</label>
                        </div>
                      ) : (
                        selectedDays.map((day, index) => (
                          <span key={day} className="flex items-center">
                            <label className="text-white">
                              {day}
                              {index < selectedDays.length - 1 ? ( // Add separators between days
                                index === selectedDays.length - 2 ? ' & ' : ', '
                              ) : ''}
                            </label>
                          </span>
                        ))
                      )}
                    </div>
                  ) : (
                    <p>Tidak ada hari libur yang dipilih.</p>
                  )}
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
   </> 
  );
};

export default Schedule;

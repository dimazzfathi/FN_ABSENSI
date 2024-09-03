// components/TimeDropdown.tsx
"use client";
import React from 'react';

interface TimeDropdownProps {
  time: string; // Time in "HH:mm" format
  onChange: (value: string) => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ time, onChange }) => {
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        options.push(formattedTime);
      }
    }
    return options;
  };

  return (
    <select
      value={time}
      onChange={(e) => onChange(e.target.value)} // Mengirimkan value langsung
      className="p-1 border rounded-md h-10 w-24 text-sm bg-white border-slate-400"
    >
      {generateTimeOptions().map((timeOption) => (
        <option key={timeOption} value={timeOption}>
          {timeOption}
        </option>
      ))}
    </select>
  );
};

export default TimeDropdown;
